import React from 'react';
import './../../App';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'; // objeto principal para los mapas
import { getCoordenadasAeropuertos, getVuelosPorDia } from '../../services/envios/EnviosServices';
import Markers from '../../components/Markers/Markers';
import AirportLocation from '../../components/AirportLocation/AirportLocation';

import 'leaflet/dist/leaflet.css'; // 
import './MapaVuelos.css';
import L from "leaflet";

import AirplaneMarker from "./AirplaneMarker";
import {useState} from 'react'
import { Grid, Typography } from '@mui/material';
import { isElementOfType } from 'react-dom/test-utils';
import { Box } from '@mui/system';
import { Icon } from '@iconify/react';
import AirplaneIcon from '../../assets/icons/avion.png';
import AirportIcon from '../../assets/icons/aeropuerto.png';

const dataStory = [
    {
        // Lima: -12.098056, -77.015278
      lat: -12.098056,
      lng: -77.015278,
      duration_flight: 200
    },
    {   // Madrid: 40.472222, -3.560833
      lat: 40.472222,
      lng: -3.560833,
      duration_flight: 200
    }
  ];


  let cursor = 0;
  

 const MapaVuelos  = (props) => {
    const [currentTrack, setCurrentTrack] = useState({
      // Lima: -12.098056, -77.015278
      // LA POSICION INICIAL
      lat: -12.098056,
      lng: -77.015278,
      duration_flight: 200
    });

    const [airportsCoordinates, setAirportsCoordinates] = React.useState([])
    const [flightsSchedule, setFlightsSchedule] = React.useState([])
    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());

    const getIcon = () => {
        return L.icon({
            iconUrl : require("../../assets/icons/aeropuerto.png"),
            iconRetinaUrl: require("../../assets/icons/aeropuerto.png"),
            iconSize : 20
        })
    }

    const show_interval = () => {
        setCurrentTrack(dataStory[cursor]);
        console.log("entra al set interval") 
        if (cursor === dataStory.length - 1) {            
            return;
        }
        // ENTRA AQUI PARA IR A SU DESTINO
        console.log("Entro al setCurrent Track, para llegar a su destino")
        cursor += 1;
        setCurrentTrack(dataStory[cursor]);
    }

    React.useEffect(() => {
        show_interval();
        setCurrentDateTime(new Date());
    })

    

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
            setCurrentTrack(dataStory[cursor]);//
            console.log(airportsCoordinates)
        })
        .catch(function (error) {
            console.log(error);
        })
    },[])

    // api para obtener los vuelos de un dia. Por ahora estara hardcodeado para el 22
    React.useEffect(() => {
        let variables = {fecha: "2022-10-22", periodo: 4}
        getVuelosPorDia(variables)
        .then((response) => {
            var array = [];
            for (const element of response.data){
                array.push(
                    {
                        id: element.id,
                        idAeropuertoOrigen: element.idAeropuertoOrigen,
                        idAeropuertoDestino: element.idAeropuertoDestino,
                        horaSalida: element.horaSalida,
                        horaLLegada: element.horaLLegada,
                        duracion: element.duracion
                    }
                )
            };
            
            setFlightsSchedule(array)
            console.log(array) // es lo mismo que flightsSchedule
        }

        )
    }, [])


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
            <Grid display='flex'>
                <Grid className='containerMapa'>
                    <Typography className='title'>Mapa de vuelos</Typography>
                    <Typography className='date-map'>{"Tiempo actual: " + currentDateTime.toLocaleString()}</Typography>
                    <MapContainer
                        className="mapa-vuelo"
                        center = {{lat: '28.058522', lng: '-20.591226'}}
                        zoom = {2.8}
                        minZoom = {2.0}
                        maxZoom = {18.0}
                    >
                        <AirportMarket/>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'></TileLayer>
                        <AirplaneMarker data={ currentTrack ?? {}} />
                    </MapContainer>
                </Grid>
                <Box height="80px" marginLeft='15px' marginTop='20px'> 
                    <Grid container>
                        <Typography fontWeight="bold" marginBottom="10px">Leyenda</Typography>
                    </Grid>
                    <Grid display="flex">
                    <Grid container className='legend-item'>
                        <img src={AirportIcon} width="20px" height="20px"></img>
                        <Typography>Aeropuerto</Typography>
                    </Grid>
                    <Grid container className='legend-item'>
                        <img src={AirplaneIcon} width="20px" height="20px" className='object-legend'></img>
                        <Typography>Avión</Typography>
                    </Grid>
                    <Grid container className='legend-item'>
                        <Icon icon="akar-icons:minus" color="#19d2a6" width="24px"/>
                        <Typography>Trayectos</Typography>
                    </Grid>
                    </Grid>
                </Box> 
            </Grid>
        </div>
    )
}

export default MapaVuelos;