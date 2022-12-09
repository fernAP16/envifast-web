import React from 'react';
import './../../App';
import { MapContainer, TileLayer, Marker, Polyline, Popup} from 'react-leaflet'; // objeto principal para los mapas
import { getCoordenadasAeropuertos, getVuelosPorDia, registerFlights,registerDateTimes, planShipmentsSimulation, getFlightsAirport, getCapacityAirports } from '../../services/envios/EnviosServices';
import { Grid, Button, Typography, Box, TextField, Dialog, DialogTitle, DialogContent, CircularProgress, DialogActions, Checkbox, FormControlLabel } from '@mui/material';
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
import { isCompositeComponent } from 'react-dom/test-utils';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from "../../routes/routes";

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
  const [timeInf, setTimeInf] = React.useState("22:00")
  const [timeSup, setTimeSup] = React.useState("00:00")
  const [cuartaSeccion, setCuartaSeccion] = React.useState(1);
  const [quintaSeccion, setQuintaSeccion] = React.useState(1);
  const [sextaSeccion, setSextaSeccion] = React.useState(1);
  const [septimaSeccion, setSeptimaSeccion] = React.useState(1);
  const [octavaSeccion, setOctavaSeccion] = React.useState(1);
  const [novenaSeccion, setNovenaSeccion] = React.useState(1);
  const [periodo, setPeriodo] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openPopUp, setOpenPopUp] = React.useState(false);
  const [flagInicioContador, setFlagInicioContador] = React.useState(false);
  const [initialDate, setInitialDate] = React.useState(null)
  const [valueSearch, setValueSearch] = React.useState('')
  const [searchTable, setSearchTable] = React.useState([]);
  const [arrive5Days, setArrive5Days] = React.useState(false);
  const [checkValue, setCheckValue] = React.useState(false);

  String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
  }

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
          lng: element.y_pos,
          maxCapacity: element.maxCapacity,
          currentCapacity: -1
        })
      };
      setAirportsCoordinates(arrayAirports);
    })
    .catch(function (error) {
        console.log(error);
    })
  },[])


  // Llamamos para cargar los vuelos, solo se llama una vez.

  function stringToDay(diaString) {
    //2022-08-19T12:20:00
    let [dateValues, timeValues] = diaString.split('T');

    let [year, month, day] = dateValues.split('-');
    let [hours, minutes, seconds] = timeValues.split(':');

    let dia = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    return dia
  }

  function dayToString(diaDate){
    // diaDate.setHours(diaDate.getHours() - 5) // por el tema de ISO
    // let stringDate = diaDate.toISOString();
    // return stringDate.substring(0,19);
    diaDate.setHours(diaDate.getHours() - 5) // por el tema de ISO
    let stringDate = diaDate.toISOString();
    return stringDate.slice(0, stringDate.length - 1)
  }

  const handleRegisterDays = () => {
    let lastDay = new Date(currentDateTime)
    lastDay.setDate(lastDay.getDate() + 4)
    let variables = {
        date: lastDay.toISOString().slice(0, 10),
        days: 3,
        paraSim: 1
    }
    registerFlights(variables)
    .then(function (response) {
        registerDateTimes(variables)
        .then(function (response) {
            setStateButtons(2);
            setPeriodo(periodo + 1);
        })
        .catch(function (error) {
            console.log(error);
            setIsLoading(false);
        })
    })
    .catch(function (error) {
        console.log(error);
        setIsLoading(false);
    })
  }

  const handleGetAirport = () => {
    let lastDay = new Date(currentDateTime)
    lastDay.setDate(lastDay.getDate() +  4) 
    let variables = {
      fecha : lastDay.toISOString().slice(0, 10),
      timeInf : timeInf,
      timeSup : timeSup,
      paraSim: 1
    }

    getFlightsAirport(variables)
    .then((response) => {
      if(response.data === 1);

    }).catch(function (error) {
        console.log(error);
    })

  }


  React.useEffect(() => {
    if(periodo !== 0){
      // fecha para el dia, tiene que ser la fecha de inicio + 3 dias
      let lastDay = new Date(currentDateTime)
      lastDay.setDate(lastDay.getDate() +  4) 
      let variables = {
        fecha: lastDay.toISOString().slice(0, 10),//startDate, // 2022-10-12
        paraSim: 1
      }
      getVuelosPorDia(variables)
      .then((response) => {
        var array = [];
        for (const element of response.data){
          let diaSalida = stringToDay(element.horaSalida)
          let diaLlegada = stringToDay(element.horaLLegada)
          diaSalida.setDate(diaSalida.getDate() - 4)
          diaLlegada.setDate(diaLlegada.getDate() - 4)
          let horaSalidaString = dayToString(diaSalida)
          let horaLlegadaString = dayToString(diaLlegada)
          array.push(
            {
              id: "TAP" + element.id.toString(),
              idAeropuertoOrigen: element.idAeropuertoOrigen,
              idAeropuertoDestino: element.idAeropuertoDestino,
              horaSalida: horaSalidaString,
              horaLLegada: horaLlegadaString,
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
        setSearchTable(array.slice(0,50));
        setIsLoading(false);
        setFlagInicioContador(true);
        handleGetAirport()
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
      let horaInicioDate = new Date(fechaPlanificacon)
      horaInicioDate.setHours(horaActual - 7)
      let horaFinDate =  new Date(fechaPlanificacon)
      horaFinDate.setHours(horaActual - 5)// La hora actual es el limite superior
      let horaFin = horaFinDate.toISOString().split('T')[1].substring(0, 5)
      let horaInicio = horaInicioDate.toISOString().split('T')[1].substring(0, 5)

      if(fechaPlanificacon === fechaInicio && horaInicio === "22:00"){

      } else {
        let variables = {
          fecha: fechaPlanificacon,
          timeInf: horaInicio,
          timeSup: horaFin,
          paraSim: 1
        }
        planShipmentsSimulation(variables)
        .then(function (response) {
          let varAir = {
            date: fechaInicio,
            time: horaInicio,
          }
          getCapacityAirports(varAir)
          .then(function (response){
            let array = response.data
            for (var i=0; i<array.length; i++) airportsCoordinates[i].currentCapacity = array[i].usedCapacity;
          })
          .catch(function (error){})
        })
        .catch(function (error) {
            console.log(error);
            setIsLoading(false);
          })
      }
    }
  }
  
  // Contador que modificara el tiempo:
  React.useEffect(() => {
    if(flagInicioContador){
      const interval = setInterval(() => {
        let temp = currentDateTime;
        let horas = temp.getHours();
        let minutos = temp.getMinutes();
        temp.setMinutes(temp.getMinutes() + 1);
        setCurrentDateTime(temp);
        let daysBetween = parseInt((currentDateTime.getTime() - initialDate.getTime()) / (1000 * 3600 * 24));
        if(daysBetween === 5){
          let lastDate = currentDateTime;
          lastDate.setDate(lastDate.getDate()-1);
          navigate(ROUTES.SIMULACION5DIASREPORTE, {
            state: {
                firstDate: startDate,
                lastDate: lastDate,
                from: "22:00",
                to: "23:59",
                type: 1
            }
          });
        }
        if(horas % 2 === 0  && minutos === 0){ 
          enviarPlanificador(horas)
        }
      }, 200) 
      return () => {
        clearInterval(interval);
      };
    }
  }, [flagInicioContador])

  

  // Primera Seccion
  React.useEffect(() => {
    if(arrive5Days)return;
    if(stateButtons === 2){
      const interval = setInterval(() => {
        for(var i = 0 ; i < primeraSeccion; i++){
          show_interval(flightsSchedule[i])
        }
      }, 200)
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

  function getDateInt(date){
    return date.getFullYear()*10000 + (date.getMonth()+1)*100 + date.getDate();
  }
  
  const show_interval = (flightSchedule) => { // ACÁ ESTÁ EL ERROR
    if(flightSchedule.estado === 2) {
      if(getDateInt(currentDateTime) > getDateInt(initialDate)){
        flightSchedule.estado = 0
        flightSchedule.coordenadasActual[0] = flightSchedule.coordenadasOrigen[0];
        flightSchedule.coordenadasActual[1] = flightSchedule.coordenadasOrigen[1];
        let diaSalida = stringToDay(flightSchedule.horaSalida)
        let diaLlegada = stringToDay(flightSchedule.horaLLegada)
        diaSalida.setDate(diaSalida.getDate() + 1)
        diaLlegada.setDate(diaLlegada.getDate() + 1)
        let horaSalidaString = dayToString(diaSalida)
        let horaLlegadaString = dayToString(diaLlegada)
        flightSchedule.horaSalida = horaSalidaString
        flightSchedule.horaLLegada = horaLlegadaString
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
      let currentTimeNow = currentDateTime.getTime();
      let difTime = new Date(flightSchedule.horaLLegada).getTime() - new Date(flightSchedule.horaSalida).getTime();
      let currTime = currentTimeNow - new Date(flightSchedule.horaSalida).getTime();
      flightSchedule.coordenadasActual[0] = flightSchedule.coordenadasOrigen[0] + (flightSchedule.coordenadasDestinos[0] - flightSchedule.coordenadasOrigen[0])*currTime/difTime
      flightSchedule.coordenadasActual[1] = flightSchedule.coordenadasOrigen[1] + (flightSchedule.coordenadasDestinos[1] - flightSchedule.coordenadasOrigen[1])*currTime/difTime
    } else if(currentDateTime > dateInicio){
      flightSchedule.estado = 1;
    }
  }

  function obtainCapacity() {
    let temp = new Date();
    temp.setHours(temp.getHours() - 5)
    return temp.toISOString().substring(0, 19);
  }

  const AirportMarket = () => {
    return (
      <>
      {airportsCoordinates.map((airport) => (
          <Marker position={[airport.lat , airport.lng]} icon={getIcon()}>
            <Popup>
              Capac. máx.: {airport.maxCapacity}
              {airport.currentCapacity !== -1 ? <><br/>Capac. disp.: {airport.currentCapacity}</> : <></>}
            </Popup>
          </Marker>
      ))}
      </> 
    )
  }

  const handleStart = () => {
    // if(stateButtons === 1){
    setIsLoading(true);
    handleRegisterDays();
    // }
    // else setStateButtons(3)
    setDisableStart(true);
  }

  const handleDate = event => {
    setStartDate(event.target.value);
    setStartDateString(formatDate(event.target.value));
    setCurrentDateTime(new Date(event.target.value + ' 00:00:00'));
    setInitialDate(new Date(event.target.value + ' 00:00:00'))
    setStateButtons(1);
    setDisableStart(false);
  }

  const handleFlightDetail = () => {
    // setOpenPopUp(true);
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
      <div>
        <Grid display='flex'>
          <Grid item className='containerMapa'>
            <Typography className='title'>Simulación de 5 días</Typography>
            {/* <Typography className='title'>Colapso logístico</Typography> */}
            <Typography className='date-map'>{"Tiempo actual: " + (currentDateTime ? currentDateTime.toLocaleString(): 'dd/mm/aaaa hh:mm')}</Typography>
            <MapContainer
                className="mapa-vuelo"
                // center = {{lat: '28.058522', lng: '-20.591226'}}
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
            <Grid container alignItems='center' marginBottom='10px' >
              <Grid item xs={5}>
                <Typography fontWeight="bold" position='relative'>Fecha de inicio: </Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField type='date' size='small' value={startDate} fullWidth onChange={handleDate} 
                  inputProps={{ min: "2022-08-02", max: "2023-05-24" }} disabled={stateButtons === 2}/>
              </Grid>
              <Grid item xs={2} align='right'>
                <Button className={'button-control ' + (disableStart ? 'button-disabled-a' : '')} disabled={disableStart} onClick={handleStart}>
                  <Icon icon="material-symbols:play-arrow-rounded" width='30px' />
                </Button>
              </Grid>
            </Grid>
            <Grid container alignItems='center' marginBottom='10px' >
              <Grid item xs={5}>
                <Typography fontWeight="bold" position='relative'>Configuraciones: </Typography>
              </Grid>
              <Grid item xs={7}>
                <FormControlLabel control={<Checkbox checked={checkValue} onChange={() => setCheckValue(!checkValue)}defaultChecked className='checkbox-flights'/>} label={<Typography fontWeight="bold" position='relative'>Mostrar rutas de vuelos </Typography>}/>
              </Grid>
            </Grid>
            <Grid container alignItems='center' marginBottom='10px'>
              <Grid item xs={5}>
                <Typography fontWeight="bold">Filtrar vuelos: </Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField size='small' fullWidth disabled={stateButtons !== 2} value={valueSearch} onChange={(e) => onChangeSearchTable(e.target.value)}></TextField>
              </Grid>
            </Grid>
            <Grid>
              <Typography fontWeight="bold">Listado de vuelos</Typography>
              <TableContainer component={Paper} className="table-simulation-flights">
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
          </Box>                         
        </Grid>
        <Dialog open={isLoading}>
          <DialogTitle>
              Generando simulación...
          </DialogTitle>
          <DialogContent>
            <Grid item container justifyContent='center'>
              <CircularProgress className='loading-comp'/>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
  )
}

export default Simulacion5Dias