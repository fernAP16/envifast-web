import { accordionSummaryClasses } from "@mui/material";
import axios from "axios";

const API_URL = window.globalConfig || { url: process.env.REACT_APP_WEB_SERVICES_URL, keyCode: process.env.REACT_APP_KEYCODE} ;

export const getCoordenadasAeropuertos = () => {
    return axios.get(
        API_URL.url + "airports/coordinates",
    );
}

export const getVuelosPorDia = (variables) => {
    const obj = {
        fecha: variables.fecha,
        periodo: variables.periodo
    }
    return axios.get(
        API_URL.url + "flights/{fecha} {per}?fecha=" + obj.fecha + "&per=" + obj.periodo,
    );
}