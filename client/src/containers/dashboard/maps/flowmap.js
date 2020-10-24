import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { MAPBOX_ACCESS_TOKEN } from '../../../config';
import s from './am4chartMap.module.scss';
import './map.css';
import ClusteringExample from './utils/clusteringExample';
import { useSelector, useDispatch } from "react-redux";
import { promiseAction, GET_FLOW, GET_LOC, SET_URL } from '../../../actions/mapAction';
import turf from 'turf';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// default flowlayer and location layer
const locationUrl = "/api/get_locations"; // process.env.PUBLIC_URL + "/basemma.geojson";//
const flowUrl = '/api/get_flows/auxtimepeakt';


function MapFrame() {
    const dispatch = useDispatch();
    const { locations, flows } = useSelector(state => state.mapData.data);
    useEffect(() => {
        dispatch({type: SET_URL, value: flowUrl});
        dispatch(promiseAction({ url: locationUrl }, GET_LOC));
        dispatch(promiseAction({ url: flowUrl, params: {minLength: 1, maxLength: 100}}, GET_FLOW)); // 
    }, [])

    return (
        <div className={s.mapChart}>
            {locations && flows ? <ClusteringExample
                locations={locations}
                flows={flows}
                getLocationId={(loc) => loc.properties.abbr}
                getLocationCentroid={(loc) => turf.centroid(loc).geometry.coordinates
                }
                getFlowOriginId={(flow) => flow.origin}
                getFlowDestId={(flow) => flow.dest}
                getFlowMagnitude={(flow) => +flow.count}
            />
                : <p>Loading...</p>}
        </div>

    );
}

export default MapFrame;