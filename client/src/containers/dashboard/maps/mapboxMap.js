/// app.js
import React, {useState, createRef, useEffect, useRef} from 'react';
import DeckGL from 'deck.gl';
import {Deck} from '@deck.gl/core';
import { LineLayer, ScatterplotLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import { MAPBOX_ACCESS_TOKEN } from '../../../config';
import s from './am4chartMap.module.scss';


// Viewport settings
const INITIAL_VIEW_STATE = {
    latitude: 37.8,
    longitude: -122.45,
    zoom: 15
  };


function MapFrame() {
    const [center, setCenter] = useState([18.061527, 59.312578]);
    const [zoom, setZoom] = useState(11);
    var deckgl;
    const refs = createRef();
    const layers = [
        new ScatterplotLayer({
            data: [
              {position: [-122.45, 37.8], color: [255, 0, 0], radius: 1000}
            ]
          }),
    ];

    useEffect(() => {
        deckgl = new DeckGL({
            container: refs.current,
            initialViewState: INITIAL_VIEW_STATE,
            controller: true,
            layers: [
              new ScatterplotLayer({
                data: [
                  {position: [-122.45, 37.8], color: [255, 0, 0], radius: 100}
                ],
                getColor: d => d.color,
                getRadius: d => d.radius
              })
            ]
          });
        console.log(deckgl)
    }, [])

    return (
        <div className={s.mapChart}>
            <div className={s.sidebarStyle}>
                <div>Longitude: {center[0]} | Latitude: {center[1]} | Zoom: {zoom}</div>
            </div>
            <div ref={refs} className={s.map} id='map' />
        </div>
        // <DeckGL
        //     initialViewState={INITIAL_VIEW_STATE}
        //     controller={true}
        //     layers={layers}
        // >
        //     <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
        // </DeckGL>
    );
}
export default MapFrame;