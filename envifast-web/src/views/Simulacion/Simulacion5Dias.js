import React from 'react';
import './../../App';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'; // objeto principal para los mapas
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
import { formatDate, formatDateTimeToString } from '../../constants/commonFunctions'
import 'leaflet/dist/leaflet.css';
import './Simulacion5Dias.css';
import AirplaneMarker from '../MapaVuelos/AirplaneMarker';
import vuelos from './planes_vuelos.txt';

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
    const [disableStart, setDisableStart] = React.useState(false);
    const [disablePause, setDisablePause] = React.useState(true);
    const [disableStop, setDisableStop] = React.useState(true);
    const [startDateString, setStartDateString] = React.useState('dd/mm/aaaa');
    const [startDate, setStartDate] = React.useState(null);
    const [currentTime, setCurrentTime] = React.useState(null);
    const [currentTrack, setCurrentTrack] = React.useState({});
    const [flightsSchedule, setFlightsSchedule] = React.useState([]);
    const [stateButtons, setStateButtons] = React.useState(0);
    const marker = new DriftMarker([10, 10]);
    

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

    function createData(name, calories) {
      return { name, calories };
    }

    const rows = [
      // createData('TAP011', 0),
      createData('TAP012', 1),
      createData('TAP013', 2),
      createData('TAP014', 0),
      createData('TAP015', 1),
      createData('TAP016', 0),
      createData('TAP017', 1),
      createData('TAP018', 2),
      createData('TAP019', 0),
      createData('TAP020', 1),
    ];

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
        console.log(arrayAirports)
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
      console.log(startDate)
      getVuelosPorDia(variables)
      .then((response) => {
        var array = [];
        console.log(response.data);
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
              coordenadasDestinos: [airportsCoordinates[element.idAeropuertoDestino - 1].lat,airportsCoordinates[element.idAeropuertoDestino - 1].lng]
            }
          )
        };
        console.log("Llego a hacer el set")
        setFlightsSchedule(array);
        console.log(array)
        setCurrentTime("00:00:00")
      })
    }, [startDateString])


    // Se hace click en Iniciar -> Inicia la simulacion
    React.useEffect(() => {
      if(stateButtons === 1){
        console.log("Entro al for del use effect")
        console.log(flightsSchedule)
        for(var i = 0; i < 10; i++){
          show_interval(flightsSchedule[i])
        }
      }

    }, [stateButtons])

    const show_interval = (flightSchedule) => {
      // setCurrentTrack(dataStory[cursor]); // las coordenadas origen
      console.log("entro a show interval")
      console.log(flightSchedule.coordenadasOrigen[0])
      console.log(flightSchedule.coordenadasOrigen[1])
      console.log(flightSchedule.duracion)
      setCurrentTrack({
        lat: flightSchedule.coordenadasOrigen[0],
        lng: flightSchedule.coordenadasOrigen[1],
        duration_flight: flightSchedule.duracion
      }); 
      console.log("Entro al setCurrent Track, para llegar a su destino")
      // setCurrentTrack(dataStory[cursor]); /// las coordenadas destino
      setCurrentTrack({
        lat: flightSchedule.coordenadasDestinos[0],
        lng: flightSchedule.coordenadasDestinos[1],
        duration_flight: flightSchedule.duracion
      }); 

      // Igualamos el origen al destino
      flightSchedule.coordenadasOrigen[0] = flightSchedule.coordenadasDestinos[0];
      flightSchedule.coordenadasOrigen[1] = flightSchedule.coordenadasDestinos[1];
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
      console.log(startDate)
      setStartDate(event.target.value);
      setStartDateString(formatDate(event.target.value));
      console.log(typeof event.target.value)
    }

    function changeTime(timeValueFrom, dateValueFrom = null){
  
    }

    return (
        <div>
          <Grid display='flex'>
            <Grid item className='containerMapa'>
              <Typography className='title'>Simulación de 5 días</Typography>
              <Typography className='date-map'>{"Fecha: " + (startDate ? formatDate(startDate) : 'dd/mm/aaaa')}</Typography>
              <Typography className='time-map'>{"Hora: " + (currentTime ? currentTime : 'hh:mm:ss')} </Typography>
              <MapContainer
                  className="mapa-vuelo"
                  center = {{lat: '28.058522', lng: '-20.591226'}}
                  zoom = {2.8}
                  minZoom = {2.0}
                  maxZoom = {18.0}
              >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'></TileLayer>
                  <AirportMarket/>
                  {flightsSchedule.slice(0,10).map((flight)=>(
                    <AirplaneMarker data={
                      { lat: flight.coordenadasOrigen[0],
                        lng: flight.coordenadasOrigen[1],
                        duration_flight: flight.duracion
                      } ?? {}
                    }></AirplaneMarker>
                  ))}
                  {/* <AirplaneMarker data={currentTrack ?? {}} />                 */}
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
                  <Grid container>
                    <img src={AirportIcon} width="20px" height="20px" className='object-legend'></img>
                    <Typography>Trayectos</Typography>
                  </Grid>
                </Grid>
              </Box> 
              <Grid > 
                <Typography fontWeight="bold">Listado de vuelos</Typography>
                <TableContainer component={Paper} className="table-flights">
                  <Table stickyHeader  aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell className='table-flights-cell' align="center">Nombre del vuelo</StyledTableCell>
                        <StyledTableCell className='table-flights-cell' align="center">Estado</StyledTableCell>
                        <StyledTableCell className='table-flights-cell'align="center">Acciones</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                          <StyledTableCell className='table-flights-cell' align="center">{row.name}</StyledTableCell>
                          <StyledTableCell className='table-flights-cell' align="center">{row.calories}</StyledTableCell>
                          <StyledTableCell className='table-flights-cell' align="center">
                            <Button className='button-flights' disabled={row.calories === 0}>
                              <Typography fontSize="8px" color="white">Ver plan de vuelo</Typography>
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
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