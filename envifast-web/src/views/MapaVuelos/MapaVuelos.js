import React from 'react';
import './../../App';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'; // objeto principal para los mapas
import { getCoordenadasAeropuertos } from '../../services/envios/EnviosServices';
import Markers from '../../components/Markers/Markers';
import AirportLocation from '../../components/AirportLocation/AirportLocation';

import 'leaflet/dist/leaflet.css'; // 
import './MapaVuelos.css';
import L from "leaflet";


 const MapaVuelos  = (props) => {
    // const MapaVuelos  = () => {

        const [airportsCoordinates, setAirportsCoordinates] = React.useState([])

        const getIcon = () => {
            return L.icon({
                iconUrl : require("../../assets/icons/aeropuerto.png"),
                iconRetinaUrl: require("../../assets/icons/aeropuerto.png"),
                iconSize : 20
            })
        }

        React.useEffect(() => {
            getCoordenadasAeropuertos()
            .then(function (response) {
                // setAirportsCoordinates(response.data);
                var array = [];
                for (const element of response.data) {
                    array.push({
                        id: element.id,
                        cityName: element.cityName,
                        lat: element.x_pos,
                        lng: element.y_pos
                    })
                };
                setAirportsCoordinates(array);
                console.log(airportsCoordinates)
            })
            .catch(function (error) {
                console.log(error);
            })
        },[])

        const AirportMarket = () => {
            return (
                <>
                {airportsCoordinates.map((airport) => (
                    <Marker position={[airport.lat , airport.lng]} icon={getIcon()}></Marker>
                ))}
                </> 
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