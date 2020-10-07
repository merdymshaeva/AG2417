import React, { useState, useEffect, useRef, useDebugValue } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { MAPBOX_ACCESS_TOKEN } from '../../../config';
import s from './am4chartMap.module.scss';
import './map.css';
import ClusteringExample from './utils/clusteringExample';
import { useSelector, useDispatch } from "react-redux";
import { promiseAction } from '../../../actions/mapAction';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const locationUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/locations.json';
const flowUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/flows-2015.json'


function MapFrame() {
    const dispatch = useDispatch();
    // const [center, setCenter] = useState([18.061527, 59.312578]);
    // const [zoom, setZoom] = useState(11);

    const data = useSelector(state => state.mapData.data);
    useEffect(() => {
        dispatch(promiseAction({ locationUrl, flowUrl }, "GET_DATA"));
    }, [])

    // const getLocationId = (loc) => loc.properties.abbr;
    return (
        <div className={s.mapChart}>
            {data && data.flows ? <ClusteringExample
                locations={data.locations}
                flows={data.flows}
                getLocationId={(loc) => loc.properties.abbr}
                getLocationCentroid={(loc) => loc.properties.centroid}
                getFlowOriginId={(flow) => flow.origin}
                getFlowDestId={(flow) => flow.dest}
                getFlowMagnitude={(flow) => +flow.count}
            />
                : <p>Loading...</p>}
        </div>

    );
}

export default MapFrame;