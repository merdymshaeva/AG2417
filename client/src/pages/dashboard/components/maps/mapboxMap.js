import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
// import turf from 'turf';
// import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { MAPBOX_ACCESS_TOKEN } from '../../../../config';
import s from './am4chartMap.module.scss';
import './map.css';
import { useDispatch, useSelector } from "react-redux";
import { promiseAction } from '../../../../actions/mapData';
import { MapboxLayer } from '@deck.gl/mapbox';
import { Deck } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
const INITIAL_VIEW_STATE = {
    longitude: -100,
    latitude: 40.7,
    zoom: 3,
    maxZoom: 15,
    pitch: 30,
    bearing: 30
  };


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


        // map.on('load', () => {
        //     axios.get('/api/get_markers_geojson')
        //     .then(response => {
        //         map.addSource('points', {
        //             type: 'geojson',
        //             data: response.data[0].row_to_json,
        //             cluster: true,
        //             clusterMaxZoom: 14, // Max zoom to cluster points on
        //             clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        //         });
        //         map.addLayer({
        //             id: 'cluster-count',
        //             type: 'circle',
        //             source: 'points',
        //             paint: {
        //                 'circle-color': 'blue',
        //                 'circle-radius': 10
        //             }
        //         });
        //     })
        //     .catch(err => console.error(err))
        // })



        // map.on('load', () => {
        //     if (mapData) {
        //         mapData.data[0].row_to_json.features.forEach(marker => {
        //             // make a marker for each feature and add to the map
        //             new mapboxgl.Marker()
        //                 .setLngLat(marker.geometry.coordinates)
        //                 .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        //                     .setHTML("Marker Name " + marker.properties.name))
        //                 .addTo(map);
        //         });
        //     }
        // $.ajax({
        //     type: 'GET',
        //     url: '/api/get_markers_geojson',
        //     async: false,
        //     success: function (data) {
        //         data[0].row_to_json.features.forEach(marker => {
        //             // make a marker for each feature and add to the map
        //             new mapboxgl.Marker()
        //                 .setLngLat(marker.geometry.coordinates)
        //                 .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        //                     .setHTML("Marker Name " + marker.properties.name))
        //                 .addTo(map);
        //         });
        //     }
        // });

        // });

        map.current.on('move', () => {
            setCenter([map.current.getCenter().lng.toFixed(4), map.current.getCenter().lat.toFixed(4)]);
            setZoom(map.current.getZoom().toFixed(2));
        });

        // map.on('click', (e) => {
        //     $.ajax({
        //         type: 'GET',
        //         url: '/api/get_closest_marker?lon=' + e.lngLat.lng + '&lat=' + e.lngLat.lat,
        //         async: false,
        //         success: function (data) {
        //             const id = `lines${e.lngLat.lng}-${e.lngLat.lat}`;
        //             if (!map.getSource(id)) {
        //                 map.addSource(id, {
        //                     'type': 'geojson',
        //                     'data': data[0].row_to_json
        //                 });
        //                 map.addLayer({
        //                     id,
        //                     source: id,
        //                     type: 'line'
        //                 });
        //             }
        //         }
        //     })
        // });

        // =========== Double click to Create Markers ====================
        // function open_popup(e) {
        //     var popupLocation = new L.LatLng(e.lngLat.lat,
        //         e.lngLat.lng);
        //     var popupContent =
        //         `<div id='report'>
        // 			<h1 class='report-title'>Data Form</h1>
        // 			<p id='report-field-lat'>
        // 				<span class='report-field-label'>Lat: </span>
        // 				<span class='report-field-value'> ${e.lngLat.lat}</span > 
        // 			</p> 
        // 			<p id='report-field-lon'>
        // 				<span class='report-field-label'>Lng: </span>
        // 				<span class='report-field-value'>${e.lngLat.lng}</span> 
        // 			</p> 
        // 			<p id='report-field-3'>
        // 				<span class='report-field-label'>Name: </span>
        // 				<input id='marker_name'>
        // 			</p>
        // 			<div class='report-btns'>
        // 				<button id='save-button'>save</button>
        // 			</div>
        // 		</div>`;
        //     var popup = new mapboxgl.Popup()
        //         .setLngLat(popupLocation)
        //         .setHTML(popupContent)
        //         .setMaxWidth("300px")
        //         .addTo(map);

        //     $(document).on('click', '#save-button', function (e) {
        //         // PREPARE FORM DATA
        //         var loc_data =
        //         {
        //             name: document.getElementById("marker_name").value,
        //             lat: $('#report-field-lat .report-field-value').text(),
        //             lon: $('#report-field-lon .report-field-value').text()
        //         }
        //         // DO POST
        //         $.ajax({
        //             type: "POST",
        //             contentType: "application/json",
        //             url: "/save_marker",
        //             data: JSON.stringify(loc_data),
        //             success: function (marker) {
        //                 popup.remove();
        //                 new mapboxgl.Marker()
        //                     .setLngLat([loc_data.lon, loc_data.lat])
        //                     .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        //                         .setHTML("Marker Name " + loc_data.name))
        //                     .addTo(map);
        //             },
        //             error: function (e) {
        //                 alert("Error!");
        //                 console.log("ERROR: ", e);
        //             }
        //         });
        //     });
        // }
        // map.on('dblclick', e => {
        //     console.log('dbclick' + e.lngLat);
        //     open_popup(e);
        // });

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

        // var draw = new MapboxDraw({
        //     displayControlsDefault: false,
        //     controls: {
        //         polygon: true,
        //         trash: true
        //     }
        // });
        // map.addControl(draw);

        // map.on('draw.create', updateArea);
        // map.on('draw.delete', updateArea);
        // map.on('draw.update', updateArea);

        // function updateArea(e) {
        //     var data = draw.getAll();
        //     var answer = document.getElementById('calculated-area');
        //     if (data.features.length > 0) {
        //         var area = turf.area(data);
        //         // restrict to area to 2 decimal points
        //         var rounded_area = Math.round(area * 100) / 100;
        //         answer.innerHTML =
        //             '<p><strong>' +
        //             rounded_area +
        //             '</strong></p><p>square meters</p>';
        //     } else {
        //         answer.innerHTML = '';
        //         if (e.type !== 'draw.delete')
        //             alert('Use the draw tools to draw a polygon!');
        //     }
        // }

    }, []);

    useEffect(() => {
        if (map.current && mapData) {
            const myScatterplotLayer = new MapboxLayer({
                id: 'my-scatterplot',
                type: ScatterplotLayer,
                data: [
                    {position: [-74.5, 40], size: 100}
                ],
                getPosition: d => d.position,
                getRadius: d => d.size,
                getColor: [255, 0, 0]
            });
            map.current.on('load', () => {
                // add to mapbox
                map.current.addLayer(myScatterplotLayer);
                console.log(map.current.getLayer('my-scatterplot'))
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