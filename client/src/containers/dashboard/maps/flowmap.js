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
import { dataPromiseAction } from '../../../actions/mapAction';
import turf from 'turf';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// const locationUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/locations.json';
// const flowUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/flows-2015.json';

const locationUrl =  process.env.PUBLIC_URL + "/basemma.geojson";//"/api/get_locations"; //
const flowUrl = '/api/get_flows/AuxTimePeakT';


function MapFrame() {
    const dispatch = useDispatch();
    // const [center, setCenter] = useState([18.061527, 59.312578]);
    // const [zoom, setZoom] = useState(11);

    const {locations, flows} = useSelector(state => state.mapData.data);
    useEffect(() => {
        dispatch(dataPromiseAction({ locationUrl, flowUrl }, "GET_DATA"));
    }, [])

    // const getLocationId = (loc) => loc.properties.abbr;
    var a = 0;
    return (
        <div className={s.mapChart}>
            {locations && flows ? <ClusteringExample
                locations={locations}
                flows={flows}
                getLocationId={(loc) => loc.properties.abbr}
                // getLocationId={(loc) => loc.properties.abbr
                getLocationCentroid={(loc) =>  turf.centroid(loc).geometry.coordinates

                }
                // getLocationCentroid={(loc) => loc.properties.centroid}
                getFlowOriginId={(flow) => flow.origin}
                getFlowDestId={(flow) => flow.dest}
                // getFlowDestId={(flow) => flow.dest}
                getFlowMagnitude={(flow) => +flow.count}
            />
                : <p>Loading...</p>}
        </div>

    );
}

export default MapFrame;