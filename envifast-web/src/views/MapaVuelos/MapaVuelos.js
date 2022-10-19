import React from 'react';
import './../../App';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'; // objeto principal para los mapas
import { getCoordenadasAeropuertos } from '../../services/envios/EnviosServices';
import Markers from '../../components/Markers/Markers';
import AirportLocation from '../../components/AirportLocation/AirportLocation';

import 'leaflet/dist/leaflet.css'; // 
import './MapaVuelos.css';
import L from "leaflet";

import AirplaneMarker from "./AirplaneMarker";
import {useState} from 'react'
import { Grid, Typography } from '@mui/material';

const dataStory = [
    {
        // Lima: -12.098056, -77.015278
      lat: -12.098056,
      lng: -77.015278
    },
    {   // Madrid: 40.472222, -3.560833
      lat: 40.472222,
      lng: -3.560833
    }
  ];


  let cursor = 0;

 const MapaVuelos  = (props) => {
    const [currentTrack, setCurrentTrack] = useState({});

    const [airportsCoordinates, setAirportsCoordinates] = React.useState([])

    const getIcon = () => {
        return L.icon({
            iconUrl : require("../../assets/icons/aeropuerto.png"),
            iconRetinaUrl: require("../../assets/icons/aeropuerto.png"),
            iconSize : 20
        })
    }

    React.useEffect(() => {
        setCurrentTrack(dataStory[cursor]);
    
        const interval = setInterval(() => {
          if (cursor === dataStory.length - 1) {
            cursor = 0;
            setCurrentTrack(dataStory[cursor]);
            return;
          }
    
          cursor += 1;
          setCurrentTrack(dataStory[cursor]);
        }, 1000);
        return () => {
          clearInterval(interval);
        };
    }, []);

    // para la animacion
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
            <Grid item container className='containerMapa'>
                <Typography className='title'>Mapa de vuelos</Typography>
                <MapContainer
                    className="mapa-vuelo"
                    center = {{lat: '28.058522', lng: '-20.591226'}}
                    zoom = {2.8}
                    minZoom = {2.0}
                    maxZoom = {18.0}
                >
                    <AirportMarket/>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'></TileLayer>
                    <AirplaneMarker data={currentTrack ?? {}} />
                </MapContainer>
            </Grid>
        </div>
    )
}

export default MapaVuelos;