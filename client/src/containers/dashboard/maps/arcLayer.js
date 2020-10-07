/* global fetch */
import React, { useState, useMemo } from 'react';
import { render } from 'react-dom';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';
import {MapboxLayer} from '@deck.gl/mapbox'

import axios from 'axios';
import { withFetchJson } from './utils/withFetch';
import pipe from './utils/pipe';
import FlowMapLayer, { Flow, Location } from '@flowmap.gl/core';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
const locationUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/locations.json';
const flowUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/flows-2015.json'

const getLocationId = (loc) => loc.properties.abbr;
const DARK_COLORS = {
  darkMode: true,
  flows: {
    scheme: [
      'rgb(0, 22, 61)',
      'rgb(0, 27, 62)',
      'rgb(0, 36, 68)',
      'rgb(0, 48, 77)',
      'rgb(3, 65, 91)',
      'rgb(48, 87, 109)',
      'rgb(85, 115, 133)',
      'rgb(129, 149, 162)',
      'rgb(179, 191, 197)',
      'rgb(240, 240, 240)',
    ],
  },
  locationAreas: {
    normal: '#334',
  },
  outlineColor: '#000',
};

export default function arcLayer() {
  pipe(
    withFetchJson('locations', locationUrl),
    withFetchJson('flows', flowUrl),
  )(({ locations, flows }) => {
    const flowMapLayer = new FlowMapLayer({
      id: 'flow-map-layer',
      locations,
      flows,
      getLocationId: (loc) => loc.properties.abbr,
      getFlowMagnitude: (f) => f.count,
    });
    return (
      <DeckGL
        style={{ mixBlendMode: 'multiply' }}
        controller={true}
        initialViewState={getViewStateForFeatures(locations, [window.innerWidth, window.innerHeight])}
        layers={[flowMapLayer]}
      >
        <StaticMap mapboxApiAccessToken={mapboxAccessToken} width="100%" height="100%" />
      </DeckGL>
    );
  })

}


