import React from 'react';
import './../../App';
import { MapContainer, TileLayer, Marker, Polyline} from 'react-leaflet'; // objeto principal para los mapas
import { getCoordenadasAeropuertos, getVuelosPorDia, generarEnviosPorDia, getAirportsDateTime } from '../../services/envios/EnviosServices';
import { Grid, Button, Typography, Box, TextField, Dialog, DialogTitle, DialogContent, CircularProgress } from '@mui/material';
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
import Popup from '../MapaVuelos/VerPlanVuelo';
import { isCompositeComponent } from 'react-dom/test-utils';

const Simulacion5Dias = () => {
    const [airportsCoordinates, setAirportsCoordinates] = React.useState([])
    const [disableStart, setDisableStart] = React.useState(true);
    const [disablePause, setDisablePause] = React.useState(true);
    const [disableStop, setDisableStop] = React.useState(true);
    const [startDateString, setStartDateString] = React.useState('dd/mm/aaaa');
    const [startDate, setStartDate] = React.useState(null);
    const [currentDateTime, setCurrentDateTime] = React.useState(null);
    const [currentTrack, setCurrentTrack] = React.useState({});
    const [flightsSchedule, setFlightsSchedule] = React.useState([]);
    const [stateButtons, setStateButtons] = React.useState(0);
    const marker = new DriftMarker([10, 10]);
    const [primeraSeccion, setPrimeraSeccion] = React.useState(1);
    const [segundaSeccion, setSegundaSeccion] = React.useState(1);
    const [terceraSeccion, setTerceraSeccion] = React.useState(1);
    const [cuartaSeccion, setCuartaSeccion] = React.useState(1);
    const [quintaSeccion, setQuintaSeccion] = React.useState(1);
    const [sextaSeccion, setSextaSeccion] = React.useState(1);
    const [septimaSeccion, setSeptimaSeccion] = React.useState(1);
    const [octavaSeccion, setOctavaSeccion] = React.useState(1);
    const [novenaSeccion, setNovenaSeccion] = React.useState(1);
    const [periodo, setPeriodo] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    const [openPopUp, setOpenPopUp] = React.useState(false);
    const [flagPeriodo, setFlagPeriodo] = React.useState(false);
    const [flagPeriodo2, setFlagPeriodo2] = React.useState(true);
    const [flagPeriodo3, setFlagPeriodo3] = React.useState(false);
    const [flagPeriodo4, setFlagPeriodo4] = React.useState(false);
    const [flightsPeriodo, setFlightsPeriodo] = React.useState(null);
    const [flagInicioContador, setFlagInicioContador] = React.useState(false);
    const [initialDate, setInitialDate] = React.useState(null)

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

    // Inicio
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


    // Llamamos para cargar los vuelos, solo se llama una vez.
    React.useEffect(() => {
      if(periodo !== 0){
        let variables = {
          fecha: currentDateTime.toISOString().slice(0, 10),//startDate, // 2022-10-29
          paraSim: 1
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
          setIsLoading(false);
          setFlagInicioContador(true);
        })
        .catch(function (error) {
          console.log(error);
      })
      }
    }, [stateButtons])

    

    

    // //  Primer Periodo
    // React.useEffect(() => {
    //   if(stateButtons === 2){
    //     const interval = setInterval(() => {
    //       if(currentDateTime.getHours()  === 0 && flagPeriodo === true){ // 12 % 6 = 0, 10 % 6 = 4
    //         setPeriodo(1)
    //         setFlagPeriodo(false)
    //         setFlagPeriodo2(true)
    //       }
    //     }, 1.1)
    //     return () => {
    //       clearInterval(interval);
    //     }; 
    //   }
    // }, [flightsSchedule])

    // // Segundo periodo
    // React.useEffect(() => {
    //   if(stateButtons === 2){
    //     const interval = setInterval(() => {
    //       if(currentDateTime.getHours()  === 6 && flagPeriodo2 === true){ // 12 % 6 = 0, 10 % 6 = 4
    //         setPeriodo(2)
    //         setFlagPeriodo2(false)
    //         setFlagPeriodo3(true)
    //       }
    //     }, 1.1)
    //     return () => {
    //       clearInterval(interval);
    //     }; 
    //   }
    // }, [flightsSchedule])

    // // Tercer Periodo
    // React.useEffect(() => {
    //   const interval = setInterval(() => {
    //     if(currentDateTime.getHours()  === 12 && flagPeriodo3 === true){ // 12 % 6 = 0, 10 % 6 = 4
    //       setPeriodo(3)
    //       setFlagPeriodo3(false)
    //       setFlagPeriodo4(true)
    //     }
        
    //   }, 1.1)
    //   return () => {
    //     clearInterval(interval);
    //   }; 
    // })

    // // Cuarto periodo
    // React.useEffect(() => {
    //   const interval = setInterval(() => {
    //     if(currentDateTime.getHours()  === 18 && flagPeriodo4 === true){ // 12 % 6 = 0, 10 % 6 = 4
    //       setPeriodo(4)
    //       setFlagPeriodo4(false)
    //       setFlagPeriodo(true)
    //     }
    //   }, 1.1)
    //   return () => {
    //     clearInterval(interval);
    //   }; 
    // })


    // Contador que modificara el tiempo:
    React.useEffect(() => {
      const interval = setInterval(() => {
        let temp = currentDateTime;
        temp.setMinutes(temp.getMinutes() + 1)
        setCurrentDateTime(temp)
      }, 200) 
      return () => {
        clearInterval(interval);
      };
    }, [flagInicioContador])

    // Primera Seccion
    React.useEffect(() => {
      if(stateButtons === 2){
        const interval = setInterval(() => { 
          for(var i = 0 ; i < primeraSeccion; i++){
            show_interval(flightsSchedule[i])
          }
        }, 200) // antes estaba en 1.1
        return () => {
          clearInterval(interval);
        };
      }
    }) // le quieto el flightsSchedule

    // Segunda seccion
    React.useEffect(() => {
      if(stateButtons === 2){
        const interval = setInterval(() => {
          for(var i = primeraSeccion; i < segundaSeccion; i++){
            show_interval(flightsSchedule[i])
          }
        }, 200)
        return () => {
          clearInterval(interval);
        };
      }
    })

    // Tercera Seccion
    React.useEffect(() => {
      if(stateButtons === 2){
        const interval = setInterval(() => {
          for(var i = segundaSeccion; i < terceraSeccion; i++){
            show_interval(flightsSchedule[i])
          }
        }, 200)
        return () => {
          clearInterval(interval);
        };
      }
    })

    // Cuarta Seccion
    React.useEffect(() => {
      if(stateButtons === 2){
        const interval = setInterval(() => {  
          for(var i = terceraSeccion; i < cuartaSeccion; i++){
            show_interval(flightsSchedule[i])
          }
        }, 200)
        return () => {
          clearInterval(interval);
        };
      }
    })

    // Quinta Seccion
    React.useEffect(() => {
      if(stateButtons === 2){
        const interval = setInterval(() => {
          for(var i = cuartaSeccion; i < quintaSeccion; i++){
            show_interval(flightsSchedule[i])
          }
        }, 200)
        return () => {
          clearInterval(interval);
        };
      }
    })

    // Sexta Seccion
    React.useEffect(() => {
      if(stateButtons === 2){
        const interval = setInterval(() => {
          for(var i = quintaSeccion; i < sextaSeccion; i++){
            show_interval(flightsSchedule[i])
          }
        }, 200)
        return () => {
          clearInterval(interval);
        };
      }
    })


    // Septima Seccion
    React.useEffect(() => {
      if(stateButtons === 2){
        const interval = setInterval(() => {
          for(var i = sextaSeccion; i < septimaSeccion; i++){
            show_interval(flightsSchedule[i])
          }
        }, 200)
        return () => {
          clearInterval(interval);
        };
      }
    })

    // Octava Seccion
    React.useEffect(() => {
      if(stateButtons === 2){
        const interval = setInterval(() => {
          for(var i = septimaSeccion; i < octavaSeccion; i++){
            show_interval(flightsSchedule[i])
          }
        }, 200)
        return () => {
          clearInterval(interval);
        };
      }
    })

    // Novena Seccion
    React.useEffect(() => {
      if(stateButtons === 2){
        const interval = setInterval(() => {
          for(var i = octavaSeccion; i < novenaSeccion; i++){
            show_interval(flightsSchedule[i])
          }
        }, 200)
        return () => {
          clearInterval(interval);
        };
      }
    })

    // Decima Seccion
    React.useEffect(() => {
      if(stateButtons === 2){
        const interval = setInterval(() => {
          if(flightsSchedule !== null){
            for(var i = novenaSeccion; i < flightsSchedule.length; i++){
              show_interval(flightsSchedule[i])
            }
          }
        }, 200)
        return () => {
          clearInterval(interval);
        };
      }
    })

    
    const show_interval = (flightSchedule) => {
      if(flightSchedule.estado === 2) {
        // AL PARECER ESTA CONDICIONAL NO FUNCIONA
        // if(currentDateTime.getDate() > initialDate.getDate()){
        //   flightSchedule.estado = 0
        // }
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
      if(stateButtons === 1){
        setIsLoading(true);
        setStateButtons(2);
        setPeriodo(periodo + 1);
      }
      else setStateButtons(3)
      setDisableStart(true);
    }

    const handleDate = event => {
      console.log(event.target.value)
      setStartDate(event.target.value);
      setStartDateString(formatDate(event.target.value));
      setCurrentDateTime(new Date(event.target.value + ' 00:00:00'));
      setInitialDate(new Date(event.target.value))
      setStateButtons(1);
      setDisableStart(false);
    }

    const handleFlightDetail = () => {
      // setOpenPopUp(true);
      console.log("Click detalle")
    }
    return (

        <div>
          <Grid display='flex'>
            <Grid item className='containerMapa'>
              <Typography className='title'>Simulación de 5 días</Typography>
              <Typography className='date-map'>{"Tiempo actual: " + (currentDateTime ? currentDateTime.toLocaleString(): 'dd/mm/aaaa hh:mm')}</Typography>
              <MapContainer
                  className="mapa-vuelo"
                  center = {{lat: '28.058522', lng: '-20.591226'}}
                  zoom = {2.7}
                  minZoom = {2.0}
                  maxZoom = {18.0}
              >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'></TileLayer>
                  <AirportMarket/>
                  {flightsSchedule &&
                    flightsSchedule.map((flight)=>(
                      flight.estado === 1 ?
                      <div>
                          <AirplaneMarker data={
                            { lat: flight.coordenadasActual[0],
                              lng: flight.coordenadasActual[1],
                              duration_flight: flight.duracion
                            } ?? {}
                          }></AirplaneMarker>
                          {/* <Polyline
                            color='#19D2A6'
                            weight={0.5}
                            positions={[[flight.coordenadasOrigen[0], flight.coordenadasOrigen[1]],[flight.coordenadasDestinos[0], flight.coordenadasDestinos[1]]]}
                          ></Polyline> */}
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
                {/* <Button className={'button-control ' + (disablePause ? 'button-disabled-a' : 'button-pause')} disabled={disablePause} onClick={handlePause}>PAUSAR</Button>
                <Button className={'button-control '  + (disableStop ? 'button-disabled-a' : 'button-stop')} disabled={disableStop} onClick={handleStop}>DETENER</Button> */}
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
                  <Table className='table-flights-body' stickyHeader aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell className='table-flights-cell cell-ID' align="center">Nombre</StyledTableCell>
                        <StyledTableCell className='table-flights-cell cell-action'align="center">Ruta</StyledTableCell>
                        <StyledTableCell className='table-flights-cell cell-state' align="center">Estado</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody> 
                      {(flightsSchedule) && 
                        flightsSchedule.slice(0,10).map((flight) => (
                          <StyledTableRow key={flight.name}>
                            <StyledTableCell className='table-flights-cell' align="center">{"TAP" + flight.id.toString()}</StyledTableCell>
                            <StyledTableCell className='table-flights-cell' align="center">{airportsCoordinates[flight.idAeropuertoOrigen-1].cityName + ' - ' + airportsCoordinates[flight.idAeropuertoDestino-1].cityName}</StyledTableCell>
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
                          </StyledTableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Box>                         
          </Grid>
          <Dialog open={isLoading}>
            <DialogTitle>
              Cargando...
            </DialogTitle>
            <DialogContent>
              <Grid item container justifyContent='center'>
                <CircularProgress className='loading-comp'/>
              </Grid>
            </DialogContent>
          </Dialog>
          <Popup openPopUp = {openPopUp} setOpenPopUp = {setOpenPopUp}> 

          </Popup>
        </div>
    )
}

export default Simulacion5Dias