/*
 * Copyright 2018 Teralytics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { DeckGL } from '@deck.gl/react';
import FlowMapLayer, { BasicProps, Flow, FlowLayerPickingInfo, PickingType } from '@flowmap.gl/core';
// import { Property } from 'csstype';
import React, { useState, useEffect, useRef } from 'react';
import { StaticMap } from 'react-map-gl';
import { ViewState } from '@flowmap.gl/core';

const FLOW_MAP_LAYER_ID = 'flow-map-layer';
export const HighlightType = {
  LOCATION_AREA: 'locationArea',
  LOCATION: 'location',
  FLOW: 'flow',
}

const ESC_KEY = 'Escape';

export default function FlowMap(props) {
  const defaultProps = {
    mixBlendMode: 'multiply'
  }
  const mapRef = useRef();
  const [animationFrame, setAnimationFrame] = useState(-1);

  const [selectedLocationIds, setSelectedLocationIds] = useState();
  useEffect(() => {
    if (props.selectedLocationIds !== selectedLocationIds) {
      setSelectedLocationIds(props.selectedLocationIds)
    }
  });

  const [viewState, setViewState] = useState(props.initialViewState);
  const [time, setTime] = useState(0)

  const [highlight, setHighlight] = useState();

  const handleKeyDown = (evt) => {
    if (evt instanceof KeyboardEvent && evt.key === ESC_KEY) {
      setSelectedLocationIds(undefined);
      setHighlight(undefined);
    }
  };

  const animate = usePrevious(props.animate);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    if (props.animate) {
      startAnimation();
    }
    if (props.onViewStateChange) {
      if (viewState) {
        props.onViewStateChange(viewState);
      }
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      stopAnimation();
    }
  }, []);



  useEffect(() => {
    if (animate !== props.animate) {
      if (animate) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }
  })

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  function startAnimation() {
    const loopLength = 1800; // unit corresponds to the timestamp in source data
    const animationSpeed = 30; // unit time per second
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    setTime(((timestamp % loopTime) / loopTime) * loopLength);
    setAnimationFrame(window.requestAnimationFrame(startAnimation));
  };

  function stopAnimation() {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
  }

  function getFlowMapLayer() {
    const {
      initialViewState,
      mapboxAccessToken,
      mixBlendMode,
      multiselect,
      animationTailLength,
      onSelected,
      onHighlighted,
      flows,
      locations,
      ...flowMapLayerProps
    } = props;

    return new FlowMapLayer({
      id: FLOW_MAP_LAYER_ID,
      animationCurrentTime: time,
      flows,
      locations,
      ...flowMapLayerProps,
      selectedLocationIds,
      animationTailLength,
      highlightedLocationId: highlight && highlight.type === HighlightType.LOCATION ? highlight.locationId : undefined,
      highlightedLocationAreaId:
        highlight && highlight.type === HighlightType.LOCATION_AREA ? highlight.locationId : undefined,
      highlightedFlow: highlight && highlight.type === HighlightType.FLOW ? highlight.flow : undefined,
      onHover: handleFlowMapHover,
      onClick: handleFlowMapClick,
    });
  }

  function doHighlight(highlight, info) {
    setHighlight(highlight)
    if (props.onHighlighted) {
      props.onHighlighted(highlight, info);
    }
  }

  function selectLocations(selectedLocationIds) {
    setSelectedLocationIds(selectedLocationIds)
    if (props.onSelected) {
      props.onSelected(selectedLocationIds);
    }
  }

  function handleFlowMapHover(info) {
    const { type, object } = info;
    switch (type) {
      case PickingType.FLOW: {
        if (!object) {
          doHighlight(undefined);
        } else {
          doHighlight(
            {
              type: HighlightType.FLOW,
              flow: object,
            },
            info,
          );
        }
        break;
      }
      case PickingType.LOCATION_AREA:
      case PickingType.LOCATION: {
        if (!object) {
          doHighlight(undefined);
        } else {
          doHighlight(
            {
              type: type === PickingType.LOCATION_AREA ? HighlightType.LOCATION_AREA : HighlightType.LOCATION,
              locationId: (props.getLocationId || FlowMapLayer.defaultProps.getLocationId.value)(object),
            },
            info,
          );
        }
        break;
      }
    }
  };

  function handleFlowMapClick({ type, object }) {
    switch (type) {
      case PickingType.LOCATION_AREA:
      case PickingType.LOCATION: {
        if (object) {
          const locationId = (props.getLocationId || FlowMapLayer.defaultProps.getLocationId.value)(object);
          const isSelected = selectedLocationIds && selectedLocationIds.indexOf(locationId) >= 0;
          let next;
          if (props.multiselect) {
            if (selectedLocationIds) {
              if (isSelected) {
                next = selectedLocationIds.filter(id => id !== locationId);
              } else {
                next = [...selectedLocationIds, locationId];
              }
            } else {
              next = [locationId];
            }
          } else {
            if (isSelected) {
              next = undefined;
            } else {
              next = [locationId];
            }
          }
          selectLocations(next);
          doHighlight(undefined);
        }
        break;
      }
    }
  };

  function handleViewStateChange({ viewState }) {
    setHighlight(undefined);
    setViewState(viewState)
    if (props.onViewStateChange) {
      props.onViewStateChange(viewState);
    }
  };
  const { mapboxAccessToken, mapStyle, mixBlendMode } = props;
  const flowMapLayer = getFlowMapLayer();
  return (
    <>
      <DeckGL
        style={{ mixBlendMode }}
        layers={[flowMapLayer]}
        viewState={viewState}
        controller={true}
        onViewStateChange={handleViewStateChange}
      >

        <StaticMap width="100%" height="100%" mapboxApiAccessToken={mapboxAccessToken} mapStyle={mapStyle} />
      </DeckGL>
    </>
  );
}