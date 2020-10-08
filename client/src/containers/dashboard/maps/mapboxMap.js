/// app.js
import React, {createRef} from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import { MAPBOX_ACCESS_TOKEN } from '../../../config';


// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13,
    pitch: 0,
    bearing: 0
};

// Data to be used by the LineLayer
const data = [
    { sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] }
];

export default function mapFrame({ data }) {
    const refs = createRef();
    const layers = [
        new LineLayer({ id: 'line-layer', data })
    ];

    const deck = new DeckGL({
        mapboxAccessToken: INITIAL_VIEW_STATE,
        mapStyle: 'https://free.tilehosting.com/styles/positron/style.json?key=2OrAmqAgbK4HwBOq6vWN',
        container: refs.current,
        latitude: 38,
        longitude: 35.8,
        zoom: 5.9,
        maxZoom: 16,
        pitch: 45,
        layers: [layers]
    });
    return (
        <div ref={refs}>
            <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
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