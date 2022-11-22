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
import { Grid, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { isElementOfType } from 'react-dom/test-utils';
import { Box } from '@mui/system';
import { Icon } from '@iconify/react';
import AirplaneIcon from '../../assets/icons/avion.png';
import AirportIcon from '../../assets/icons/aeropuerto.png';
import { styled } from '@mui/material/styles';



 const MapaVuelos  = (props) => {
    

    const [stateButtons, setStateButtons] = React.useState(0);
    const [airportsCoordinates, setAirportsCoordinates] = React.useState([])
    const [flightsSchedule, setFlightsSchedule] = React.useState([])
    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
    const [initialDate, setInitialDateTime] = React.useState(new Date());
    const [flagInicioContador, setFlagInicioContador] = React.useState(false);
    const [currentTrack, setCurrentTrack] = React.useState({});

    // variables para la animacion
    const [primeraSeccion, setPrimeraSeccion] = React.useState(1);
    const [segundaSeccion, setSegundaSeccion] = React.useState(1);
    const [terceraSeccion, setTerceraSeccion] = React.useState(1);
    const [cuartaSeccion, setCuartaSeccion] = React.useState(1);
    const [quintaSeccion, setQuintaSeccion] = React.useState(1);
    const [sextaSeccion, setSextaSeccion] = React.useState(1);
    const [septimaSeccion, setSeptimaSeccion] = React.useState(1);
    const [octavaSeccion, setOctavaSeccion] = React.useState(1);
    const [novenaSeccion, setNovenaSeccion] = React.useState(1);


    const getIcon = () => {
        return L.icon({
            iconUrl : require("../../assets/icons/aeropuerto.png"),
            iconRetinaUrl: require("../../assets/icons/aeropuerto.png"),
            iconSize : 20
        })
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: "#AFD6D6",
          color: theme.palette.common.black,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
  
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

    const show_interval = (flightSchedule) => {
      if(flightSchedule.estado === 2) {
        
        // AL PARECER ESTA CONDICIONAL NO FUNCIONA
        if(currentDateTime.getDate() > initialDate.getDate()){
          console.log("Entro a este if")
          flightSchedule.estado = 0
          flightSchedule.coordenadasActual[0] = flightSchedule.coordenadasOrigen[0];
          flightSchedule.coordenadasActual[1] = flightSchedule.coordenadasOrigen[1];
          // HORA SALIDA ES UN STRING NO UN DATE
          let diaSalida = parseInt(flightSchedule.horaSalida.substring(8, 10))
          let diaLlegada = parseInt(flightSchedule.horaLLegada.substring(8, 10))
          diaSalida += 1
          diaLlegada += 1
          let stringSalida = diaSalida.toString()
          let stringLlegada = diaLlegada.toString()
          flightSchedule.horaSalida = flightSchedule.horaSalida.replaceAt(8, stringSalida[0])
          flightSchedule.horaSalida = flightSchedule.horaSalida.replaceAt(9, stringSalida[1])
          flightSchedule.horaLLegada = flightSchedule.horaLLegada.replaceAt(8, stringLlegada[0])
          flightSchedule.horaLLegada = flightSchedule.horaLLegada.replaceAt(9, stringLlegada[1])
          // "2022-11-20T21:56:10.615Z" -> "2022-11-21T21:56:10.615Z"
          // // flightSchedule.horaSalida.setDate(flightSchedule.horaSalida.getDate() + 1)
          // // flightSchedule.horaLLegada.setDate(flightSchedule.horaLLegada.getDate() + 1)
          console.log("La hora de salida es: " + flightSchedule.horaSalida)
        }
        return;
      }

      let jsonSalida = "\""  + flightSchedule.horaSalida + "\""
      let jsonLlegada= "\""  + flightSchedule.horaLLegada + "\""
      let dateInicio = new Date(JSON.parse(jsonSalida))
      let dateFin = new Date(JSON.parse(jsonLlegada))
      
      setCurrentTrack({
          lat: flightSchedule.coordenadasActual[0],
          lng: flightSchedule.coordenadasActual[1],
          duration_flight: flightSchedule.duracion
      });

      let date = new Date(currentDateTime);
      date.setSeconds(date.getSeconds() - 100);

      if(currentDateTime > dateFin){
        flightSchedule.estado = 2;
      } else if(date >= dateInicio){
        flightSchedule.coordenadasActual[0] = flightSchedule.coordenadasDestinos[0];
        flightSchedule.coordenadasActual[1] = flightSchedule.coordenadasDestinos[1];
      } else if(currentDateTime > dateInicio){
        flightSchedule.estado = 1;
      }
    }

    

    // para la animacion
    React.useEffect(() => {
        getCoordenadasAeropuertos()
        .then(function (response) {
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
            setStateButtons(2)
        })
        .catch(function (error) {
            console.log(error);
        })
    },[])

    // api para obtener los vuelos de un dia. Por ahora estara hardcodeado para el 22
    React.useEffect(() => {
      if(currentDateTime != null){
      let variables = {
        fecha: currentDateTime.toISOString().slice(0, 10),//startDate, // 2022-10-29
        paraSim: 0
      }
      console.log("Los aeropuertos son: ")
      console.log(airportsCoordinates)
      getVuelosPorDia(variables)
      .then((response) => {
        var array = []
        for (const element of response.data){
          console.log(element)
          array.push(
            {
              id: element.id,
              idAeropuertoOrigen: element.idAeropuertoOrigen,
              idAeropuertoDestino: element.idAeropuertoDestino,
              horaSalida: element.horaSalida,
              horaLLegada: element.horaLLegada,
              duracion: element.duracion,
              coordenadasOrigen: [airportsCoordinates[element.idAeropuertoOrigen - 1].lat,airportsCoordinates[element.idAeropuertoOrigen - 1].lng],
              coordenadasDestinos: [airportsCoordinates[element.idAeropuertoDestino - 1].lat,airportsCoordinates[element.idAeropuertoDestino - 1].lng],
              coordenadasActual: [airportsCoordinates[element.idAeropuertoOrigen - 1].lat,airportsCoordinates[element.idAeropuertoOrigen - 1].lng],
              estado: 0
            }
          )
        };
        var k = array.length;
        setPrimeraSeccion(Math.floor(k/10))
        setSegundaSeccion(Math.floor(k/5))
        setTerceraSeccion(Math.floor((3/10) * k))
        setCuartaSeccion(Math.floor((4/10) * k))
        setQuintaSeccion(Math.floor( k / 2))
        setSextaSeccion(Math.floor((6/10) * k))
        setSeptimaSeccion(Math.floor((7/10) * k))
        setOctavaSeccion(Math.floor((8/10) * k))
        setNovenaSeccion(Math.floor((9/10) * k))         
        setFlightsSchedule(array)
        setFlagInicioContador(true);
      })
      .catch(function (error) {
        console.log(error);
    })
    }
    }, [airportsCoordinates])


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
                <Grid marginLeft='10px'>
                  <Box height="80px" marginTop='20px'> 
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
                  <Grid> 
                    <Typography fontWeight="bold">Listado de vuelos</Typography>
                    <TableContainer component={Paper} className="table-flights-now">
                      <Table className='table-flights-now-body' stickyHeader aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell className='table-flights-now-cell' align="center">Nombre</StyledTableCell>
                            <StyledTableCell className='table-flights-now-cell'align="center">Ruta</StyledTableCell>
                            <StyledTableCell className='table-flights-now-cell' align="center">Estado</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody> 
                          {(flightsSchedule) && 
                            flightsSchedule.slice(0,10).map((flight) => (
                              <StyledTableRow key={flight.name}>
                                <StyledTableCell className='table-flights-now-cell' align="center">{"TAP" + flight.id.toString()}</StyledTableCell>
                                <StyledTableCell className='table-flights-now-cell' align="center">{airportsCoordinates[flight.idAeropuertoOrigen-1].cityName + ' - ' + airportsCoordinates[flight.idAeropuertoDestino-1].cityName}</StyledTableCell>
                                <StyledTableCell className='table-flights-now-cell' align="center">
                                    <div className='table-state'>
                                        <Typography className='state-text'
                                            border={flight.estado === 0 ? "1.5px solid #FFFA80" : flight.estado === 1 ? "1.5px solid #FFA0A0" : "1.5px solid #B6FFD8"}
                                            backgroundColor={flight.estado === 0 ? "#FFFA80" : flight.estado === 1 ? "#FFA0A0" : "#B6FFD8"}
                                        >
                                          {flight.estado === 0 ? "Por volar" : flight.estado === 1 ? "En vuelo" : "Aterrizó"}
                                        </Typography>    
                                    </div>
                                </StyledTableCell>
                              </StyledTableRow>
                            ))
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default MapaVuelos;