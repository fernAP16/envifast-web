import React from 'react';
import './../../App';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'; // objeto principal para los mapas
import { getCoordenadasAeropuertos } from '../../services/envios/EnviosServices';
import { Grid, Button, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css'; // 
import './Simulacion5Dias.css';
import L from "leaflet";
import DriftMarker from "leaflet-drift-marker";

const Simulacion5Dias = () => {
    const [airportsCoordinates, setAirportsCoordinates] = React.useState([])
    const [disableStart, setDisableStart] = React.useState(false);
    const [disablePause, setDisablePause] = React.useState(true);
    const [disableStop, setDisableStop] = React.useState(true);
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
      setDisableStop(false)
    }

    return (
        <div>
          <Grid display='flex'>
            <Grid item container className='containerMapa'>
              <Typography className='title'>Simulación de 5 días</Typography>
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
            <Grid marginLeft="10px">
              <Grid item className='container-buttons' display='flex' alignItems='center'> 
                <Typography position='relative'>Controles</Typography>
                <Button className={'button-control button-play ' + (disableStart ? 'button-disabled-a' : '')} disabled={disableStart} onClick={handleStart}>INICIAR</Button>
                <Button className={'button-control ' + (disablePause ? 'button-disabled-a' : 'button-pause')} disabled={disablePause}>PAUSAR</Button>
                <Button className={'button-control '  + (disableStop ? 'button-disabled-a' : 'button-stop')} disabled={disableStop}>DETENER</Button>
              </Grid> 
              <Grid container> 
                <Grid item className='container-legend'>
                  <Typography position='relative'>Leyenda</Typography>
                </Grid>
              </Grid> 
              <Grid container> 
                <Typography position='relative'>Listado de vuelos</Typography>
              </Grid> 
            </Grid> 
            
            
          </Grid>
        </div>
    )
}

export default Simulacion5Dias