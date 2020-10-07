import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import './node_modules/mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
// import turf from 'turf';
// import MapboxDraw from "@mapbox/mapbox-gl-draw";
import './node_modules/@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { MAPBOX_ACCESS_TOKEN } from '../../../../config';
import s from './am4chartMap.module.scss';
import './map.css';
import { useDispatch, useSelector } from "react-redux";
import { promiseAction } from '../../../../actions/mapAction';
import { ScatterplotLayer, LineLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import { withFetchJson } from './utils/withFetch';
import pipe from './utils/pipe';
import FlowMapLayer, { Flow, Location } from '@flowmap.gl/core';
import FlowMap, { DiffColorsLegend, getViewStateForFeatures, LegendBox, LocationTotalsLegend } from '@flowmap.gl/react';
import axios from 'axios';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
const INITIAL_VIEW_STATE = {
    longitude: -100,
    latitude: 40.7,
    zoom: 3,
    maxZoom: 15,
    pitch: 30,
    bearing: 30
};

const locationUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/locations.json';
const flowUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/flows-2015.json'


function MapFrame() {
    const [center, setCenter] = useState([18.061527, 59.312578]);
    const [zoom, setZoom] = useState(11);


    const requestLocs = axios.get(locationUrl);
    const requestFls = axios.get(flowUrl);

    const [locations, setLocations] = useState();
    const [flows, setFlows] = useState();
    useEffect(() => {
        axios.all([requestLocs, requestFls])
            .then(axios.spread((locRes, flRes) => {
                setLocations(locRes.data);
                setFlows(flRes.data);
            }))
    }, [])

    const getLocationId = (loc) => loc.properties.abbr;
    return (
        locations ? <div className={s.mapChart}>
            <div className={s.sidebarStyle}>
                <div>Longitude: {center[0]} | Latitude: {center[1]} | Zoom: {zoom}</div>
            </div>
            <FlowMap
                pickable={true}
                getLocationId={getLocationId}
                flows={flows}
                locations={locations}
                initialViewState={getViewStateForFeatures(locations, [window.innerWidth, window.innerHeight])}
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            />
            <LegendBox bottom={35} left={10}>
                <LocationTotalsLegend />
            </LegendBox>
        </div>
            : <p>Loading...</p>
    );

    // const maxZoom = 18;
    // const attribution = `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, 
    // <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, 
    // Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`;

    // const map = useRef()
    // const refs = React.createRef();
    // const dispatch = useDispatch();

    // const mapData = useSelector(state => state.mapData)
    // useEffect(() => {

    //     dispatch(promiseAction('/api/get_markers_geojson', "GET_DATA"));
    //     map.current = new mapboxgl.Map({
    //         container: refs.current, // undefined before mapFrame is mounted
    //         style: 'mapbox://styles/mapbox/streets-v11',
    //         doubleClickZoom: false,
    //         center,
    //         zoom,
    //     });

    //     map.current.on('move', () => {
    //         setCenter([map.current.getCenter().lng.toFixed(4), map.current.getCenter().lat.toFixed(4)]);
    //         setZoom(map.current.getZoom().toFixed(2));
    //     });


    //     map.current.addControl(
    //         new MapboxGeocoder({
    //             accessToken: mapboxgl.accessToken,
    //             marker: {
    //                 color: 'orange'
    //             },
    //             mapboxgl: mapboxgl
    //         })
    //     );
    //     // Add zoom and rotation controls to the map.
    //     map.current.addControl(new mapboxgl.NavigationControl());

    // }, []);

    // useEffect(() => {
    //     if (map.current && mapData) {
    //         const myScatterplotLayer = new MapboxLayer({
    //             id: 'my-scatterplot',
    //             type: ScatterplotLayer,
    //             data: [
    //                 {position: [-74.5, 40], size: 100}
    //             ],
    //             getPosition: d => d.position,
    //             getRadius: d => d.size,
    //             getColor: [255, 0, 0]
    //         });
    //         map.current.on('load', () => {
    //             // add to mapbox
    //             map.current.addLayer(myScatterplotLayer);
    //             console.log(map.current.getLayer('my-scatterplot'))
    //             if (!map.current.getSource('points')) {
    //                 map.current.addSource('points', {
    //                     type: 'geojson',
    //                     data: mapData.data[0].row_to_json,
    //                     cluster: true,
    //                     clusterMaxZoom: 14, // Max zoom to cluster points on
    //                     clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    //                 });
    //             }
    //             if (!map.current.getLayer('cluster-count')) {
    //                 map.current.addLayer({
    //                     id: 'cluster-count',
    //                     type: 'circle',
    //                     source: 'points',
    //                     paint: {
    //                         'circle-color': 'blue',
    //                         'circle-radius': 10
    //                     }
    //                 });
    //             }
    //         })
    //     }
    // }, [mapData])




    // return (
    //     <div className={s.mapChart}>
    //         <div className={s.sidebarStyle}>
    //             <div>Longitude: {center[0]} | Latitude: {center[1]} | Zoom: {zoom}</div>
    //         </div>
    //         <div ref={refs} className={s.map} id='map' />
    //     </div>
    // )
}

export default MapFrame;