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
    const [diferenciaDias, setDiferenciaDias] = React.useState(1)
    const [lapsoPlanificador, setLapsoPlanificador] = React.useState(0)
    const [valueSearch, setValueSearch] = React.useState('')
    const [searchTable, setSearchTable] = React.useState([]);

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
          setSearchTable(array.slice(0,10));
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

    // Como hacemos el codigo para ejecutar la api cada cierto tiempo?
    // api para el planificador
    // fecha: 2022-11-21
    // horaInicio: 09:54
    // horaFin: 09:54
    // paraSIm: 1

    // "2022-11-20T21:56:10.615Z" -> "2022-11-21T21:56:10.615Z"
    React.useEffect(() => {

      if(currentDateTime != null){
        let fecha = currentDateTime.toISOString().split('T')[0]
        // let horaInicio = currentDateTime.toISOString().split('T')[1].substring(0, 5) // substr si es inclusivo, si incluye el ultimo indice
        let horaInicioDate = new Date(fecha)
        horaInicioDate.setHours((lapsoPlanificador - 1) * 4 - 5)
        // para la hora final tenemos que hacer una serie de calculos
        
        // lapso planificador sera el que nos dara la hora limite del rango
        let horaFinDate =  new Date(fecha)
        horaFinDate.setHours(lapsoPlanificador * 4 - 5)

        let horaFin = horaFinDate.toISOString().split('T')[1].substring(0, 5)
        let horaInicio = horaInicioDate.toISOString().split('T')[1].substring(0, 5)
        // ahora imprimimos todos los atributos para ver si estan bien
        // console.log("Hora en ISO: " + currentDateTime.toISOString().split('T')[1])
        console.log(fecha)
        console.log(horaInicio)
        console.log(horaFin)
        // NO SE ESTA EJECC

      }
      
    }, [lapsoPlanificador])

    // Contador que modificara el tiempo:
    React.useEffect(() => {
      const interval = setInterval(() => {
        let temp = currentDateTime;
        temp.setMinutes(temp.getMinutes() + 2)
        setCurrentDateTime(temp)
        if(temp.getHours() % 4 === 0){ //
          console.log("La hora en que entra a este if" + temp.getHours()) // solo entra cuando es 0, Porque?s
          if(lapsoPlanificador === 6){
            setLapsoPlanificador(1) // para el siguiente dia
          }else{
            setLapsoPlanificador(lapsoPlanificador + 1)
          }
        }
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

    String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
    }
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
      setInitialDate(new Date(event.target.value + ' 00:00:00'))
      setStateButtons(1);
      setDisableStart(false);
    }

    const handleFlightDetail = () => {
      // setOpenPopUp(true);
      console.log("Click detalle")
    }

    const onChangeSearchTable = (value) => {
      setValueSearch(value);
      console.log(value);
      let filtered = flightsSchedule.filter(function (flight) { 
        return airportsCoordinates[flight.idAeropuertoOrigen-1].cityName.indexOf(value) !== -1 
          || airportsCoordinates[flight.idAeropuertoDestino-1].cityName.indexOf(value) !== -1
          || flight.id.toString().indexOf(value) !== -1; 
      }).slice(0,20);
      setSearchTable(filtered);
    }

    return (

        <div>
          <Grid display='flex'>
            <Grid item className='containerMapa'>
              <Typography className='title'>Simulación de 5 días</Typography>
              {/* <Typography className='title'>Colapso logístico</Typography> */}
              <Typography className='date-map'>{"Tiempo actual: " + (currentDateTime ? currentDateTime.toLocaleString(): 'dd/mm/aaaa hh:mm')}</Typography>
              <MapContainer
                  className="mapa-vuelo"
                  // center = {{lat: '28.058522', lng: '-20.591226'}}
                  center = {{lat: '23.058522', lng: '-20.591226'}}
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
            <Box marginLeft="20px" marginTop="10px"> 
              <Box className='box-legend'> 
                <Grid container>
                  <Typography fontWeight="bold" marginBottom="10px">Leyenda</Typography>
                </Grid>
                <Grid display="flex">
                  <Grid container>
                    <Grid item xs={1}><img src={AirportIcon} width="20px" height="20px"></img></Grid>
                    <Grid item xs={4}><Typography>Aeropuerto</Typography></Grid>
                    <Grid item xs={1}><img src={AirplaneIcon} width="20px" height="20px"></img></Grid>
                    <Grid item xs={2}><Typography>Avión</Typography></Grid>
                    <Grid item xs={1}><Icon icon="akar-icons:minus" color="#19d2a6" width="24px"/></Grid>
                    <Grid item xs={3}><Typography>Trayectos</Typography></Grid>
                  </Grid>
                </Grid>
              </Box> 
              <Grid container alignItems='center'>
                <Grid item xs={5}>
                  <Typography fontWeight="bold" position='relative'>Fecha de inicio: </Typography>
                </Grid>
                <Grid item xs={5}>
                  <TextField type='date' size='small' value={startDate} fullWidth onChange={handleDate} inputProps={{ min: "2022-08-02", max: "2023-05-24" }}/>
                </Grid>
                <Grid item xs={2} align='right'>
                  <Button className={'button-control ' + (disableStart ? 'button-disabled-a' : '')} disabled={disableStart} onClick={handleStart}>
                    <Icon icon="material-symbols:play-arrow-rounded" width='30px' />
                  </Button>
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
                <TableContainer component={Paper} className="table-collapse-flights">
                  <Table className='table-flights-body' stickyHeader aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell className='table-flights-cell cell-ID' align="center">Nombre</StyledTableCell>
                        <StyledTableCell className='table-flights-cell cell-city'align="center">Origen</StyledTableCell>
                        <StyledTableCell className='table-flights-cell cell-city'align="center">Destino</StyledTableCell>
                        <StyledTableCell className='table-flights-cell cell-state' align="center">Estado</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody> 
                      {(searchTable) && 
                        searchTable.map((flight) => (
                          <StyledTableRow key={flight.name}>
                            <StyledTableCell className='table-flights-cell' align="center">{"TAP" + flight.id.toString()}</StyledTableCell>
                            <StyledTableCell className='table-flights-cell' align="center">{airportsCoordinates[flight.idAeropuertoOrigen-1].cityName}</StyledTableCell>
                            <StyledTableCell className='table-flights-cell' align="center">{airportsCoordinates[flight.idAeropuertoDestino-1].cityName}</StyledTableCell>
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