import React from 'react';
import './../../App';
import { MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet'; // objeto principal para los mapas
import { getCoordenadasAeropuertos, getVuelosPorDia } from '../../services/envios/EnviosServices';
import { Grid, Button, Typography, Box, TextField } from '@mui/material';
import L from "leaflet";
import DriftMarker from "leaflet-drift-marker";
import AirplaneIcon from '../../assets/icons/avion.png';
import AirportIcon from '../../assets/icons/aeropuerto.png';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatDate, formatDateTimeToString , formatDateToString} from '../../constants/commonFunctions'
import 'leaflet/dist/leaflet.css';
import './Simulacion5Dias.css';
import AirplaneMarker from '../MapaVuelos/AirplaneMarker';
import { Icon } from '@iconify/react';

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

const Simulacion5Dias = () => {
    const [airportsCoordinates, setAirportsCoordinates] = React.useState([])
    const [disableStart, setDisableStart] = React.useState(true);
    const [disablePause, setDisablePause] = React.useState(true);
    const [disableStop, setDisableStop] = React.useState(true);
    const [startDateString, setStartDateString] = React.useState('dd/mm/aaaa');
    const [startDate, setStartDate] = React.useState(null);
    const [currentTime, setCurrentTime] = React.useState(null);
    const [currentDateTime, setCurrentDateTime] = React.useState(null);
    const [currentTrack, setCurrentTrack] = React.useState({});
    const [flightsSchedule, setFlightsSchedule] = React.useState(null);
    const [stateButtons, setStateButtons] = React.useState(5);
    const marker = new DriftMarker([10, 10]);
    const [formatoFecha, setFormatoFecha] = React.useState("");
    

    marker.slideTo([50, 50], {
      duration: 2000,
      keepAtCenter: true,
    });

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

    React.useEffect(() => {
      getCoordenadasAeropuertos()
      .then(function (response) {
        var arrayAirports = [];
        for (const element of response.data) {
          arrayAirports.push({
            id: element.id,
            cityName: element.cityName,
            lat: element.x_pos,
            lng: element.y_pos
          })
        };
        setAirportsCoordinates(arrayAirports);
      })
      .catch(function (error) {
          console.log(error);
      })
    },[])

    React.useEffect(() => {
      let variables = {
        fecha: startDate,
        periodo: 1
      }
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
              duracion: element.duracion,
              coordenadasOrigen: [airportsCoordinates[element.idAeropuertoOrigen - 1].lat,airportsCoordinates[element.idAeropuertoOrigen - 1].lng],
              coordenadasDestinos: [airportsCoordinates[element.idAeropuertoDestino - 1].lat,airportsCoordinates[element.idAeropuertoDestino - 1].lng],
              coordenadaActual: [airportsCoordinates[element.idAeropuertoOrigen - 1].lat,airportsCoordinates[element.idAeropuertoOrigen - 1].lng],
              estado: 0
            }
          )
        };
        setFlightsSchedule(array);
        let dateTime = new Date(startDate);
        dateTime.setHours(0)
        dateTime.setMinutes(0)
        dateTime.setSeconds(0)        
        setCurrentDateTime(dateTime);
      })
    }, [startDateString])



    // PARA INICIAR LA SIMULACION
    React.useEffect(() => {
      if(stateButtons === 1){
        const interval = setInterval(() => {
          const dateTime = currentDateTime;  
          currentDateTime.setSeconds(currentDateTime.getSeconds() + 1)
          setCurrentDateTime(dateTime)
          
        }, 1000 / 360)

        return () => {
          clearInterval(interval);
        };
        
      }
    }, [stateButtons])

    React.useEffect(() => {
      if(stateButtons === 1){
        if(currentDateTime !== null){
          const interval = setInterval(() => {
            for(var i = 0 ; i < 50; i++){
              show_interval(flightsSchedule[i])
            } 
          }, 1000 / 360)
        }
      }
    }, [stateButtons]) 

    const show_interval = (flightSchedule) => {
      // el current date time se mantiene constante aqui
      let horaSalida = JSON.stringify(flightSchedule.horaSalida).slice(12,20);// esto captura bien la hora. Ahora 
      let horaLLegada = JSON.stringify(flightSchedule.horaLLegada).slice(12,20);// esto captura bien la hora. Ahora 
      
      let arrTiempoSalida = horaSalida.split(":");
      let arrTiempoLLegada = horaLLegada.split(":");
      let tiempoActual = currentDateTime.getSeconds() + currentDateTime.getMinutes() * 60 + currentDateTime.getHours() * 3600;
      let tiempoSalida = parseInt(arrTiempoSalida[2]) + parseInt(arrTiempoSalida[1]) * 60 +  parseInt(arrTiempoSalida[0]) * 3600;
      let tiempoLLegada = parseInt(arrTiempoLLegada[2]) + parseInt(arrTiempoLLegada[1]) * 60 +  parseInt(arrTiempoLLegada[0]) * 3600;
      setCurrentTrack({
          lat: flightSchedule.coordenadaActual[0],
          lng: flightSchedule.coordenadaActual[1],
          duration_flight: flightSchedule.duracion
        }); 
      if(tiempoActual >= tiempoSalida){
        flightSchedule.estado = 1;
      }
      if(tiempoActual - 10 >= tiempoSalida){
        flightSchedule.coordenadaActual[0] = flightSchedule.coordenadasDestinos[0];
        flightSchedule.coordenadaActual[1] = flightSchedule.coordenadasDestinos[1];
      }
      if(flightSchedule.estado === 1 && tiempoActual >= tiempoLLegada){
        flightSchedule.estado = 2;
      }
      
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

    const handleStart = () => {
      if(stateButtons === 0){
        setStateButtons(1);
      }
      else setStateButtons(3)
      // setDisableStart(true);
      // setDisablePause(false);
      // setDisableStop(false);
    }

    const handlePause = () => {
      setStateButtons(2);
      setDisableStart(false);
      setDisablePause(true);
      setDisableStop(false);
    }

    const handleStop = () => {
      setStateButtons(4);
      setDisableStart(false);
      setDisablePause(true);
      setDisableStop(true);
    }

    const handleDate = event => {
      setStartDate(event.target.value);
      setStartDateString(formatDate(event.target.value));
      setStateButtons(0);
      setDisableStart(false);
    }

    return (
        <div>
          <Grid display='flex'>
            <Grid item className='containerMapa'>
              <Typography className='title'>Simulación de 5 días</Typography>
              <Typography className='date-map'>{"Fecha actual: " + (currentDateTime ? formatDateTimeToString(currentDateTime)[0]: 'dd/mm/aaaa')}</Typography>
              <MapContainer
                  className="mapa-vuelo"
                  center = {{lat: '28.058522', lng: '-20.591226'}}
                  zoom = {2.8}
                  minZoom = {2.0}
                  maxZoom = {18.0}
              >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'></TileLayer>
                  <AirportMarket/>
                  {flightsSchedule &&
                    flightsSchedule.slice(0,50).map((flight)=>(
                      flight.estado == 1 ?
                      <div>
                          <AirplaneMarker data={
                            { lat: flight.coordenadaActual[0],
                              lng: flight.coordenadaActual[1],
                              duration_flight: flight.duracion
                            } ?? {}
                          }></AirplaneMarker>
                          <Polyline
                            color='#19D2A6'
                            weight={0.5}
                            positions={[[flight.coordenadasOrigen[0], flight.coordenadasOrigen[1]],[flight.coordenadasDestinos[0], flight.coordenadasDestinos[1]]]}
                          ></Polyline>
                      </div>
                      :
                      <></>
                    ))}
              </MapContainer>
            </Grid>
            <Box marginLeft="10px">
              <Grid className='container-buttons' display='flex' alignItems='center'> 
                <Typography fontWeight="bold" position='relative'>Controles</Typography>
                <Button className={'button-control button-play ' + (disableStart ? 'button-disabled-a' : '')} disabled={disableStart} onClick={handleStart}>INICIAR</Button>
                <Button className={'button-control ' + (disablePause ? 'button-disabled-a' : 'button-pause')} disabled={disablePause} onClick={handlePause}>PAUSAR</Button>
                <Button className={'button-control '  + (disableStop ? 'button-disabled-a' : 'button-stop')} disabled={disableStop} onClick={handleStop}>DETENER</Button>
              </Grid> 
              <Grid container xs={12} alignItems='center'>
                <Grid container xs={5}>
                  <Typography fontWeight="bold" position='relative'>Fecha de inicio: </Typography>
                </Grid>
                <Grid container xs={6}>
                  <TextField type='date' size='small' value={startDate} fullWidth onChange={handleDate}/>
                </Grid>
              </Grid>
              <Box height="80px"> 
                <Grid container>
                  <Typography fontWeight="bold" marginBottom="10px">Leyenda</Typography>
                </Grid>
                <Grid display="flex">
                  <Grid container>
                    <img src={AirportIcon} width="20px" height="20px"></img>
                    <Typography>Aeropuerto</Typography>
                  </Grid>
                  <Grid container width="70%">
                    <img src={AirplaneIcon} width="20px" height="20px" className='object-legend'></img>
                    <Typography>Avión</Typography>
                  </Grid>
                  <Grid container alignItems='center'>
                    <Icon icon="akar-icons:minus" color="#19d2a6" width="24px"/>
                    <Typography>Trayectos</Typography>
                  </Grid>
                </Grid>
              </Box> 
              <Grid> 
                <Typography fontWeight="bold">Listado de vuelos</Typography>
                <TableContainer component={Paper} className="table-flights">
                  <Table stickyHeader  aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell className='table-flights-cell cell-ID' align="center">ID</StyledTableCell>
                        <StyledTableCell className='table-flights-cell cell-state' align="center">Estado</StyledTableCell>
                        <StyledTableCell className='table-flights-cell cell-action'align="center">Acciones</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(stateButtons === 1) && 
                        flightsSchedule.slice(0,50).map((flight) => (
                          <StyledTableRow key={flight.name}>
                            <StyledTableCell className='table-flights-cell' align="center">{"TAP" + flight.id.toString()}</StyledTableCell>
                            <StyledTableCell className='table-flights-cell' align="center">
                                <div className='table-state'>
                                    <Typography className='state-text'
                                        border={flight.estado === 0 ? "1.5px solid #FFFA80" : flight.estado === 1 ? "1.5px solid #FFA0A0" : "1.5px solid #B6FFD8"}
                                        backgroundColor={flight.estado === 0 ? "#FFFA80" : flight.estado === 1 ? "#FFA0A0" : "#B6FFD8"}
                                    >
                                      {flight.estado === 0 ? "Por volar" : flight.estado === 1 ? "En vuelo" : "Aterrizó"}
                                    </Typography>    
                                </div>
                            </StyledTableCell>
                            <StyledTableCell className='table-flights-cell' align="center">
                              <Button className={'button-flights' + (flight.estado === 0 ? ' button-disabled-a' : '')} disabled={flight.estado === 0}>
                                <Typography fontSize="8px" color="white">Ver plan de vuelo</Typography>
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid> 



            </Box> 
            
            
          </Grid>
        </div>
    )
}

export default Simulacion5Dias