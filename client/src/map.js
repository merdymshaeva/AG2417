import React, { useState, useEffect } from "react";
import L, { map } from "leaflet";
import turf from "turf";
import $ from "jquery";
import {
    Map, TileLayer, Marker, Popup, ZoomControl, GeoJSON,
    LayersControl,
    LayerGroup,
} from "react-leaflet";

function onEachFeature(feature, layer) {
    var popupContent = "Marker Name " + feature.properties.name;
    layer.bindPopup(popupContent);
};

var myIcon = L.icon({
    iconUrl: 'center.png',
    iconSize: [38, 60],
    iconAnchor: [22, 50],
    popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

const { BaseLayer, Overlay } = LayersControl

function MapFrame() {
    const center = [59.312578, 18.061527];
    const zoom = 11;
    const maxZoom = 18;
    const attribution = `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, 
    <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, 
    Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`;

    const [markers, setMarkers] = useState();

    useEffect(() => {
        $.ajax({
            type: 'GET',
            url: '/api/get_markers_geojson',
            async: false,
            success: function (data) {
                setMarkers(data[0].row_to_json);
            }
        });
    }, []);

    const [buffers, setBuffers] = useState([]);
    const [lines, setLines] = useState([]);

    function Identify(e) {
        $.ajax({
            type: 'GET',
            url: '/api/get_closest_marker?lon=' + e.latlng.lng + '&lat=' + e.latlng.lat,
            async: false,
            success: function (data) {
                setBuffers([...buffers, data[0].row_to_json]);
                setLines([...lines, data[1].row_to_json]);
            }
        });
    }
    const [{ popupLat, popupLng }, setPopupLocation] = useState({});
    const popupContent = (<div id='report'>
        <h1 className='report-title'>Data Form</h1>
        <p id='report-field-lat'>
            <span className='report-field-label'>Lat: </span>
            <span className='report-field-value'> {popupLat}</span >
        </p>
        <p id='report-field-lon'>
            <span className='report-field-label'>Lng: </span>
            <span className='report-field-value'>{popupLng}</span>
        </p>
        <p id='report-field-3'>
            <span className='report-field-label'>Name: </span>
            <input id='marker_name' />
        </p>
        <div className='report-btns'>
            <button id='save-button'>save</button>
        </div>
    </div>)


    function open_popup(e) {
        setPopupLocation({
            popupLat: e.latlng.lat,
            popupLng: e.latlng.lng
        });
        console.log(popupLat)
    }

    return (
        <Map center={center} zoom={zoom} onclick={Identify} ondblclick={(e) => open_popup(e)}>
            <LayersControl position="topright">
                <BaseLayer checked name="OpenStreetMap.Mapnik">
                    <TileLayer // basemap
                        url='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
                        attribution={attribution}
                        maxZoom={maxZoom}
                        id='mapbox.streets'
                    />
                </BaseLayer>
                <Overlay name="Marker with popup">
                    <GeoJSON
                        data={markers}
                        onEachFeature={onEachFeature}
                    />
                    <LayerGroup>
                        {buffers.map((buffer, idx) =>
                            <GeoJSON
                                key={idx}
                                data={buffer}
                            />
                        )}
                        {lines.map((line, idx) =>
                            <GeoJSON
                                key={idx}
                                data={line}
                            />
                        )}                        
                    </LayerGroup>
                    {/* {popupLat && <Marker position={[popupLat, popupLng]}><Popup position={[popupLat, popupLng]} autoClose={false}>{popupContent}</Popup></Marker>} */}

                </Overlay>                
            </LayersControl>
            {popupLat && <div className="popup container"><Popup position={[popupLat, popupLng]} >{popupContent}</Popup></div>}
        </Map>
    )
}

export default MapFrame;