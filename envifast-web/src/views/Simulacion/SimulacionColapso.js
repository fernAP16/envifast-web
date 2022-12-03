import React from 'react';
import './../../App';
import { MapContainer, TileLayer, Marker, Polyline} from 'react-leaflet'; // objeto principal para los mapas
import { getCoordenadasAeropuertos, getVuelosPorDia, getAirportsDateTime, planShipmentsSimulation, registerFlights, registerDateTimes } from '../../services/envios/EnviosServices';
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
import * as ROUTES from "../../routes/routes";
import { useNavigate } from 'react-router-dom';

const Simulacion5Dias = () => {
  const navigate = useNavigate();
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
  const [initialDate, setInitialDate] = React.useState(null);
  const [diferenciaDias, setDiferenciaDias] = React.useState(1);
  const [valueSearch, setValueSearch] = React.useState('')
  const [searchTable, setSearchTable] = React.useState([]);
  const [arrive5Days, setArrive5Days] = React.useState(false);
  const [isCollapsing, setIsCollapsing] = React.useState(false);
  const [fromReport, setFromReport] = React.useState(false);
  const [toReport, setToReport] = React.useState(false);

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
      let lastDay = new Date(currentDateTime)
      lastDay.setDate(lastDay.getDate() +  2) 
      let variables = {
        fecha: lastDay.toISOString().slice(0, 10),//startDate, // 2022-10-29
        paraSim: 1
      }
      getVuelosPorDia(variables)
      .then((response) => {
        var array = [];
        for (const element of response.data){
          array.push(
            {
              id: "TAP" + element.id.toString(),
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
        setPrimeraSeccion(Math.floor(k/10));
        setSegundaSeccion(Math.floor(k/5));
        setTerceraSeccion(Math.floor((3/10) * k));
        setCuartaSeccion(Math.floor((4/10) * k));
        setQuintaSeccion(Math.floor( k / 2));
        setSextaSeccion(Math.floor((6/10) * k));
        setSeptimaSeccion(Math.floor((7/10) * k));
        setOctavaSeccion(Math.floor((8/10) * k));
        setNovenaSeccion(Math.floor((9/10) * k));        
        setFlightsSchedule(array);
        setSearchTable(array.slice(0,50));
        setIsLoading(false);
        setFlagInicioContador(true);
      })
      .catch(function (error) {
        console.log(error);
    })
    }
  }, [stateButtons])

  const enviarPlanificador = (horaActual) => {
    if(currentDateTime != null && !arrive5Days){
      let fechaPlanificacon = currentDateTime.toISOString().split('T')[0]
      let fechaInicio = initialDate.toISOString().split('T')[0]
      // let horaInicio = currentDateTime.toISOString().split('T')[1].substring(0, 5) // substr si es inclusivo, si incluye el ultimo indice
      let horaInicioDate = new Date(fechaPlanificacon)
      // horaInicioDate.setHours((lapsoPlanificador - 1) * 4 - 5)
      horaInicioDate.setHours(horaActual - 7) // El limite inferior son 2 horas antes de la hora actual -5 - 2 
      // para la hora final tenemos que hacer una serie de calculos
      
      // lapso planificador sera el que nos dara la hora limite del rango
      let horaFinDate =  new Date(fechaPlanificacon)
      horaFinDate.setHours(horaActual - 5)// La hora actual es el limite superior

      let horaFin = horaFinDate.toISOString().split('T')[1].substring(0, 5)
      let horaInicio = horaInicioDate.toISOString().split('T')[1].substring(0, 5)
      // ahora imprimimos todos los atributos para ver si estan bien
      // console.log("Hora en ISO: " + currentDateTime.toISOString().split('T')[1])
      
      
      // FUNCIONA PERFECTO

      // Ahora solo mandamos los datos para hacer el post del planificador
      console.log("Hora actual: " + horaActual)
      let variables = {
        fecha: fechaPlanificacon,
        timeInf: horaInicio,
        timeSup: horaFin,
        paraSim: 2
      }

      if(fechaPlanificacon === fechaInicio && horaInicio === "22:00"){
        // console.log("NO DEBERIA ENTRAR EN 00:00 CUANDO ES EL PRIMER DIA")
        
      }else{
        // aqui tenemos que llamara la api
        let variables = {
          fecha: fechaPlanificacon,
          timeInf: horaInicio,
          timeSup: horaFin,
          paraSim: 2
        }

        planShipmentsSimulation(variables)
        .then(function (response) {
           // aqui capturamos, en la parte de colapso, si response
           // es 0 es porque hubo colapso
          //  console.log(response)
          if(response.data === 0){
            console.log("No se logro planificar, colapso");
            let from = horaInicioDate;
            from.setHours(horaInicioDate.getHours() - 2);
            let to = horaFinDate;
            to.setHours(horaFinDate.getHours() - 2);
            to.setMinutes(horaFinDate.getMinutes() - 1);
            setFromReport(from.toISOString().split('T')[1].substring(0, 5));
            setToReport(to.toISOString().split('T')[1].substring(0, 5));
            setIsCollapsing(true);
            setArrive5Days(true);
          }
        })
        .catch(function (error) {
            console.log(error);
            setIsLoading(false);
        })

        // aqui llamamos a la api
      }
      console.log("---------------------------")
      
    }
  }

  // Contador que modificara el tiempo:
  React.useEffect(() => {
    const interval = setInterval(() => {
      if(currentDateTime !== null){
        let temp = currentDateTime;
        let horas = temp.getHours();
        let minutos = temp.getMinutes();
        temp.setMinutes(temp.getMinutes() + 1);
        setCurrentDateTime(temp);
        if(currentDateTime.getDate() - initialDate.getDate() === 5){ // CAMBIAR
          let lastDate = currentDateTime;
          lastDate.setDate(lastDate.getDate()-1);
          navigate(ROUTES.SIMULACION5DIASREPORTE, {
            state: {
                firstDate: startDate,
                lastDate: lastDate,
                from: "22:00",
                to: "23:59",
                type: 2
            }
          });
        }
        if(horas % 2 === 0  && minutos === 0){ 
          enviarPlanificador(horas)
        }
      }
    }, 200) 
    return () => {
      clearInterval(interval);
    };
  }, [flagInicioContador])
  
  const goToReport = () => {
    navigate(ROUTES.SIMULACION5DIASREPORTE, {
      state: {
          firstDate: startDate,
          lastDate: currentDateTime,
          from: fromReport,
          to: toReport, 
          type: 2
      }
    });
  }

  // Primera Seccion
  React.useEffect(() => {
    if(arrive5Days)return;
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
    if(arrive5Days)return;
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
    if(arrive5Days)return;
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
    if(arrive5Days)return;
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
    if(arrive5Days)return;
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
    if(arrive5Days)return;
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
    if(arrive5Days)return;
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
    if(arrive5Days)return;
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
    if(arrive5Days)return;
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
    if(arrive5Days)return;
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
      if(currentDateTime.getDate() > initialDate.getDate()){
        flightSchedule.estado = 0
        flightSchedule.coordenadasActual[0] = flightSchedule.coordenadasOrigen[0];
        flightSchedule.coordenadasActual[1] = flightSchedule.coordenadasOrigen[1];
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
    date.setMinutes(date.getMinutes() - 2);
    if(flightSchedule.id === 'TAP4511 ' || flightSchedule.id === 'TAP980')
      console.log({
        idFlight: flightSchedule.id,
        dateInicio: dateInicio.toLocaleString(),
        currentDateTime: currentDateTime.toLocaleString(),
        dateFin: dateFin.toLocaleString(),
        estado: (currentDateTime > dateFin ? 2 : (currentDateTime > dateInicio ? 1 : 0))
      })

    if(currentDateTime > dateFin){
      flightSchedule.estado = 2;
    } else if(date >= dateInicio){
      flightSchedule.coordenadasActual[0] = flightSchedule.coordenadasDestinos[0];
      flightSchedule.coordenadasActual[1] = flightSchedule.coordenadasDestinos[1];
    } else if(currentDateTime >= dateInicio){
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
    setIsLoading(true);
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

  const onChangeSearchTable = (value) => {
    setValueSearch(value);
    console.log(value);
    let filtered = flightsSchedule.filter(function (flight) { 
      return airportsCoordinates[flight.idAeropuertoOrigen-1].cityName.indexOf(value) !== -1 
        || airportsCoordinates[flight.idAeropuertoDestino-1].cityName.indexOf(value) !== -1
        || flight.id.toString().indexOf(value) !== -1; 
    }).slice(0,100);
    setSearchTable(filtered);
  }

  return (

      <div>
        <Grid display='flex'>
          <Grid item className='containerMapa'>
            <Typography className='title'>Colapso logístico</Typography>
            {/* <Typography className='title'>Colapso logístico</Typography> */}
            <Typography className='date-map'>{"Tiempo actual: " + (currentDateTime ? currentDateTime.toLocaleString(): 'dd/mm/aaaa hh:mm')}</Typography>
            <MapContainer
                className="mapa-vuelo"
                center = {{lat: '21.658522', lng: '-20.591226'}}
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
            {isCollapsing && 
              <Grid display='flex' className='alert-collapse'>
              <Grid marginX='2px'>
                <Icon icon="mdi:alert-circle-outline" color="white" width='25px'/>
              </Grid>
              <Grid  marginLeft='5px'>
                <Grid display='flex' justifyContent='space-between'>
                  <Typography className='alert-title'>Alerta de colapso logístico</Typography>
                  <Button className='alert-button' onClick={() => goToReport()}> Ver reporte</Button>
                </Grid>
                <Typography className='alert-label'>No hay suficiente espacio para enviar mas paquetes.</Typography>
              </Grid>
            </Grid>
            }
          </Grid>
          <Box marginLeft="20px" marginTop="10px"> 
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
              <TableContainer component={Paper} className="table-simulation-flights">
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
                          <StyledTableCell className='table-flights-cell' align="center">{flight.id}</StyledTableCell>
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