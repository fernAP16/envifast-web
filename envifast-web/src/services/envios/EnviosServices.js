import { accordionSummaryClasses } from "@mui/material";
import axios from "axios";

const API_URL = window.globalConfig || { url: process.env.REACT_APP_WEB_SERVICES_URL, keyCode: process.env.REACT_APP_KEYCODE} ;

export const getCoordenadasAeropuertos = () => {
    return axios.get(
        API_URL.url + "airports/coordinates",
    );
}

// tiene la siguiente forma: http://localhost:8081/flights/dayFlightsFive/{fecha} {paraSim}?fecha=2022-11-10&paraSim=1
export const getVuelosPorDia = (variables) => {
    const obj = {
        fecha: variables.fecha,
        paraSim: variables.paraSim
    }
    return axios.get(
        API_URL.url + "flights/dayFlightsFive/{fecha} {paraSim}?fecha=" + obj.fecha + "&paraSim=" + obj.paraSim,
    );
}

export const generarEnviosPorDia = (variables) => {
    const obj = {
        fecha: variables.fecha
    }
    return axios.post(
        API_URL.url + "orders/cargar?fecha=" + obj.fecha,
    )
}

export const getPaquetesPorPlanVuelo = (variables) => {
    const obj = {
        id : variables.id
    }
    return axios.get(
        API_URL.url + "flights/{id}?id=" + obj.id,
    )
}


export const getAirportsDateTime = (variables) => {
    const obj = {
        fecha: variables.fecha,
        dias : 7
    }
    return axios.get(
        API_URL.url + "airports/datetimes?fecha=" + obj.fecha + "&dias=" + obj.dias,
    )
}