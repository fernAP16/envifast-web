import React from 'react';
import './../../App';
import {MapContainer, TileLayer} from 'react-leaflet'; // objeto principal para los mapas
import 'leaflet/dist/leaflet.css'; // 


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


        return <div>
                <h3>Mapa de vuelos</h3>
                <MapContainer center = {{lat: '28.058522', lng: '-20.591226'}} zoom = {2.8}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'>

                </TileLayer>
                </MapContainer>
            </div>
        // </div>;
}


export default MapaVuelos;