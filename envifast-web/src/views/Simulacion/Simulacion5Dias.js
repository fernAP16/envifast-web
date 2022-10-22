import React from 'react';
import './../../App';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'; // objeto principal para los mapas
import { getCoordenadasAeropuertos } from '../../services/envios/EnviosServices';
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
import { formatDate } from '../../constants/commonFunctions'
import 'leaflet/dist/leaflet.css';
import './Simulacion5Dias.css';


const Simulacion5Dias = () => {
    const [airportsCoordinates, setAirportsCoordinates] = React.useState([])
    const [disableStart, setDisableStart] = React.useState(false);
    const [disablePause, setDisablePause] = React.useState(true);
    const [disableStop, setDisableStop] = React.useState(true);
    const [startDateString, setStartDateString] = React.useState('');
    const [startDate, setStartDate] = React.useState(new Date());
    const [currentTime, setCurrentTime] = React.useState('');
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
      createData('TAP011', 0),
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
      setCurrentTime('00:00:00 AM');
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

    const handleStart = () => {
      setDisableStart(true);
      setDisablePause(false);
      setDisableStop(false);
    }

    const handlePause = () => {
      setDisableStart(false);
      setDisablePause(true);
      setDisableStop(false);
    }

    const handleStop = () => {
      setDisableStart(false);
      setDisablePause(true);
      setDisableStop(true);
    }

    // 2022-09-22

    const handleDate = event => {
      setStartDate(event.target.value);
      setStartDateString(formatDate(event.target.value));
    }

    function changeTime(timeValueFrom, dateValueFrom = null){
  
    }

    return (
        <div>
          <Grid display='flex'>
            <Grid item className='containerMapa'>
              <Typography className='title'>Simulación de 5 días</Typography>
              <Typography className='date-map'>{"Fecha: " + startDateString}</Typography>
              <Typography className='time-map'>{"Hora: " + currentTime} </Typography>
              <MapContainer
                  className="mapa-vuelo"
                  center = {{lat: '28.058522', lng: '-20.591226'}}
                  zoom = {2.8}
                  minZoom = {2.0}
                  maxZoom = {18.0}
              >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'></TileLayer>
                  
                  <AirportMarket/>                
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
                    <TableHead >
                      <TableRow>
                        <StyledTableCell align="center">Nombre del vuelo</StyledTableCell>
                        <StyledTableCell align="center">Estado</StyledTableCell>
                        <StyledTableCell align="center">Acciones</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                          <StyledTableCell align="center">{row.name}</StyledTableCell>
                          <StyledTableCell align="center">{row.calories}</StyledTableCell>
                          <StyledTableCell align="center">
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