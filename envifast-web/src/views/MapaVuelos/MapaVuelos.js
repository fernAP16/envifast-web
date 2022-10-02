import React from 'react';
import './../../App';
import {MapContainer, TileLayer, Marker} from 'react-leaflet'; // objeto principal para los mapas
import AirportLocation from '../../components/AirportLocation/AirportLocation';

import 'leaflet/dist/leaflet.css'; // 
import './MapaVuelos.css'


// const MapaVuelos  = (props) => {
    const MapaVuelos  = () => {
    // hooks
    // hooks
    // center es una propiedad que indica la ubicacion inicial en el mapa. Recibe en un objeto la latitud y longitud
    // zoom: tambien es una propiedad para ver que tan cerca o lejos queremos ver nuestro mapa
    // return <div>
    //         <h3>Mapa de vuelos</h3>
        //    return <MapContainer center = {{lat: '28.058522', lng: '-20.591226'}} zoom = {2.8}>
        //         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'>

        //         </TileLayer>
        //     </MapContainer>
        //     <Marker position={{lat:-12.0219,lng:-77.1112}}></Marker>
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
                    <AirportMarket/>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'></TileLayer>
                </MapContainer>
                
            </div>
        )
}


export default MapaVuelos;