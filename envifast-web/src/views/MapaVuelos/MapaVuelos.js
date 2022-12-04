import React from 'react';
import './../../App';
import {MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet'; // objeto principal para los mapas
import { getCoordenadasAeropuertos, getVuelosPorDia } from '../../services/envios/EnviosServices';
import Markers from '../../components/Markers/Markers';
import AirportLocation from '../../components/AirportLocation/AirportLocation';

import 'leaflet/dist/leaflet.css'; // 
import './MapaVuelos.css';
import L from "leaflet";

import AirplaneMarker from "./AirplaneMarker";
import {useState} from 'react'
import { Checkbox, FormControlLabel, Grid, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
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
    const [currentDateTime, setCurrentDateTime] = React.useState(null);
    const [currentDateTimePrint, setCurrentDateTimePrint] = React.useState(new Date());
    const [valueSearch, setValueSearch] = React.useState('')
    const [searchTable, setSearchTable] = React.useState([]);
    const [checkValue, setCheckValue] = React.useState(false);


    const getIcon = () => {
        return L.icon({
            iconUrl : require("../../assets/icons/aeropuerto.png"),
            iconRetinaUrl: require("../../assets/icons/aeropuerto.png"),
            iconSize : 15
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

    React.useEffect(() => {
      setCurrentDateTimePrint(new Date());
    })

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
        setCurrentDateTime(new Date())
        setStateButtons(2)
      })
      .catch(function (error) {
          console.log(error);
      })
    },[])

    // api para obtener los vuelos de un dia. Por ahora estara hardcodeado para el 22
    React.useEffect(() => {
      if(currentDateTime != null){
        let date = currentDateTime;
        date.setHours(date.getHours() - 5);
        let variables = {
          fecha: date.toISOString().slice(0, 10),
          paraSim: 0
        }
        getVuelosPorDia(variables)
        .then((response) => {
          var array = []
          for (const element of response.data){
            let coordenadasOrigenTemp = [airportsCoordinates[element.idAeropuertoOrigen - 1].lat,airportsCoordinates[element.idAeropuertoOrigen - 1].lng];
            let coordenadasDestinosTemp = [airportsCoordinates[element.idAeropuertoDestino - 1].lat,airportsCoordinates[element.idAeropuertoDestino - 1].lng];
            let currentTimeNow = currentDateTime.getTime();
            let difTime = new Date(element.horaLLegada).getTime() - new Date(element.horaSalida).getTime();
            let currTime = currentTimeNow - new Date(element.horaSalida).getTime();
            let estado = currentTimeNow < new Date(element.horaSalida).getTime() ? 0 : 
                        (currentTimeNow < new Date(element.horaLLegada).getTime() ? 1 : 2);
            array.push(
              {
                id: "TAP" + element.id.toString(),
                idAeropuertoOrigen: element.idAeropuertoOrigen,
                idAeropuertoDestino: element.idAeropuertoDestino,
                horaSalida: element.horaSalida,
                horaLLegada: element.horaLLegada,
                duracion: element.duracion,
                coordenadasOrigen: coordenadasOrigenTemp,
                coordenadasDestinos: coordenadasDestinosTemp,
                coordenadasActual: [coordenadasOrigenTemp[0] + (coordenadasDestinosTemp[0] - coordenadasOrigenTemp[0])*currTime/difTime,
                                    coordenadasOrigenTemp[1] + (coordenadasDestinosTemp[1] - coordenadasOrigenTemp[1])*currTime/difTime],
                estado: estado
              }
            )
          };
          var k = array.length;       
          setFlightsSchedule(array)
          setSearchTable(array.slice(0,50));
        })
        .catch(function (error) {
          console.log(error);
        })
      }
    }, [currentDateTime])

    const AirportMarket = () => {
        return (
            <>
            {airportsCoordinates && airportsCoordinates.map((airport) => (
                ( airport.lat && airport.lng && 
                  <Marker position={[airport.lat , airport.lng]} icon={getIcon()}></Marker>
                )
            ))}
            </> 
        )
    }

    const onChangeSearchTable = (value) => {
      setValueSearch(value);
      let filtered = flightsSchedule.filter(function (flight) { 
        return airportsCoordinates[flight.idAeropuertoOrigen-1].cityName.indexOf(value) !== -1 
        || airportsCoordinates[flight.idAeropuertoDestino-1].cityName.indexOf(value) !== -1
        || flight.id.toString().indexOf(value) !== -1; 
      }).slice(0,100);
      setSearchTable(filtered);
    }

    return (
      currentDateTime && 
        <div>
            <Grid display='flex'>
                <Grid className='containerMapa'>
                    <Typography className='title'>Mapa de vuelos</Typography>
                    <Typography className='date-map'>{"Tiempo actual: " + currentDateTimePrint.toLocaleString()}</Typography>
                    <MapContainer
                        className="mapa-vuelo"
                        center = {{lat: '21.658522', lng: '-20.591226'}}
                        zoom = {2.8}
                        minZoom = {2.0}
                        maxZoom = {18.0}
                    >
                        <AirportMarket/>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'></TileLayer>
                        {flightsSchedule &&
                          flightsSchedule.slice(0,100).map((flight)=>(
                            flight.estado === 1 ?
                            <div>
                                <AirplaneMarker data={
                                  { lat: flight.coordenadasActual[0],
                                    lng: flight.coordenadasActual[1],
                                    duration_flight: flight.duracion
                                  } ?? {}
                                }></AirplaneMarker>
                                { checkValue && 
                                <Polyline
                                  color='#19D2A6'
                                  weight={0.5}
                                  positions={[[flight.coordenadasOrigen[0], flight.coordenadasOrigen[1]],[flight.coordenadasDestinos[0], flight.coordenadasDestinos[1]]]}
                                ></Polyline>}
                            </div>
                             :
                             <></>
                          ))}
                    </MapContainer>
                </Grid>
                <Grid marginLeft='20px' marginTop='10px'>
                  <Box className='box-legend'> 
                    <Grid display="flex">
                      <Grid container alignItems='center'>
                        <Grid item xs={4}>
                          <Typography fontWeight="bold" marginLeft='2px'>Leyenda</Typography>
                        </Grid>
                        <Grid item xs={1}><img src={AirportIcon} width="20px" height="20px"></img></Grid>
                        <Grid item xs={4}><Typography>Aeropuerto</Typography></Grid>
                        <Grid item xs={1}><img src={AirplaneIcon} width="20px" height="20px"></img></Grid>
                        <Grid item xs={2}><Typography>Avión</Typography></Grid>
                      </Grid>
                    </Grid>
                  </Box> 
                  <Grid container alignItems='center' marginBottom='10px' >
                    <Grid item xs={5}>
                      <Typography fontWeight="bold" position='relative'>Configuraciones: </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <FormControlLabel control={<Checkbox checked={checkValue} onChange={() => setCheckValue(!checkValue)}defaultChecked className='checkbox-flights'/>} label={<Typography fontWeight="bold" position='relative'>Mostrar rutas de vuelos </Typography>}/>
                    </Grid>
                  </Grid>
                  <Grid container alignItems='center' marginTop='10px' marginBottom='10px'>
                    <Grid item xs={5}>
                      <Typography fontWeight="bold">Filtrar vuelo(s): </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <TextField size='small' fullWidth disabled={stateButtons !== 2} value={valueSearch} onChange={(e) => onChangeSearchTable(e.target.value)}></TextField>
                    </Grid>
                  </Grid>
                  <Grid> 
                    <Typography fontWeight="bold">Listado de vuelos</Typography>
                    <TableContainer component={Paper} className="table-flights-now">
                      <Table stickyHeader aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell className='table-flights-cell row-cell' align="center">Nombre</StyledTableCell>
                            <StyledTableCell className='table-flights-cell row-cell' align="center">Origen</StyledTableCell>
                            <StyledTableCell className='table-flights-cell row-cell' align="center">Destino</StyledTableCell>
                            <StyledTableCell className='table-flights-cell row-cell' align="center">Estado</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody> 
                          {(searchTable) && 
                            searchTable.map((flight) => (
                              <StyledTableRow key={flight.name}>
                                <StyledTableCell className='table-flights-cell row-cell' align="center">{flight.id}</StyledTableCell>
                                <StyledTableCell className='table-flights-cell row-cell' align="center">{airportsCoordinates[flight.idAeropuertoOrigen-1].cityName}</StyledTableCell>
                                <StyledTableCell className='table-flights-cell row-cell' align="center">{airportsCoordinates[flight.idAeropuertoDestino-1].cityName}</StyledTableCell>
                                <StyledTableCell className='table-flights-cell row-cell' align="center">
                                    <div>
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