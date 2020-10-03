import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import $ from "jquery";
import L from 'leaflet';

mapboxgl.accessToken = 'pk.eyJ1IjoiaHVpemhhbmciLCJhIjoiY2tlamlxcHE4MHVoYzJzcGNtY3R5dTQzcSJ9.7ySwoq7hoELqb657OzQpfQ';

function onEachFeature(feature, layer) {
    var popupContent = "Marker Name " + feature.properties.name;
    layer.bindPopup(popupContent);
};


function MapFrame() {
    const [center, setCenter] = useState([18.061527, 59.312578]);
    const [zoom, setZoom] = useState(11);
    const maxZoom = 18;
    const attribution = `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, 
    <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, 
    Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`;

    var map;
    const refs = React.createRef();
    useEffect(() => {
        map = new mapboxgl.Map({
            container: refs.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            doubleClickZoom: false,
            center,
            zoom,
        });

        map.on('load', () => {
            $.ajax({
                type: 'GET',
                url: '/api/get_markers_geojson',
                async: false,
                success: function (data) {
                    data[0].row_to_json.features.forEach(marker => {
                        // make a marker for each feature and add to the map
                        new mapboxgl.Marker()
                            .setLngLat(marker.geometry.coordinates)
                            .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                                .setHTML("Marker Name " + marker.properties.name))
                            .addTo(map);
                    });
                }
            });

        });

        map.on('move', () => {
            setCenter([map.getCenter().lng.toFixed(4), map.getCenter().lat.toFixed(4)]);
            setZoom(map.getZoom().toFixed(2));
        });

        map.on('click', (e) => {
            $.ajax({
                type: 'GET',
                url: '/api/get_closest_marker?lon=' + e.lngLat.lng + '&lat=' + e.lngLat.lat,
                async: false,
                success: function (data) {
                    const id = `lines${e.lngLat.lng}-${e.lngLat.lat}`;
                    if (!map.getSource(id)) {
                        map.addSource(id, {
                            'type': 'geojson',
                            'data': data[0].row_to_json
                        });
                        map.addLayer({
                            id,
                            source: id,
                            type: 'line'
                        });
                    }
                }
            })
        });

        // =========== Double click to Create Markers ====================
        function open_popup(e) {
            var popupLocation = new L.LatLng(e.lngLat.lat,
                e.lngLat.lng);
            var popupContent =
                `<div id='report'>
					<h1 class='report-title'>Data Form</h1>
					<p id='report-field-lat'>
						<span class='report-field-label'>Lat: </span>
						<span class='report-field-value'> ${e.lngLat.lat}</span > 
					</p> 
					<p id='report-field-lon'>
						<span class='report-field-label'>Lng: </span>
						<span class='report-field-value'>${e.lngLat.lng}</span> 
					</p> 
					<p id='report-field-3'>
						<span class='report-field-label'>Name: </span>
						<input id='marker_name'>
					</p>
					<div class='report-btns'>
						<button id='save-button'>save</button>
					</div>
				</div>`;
            var popup = new mapboxgl.Popup()
                .setLngLat(popupLocation)
                .setHTML(popupContent)
                .setMaxWidth("300px")
                .addTo(map);

            $(document).on('click', '#save-button', function (e) {
                // PREPARE FORM DATA
                var loc_data =
                {
                    name: document.getElementById("marker_name").value,
                    lat: $('#report-field-lat .report-field-value').text(),
                    lon: $('#report-field-lon .report-field-value').text()
                }
                // DO POST
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/save_marker",
                    data: JSON.stringify(loc_data),
                    success: function (marker) {
                        popup.remove();
                        new mapboxgl.Marker()
                            .setLngLat([loc_data.lon, loc_data.lat])
                            .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                                .setHTML("Marker Name " + loc_data.name))
                            .addTo(map);
                    },
                    error: function (e) {
                        alert("Error!");
                        console.log("ERROR: ", e);
                    }
                });
            });
        }
        map.on('dblclick', e => {
            console.log('dbclick' + e.lngLat);
            open_popup(e);
        });

    }, []);



    return (
        <div>
            <div className='sidebarStyle'>
                <div>Longitude: {center[0]} | Latitude: {center[1]} | Zoom: {zoom}</div>
            </div>
            <div ref={refs} className="mapContainer" />
        </div>
    )
}

export default MapFrame;