import React from 'react';
import './../../App';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'; // objeto principal para los mapas
import AirportLocation from '../../components/AirportLocation/AirportLocation';

import 'leaflet/dist/leaflet.css'; // 
import './MapaVuelos.css'
// import '../../assets/icons/airport-01.svg'
import L from "leaflet"


function getIcon(_iconSize){
    return L.icon({
        // iconUrl : require("../../assets/icons/airport-01.svg"),
        // iconRetinaUrl: require("../../assets/icons/airport-01.svg"),
        iconUrl : require("../../assets/icons/aeropuerto.png"),
        iconRetinaUrl: require("../../assets/icons/aeropuerto.png"),
        iconSize : _iconSize
    })
}

// const MapaVuelos  = (props) => {
    const MapaVuelos  = () => {
    
        const AirportMarket = () => {
            return (
                <Marker position={{lat:-12.0219,lng:-77.1112}} img={<AirportLocation/>}></Marker>
            )
        }

        return (
            <div>
                <h3>Mapa de vuelos</h3>
                <MapContainer
                    className="mapaVuelo"
                    center = {{lat: '28.058522', lng: '-20.591226'}}
                    zoom = {2.8}
                    minZoom = {2.0}
                    maxZoom = {18.0}
                >
                    <Marker position={["28.058522", "-20.591226"]} icon = {getIcon(20)}> 
                        <Popup> A pretty CSS3 group</Popup>
                    </Marker>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'></TileLayer>
                </MapContainer>
                
            </div>
        )
}


export default MapaVuelos;