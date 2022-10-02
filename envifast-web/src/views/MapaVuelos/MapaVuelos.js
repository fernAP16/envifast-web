import React from 'react';
import './../../App';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'; // objeto principal para los mapas
import Markers from '../../components/Markers/Markers';
import AirportLocation from '../../components/AirportLocation/AirportLocation';

import 'leaflet/dist/leaflet.css'; // 
import './MapaVuelos.css';
import L from "leaflet";

// const MapaVuelos  = (props) => {
    const MapaVuelos  = () => {

        const [airportsCoordinates, setAirportsCoordinates] = React.useState([{
            id: 1,
            lat: -12.0219,
            lng: -77.1112
        },{
            id: 2,
            lat: 4.70083,
            lng: -74.1415
        }])
            

        const getIcon = () => {
            return L.icon({
                iconUrl : require("../../assets/icons/aeropuerto.png"),
                iconRetinaUrl: require("../../assets/icons/aeropuerto.png"),
                iconSize : 20
            })
        }
    
        const AirportMarket = () => {
            return (
                <>
                {airportsCoordinates.map((airport) => (
                    <Marker position={[airport.lat , airport.lng]} icon={getIcon()}></Marker>
                ))}
                </> 
            )
        }

        const Airports = () => {

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
                    <AirportMarket/>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'></TileLayer>
                </MapContainer>
                
            </div>
        )
}


export default MapaVuelos;