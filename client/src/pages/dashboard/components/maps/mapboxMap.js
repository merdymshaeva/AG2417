import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { MAPBOX_ACCESS_TOKEN } from '../../../../config';
import s from './am4chartMap.module.scss';
import './map.css';
import { useDispatch, useSelector } from "react-redux";
import { promiseAction } from '../../../../actions/mapData';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;


function MapFrame() {
    const [center, setCenter] = useState([18.061527, 59.312578]);
    const [zoom, setZoom] = useState(11);
    const maxZoom = 18;
    const attribution = `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, 
    <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, 
    Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`;

    const map = useRef()
    const refs = React.createRef();
    const dispatch = useDispatch();

    const mapData = useSelector(state => state.mapData)
    useEffect(() => {

        dispatch(promiseAction('/api/get_markers_geojson', "GET_DATA"));
        map.current = new mapboxgl.Map({
            container: refs.current, // undefined before mapFrame is mounted
            style: 'mapbox://styles/mapbox/streets-v11',
            doubleClickZoom: false,
            center,
            zoom,
        });

        map.current.on('move', () => {
            setCenter([map.current.getCenter().lng.toFixed(4), map.current.getCenter().lat.toFixed(4)]);
            setZoom(map.current.getZoom().toFixed(2));
        });

 
        map.current.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                marker: {
                    color: 'orange'
                },
                mapboxgl: mapboxgl
            })
        );
        // Add zoom and rotation controls to the map.
        map.current.addControl(new mapboxgl.NavigationControl());

    }, []);

    useEffect(() => {
        if (map.current && mapData) {
            map.current.on('load', () => {
                if (!map.current.getSource('points')) {
                    map.current.addSource('points', {
                        type: 'geojson',
                        data: mapData.data[0].row_to_json,
                        cluster: true,
                        clusterMaxZoom: 14, // Max zoom to cluster points on
                        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                    });
                }
                if (!map.current.getLayer('cluster-count')) {
                    map.current.addLayer({
                        id: 'cluster-count',
                        type: 'circle',
                        source: 'points',
                        paint: {
                            'circle-color': 'blue',
                            'circle-radius': 10
                        }
                    });
                }
            })
        }
    }, [mapData])




    return (
        <div className={s.mapChart}>
            <div className={s.sidebarStyle}>
                <div>Longitude: {center[0]} | Latitude: {center[1]} | Zoom: {zoom}</div>
            </div>
            <div ref={refs} className={s.map} id='map' />
        </div>
    )
}

export default MapFrame;