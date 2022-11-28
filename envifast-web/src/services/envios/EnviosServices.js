import { accordionSummaryClasses } from "@mui/material";
import axios from "axios";

const API_URL = window.globalConfig || { url: process.env.REACT_APP_WEB_SERVICES_URL, keyCode: process.env.REACT_APP_KEYCODE} ;

export const getAeropuertos = () => {
    return axios.get(
        API_URL.url + "airports",
    );
}

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
    console.log(API_URL.url + "flights/dayFlightsFive/{fecha} {paraSim}?fecha=" + obj.fecha + "&paraSim=" + obj.paraSim);
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

export const registerShipment = (variables) => {
    const obj = {
        emisorNombres: variables.emisorNombres,
        emisorApellidoP: variables.emisorApellidoP,
        emisorApellidoM: variables.emisorApellidoM,
        emisorDocumentoTipo: "DNI",
        emisorDocumentoNumero: "00000000",
        emisorCorreo: variables.emisorCorreo,
        emisorTelefonoNumero: variables.emisorTelefonoNumero,
      
        destinatarioNombres: variables.destinatarioNombres,
        destinatarioApellidoP: variables.destinatarioApellidoP,
        destinatarioApellidoM: variables.destinatarioApellidoM,
        destinatarioDocumentoTipo: "DNI",
        destinatarioDocumentoNumero: "00000000",
        destinatarioCorreo: variables.destinatarioCorreo,
        destinatarioTelefonoNumero: variables.destinatarioTelefonoNumero,
      
        cantidadPaquetes: variables.cantidadPaquetes,
        origen: {
          id: variables.origen
        },
        destino: {
          id: variables.destino
        },
        fechaEnvio: variables.fechaEnvio,
        token: "secret"
    }
    return axios.post(
        API_URL.url + "orders/insert",
        obj,
    )
}

// api para el planificador
    // fecha: 2022-11-21
    // horaInicio: 09:54
    // horaFin: 09:54
    // paraSIm: 1
export const planShipmentsSimulation = (variables) =>{
    const obj = {
        fecha: variables.fecha,
        timeInf: variables.timeInf,
        timeSup: variables.timeSup,
        paraSim: 1
    }
    // el link tiene que tener la siguiente forma:
    // http://inf226g2.inf.pucp.edu.pe:8080/packages/cargarEnviosSim?fecha=2022-08-19&timeInf=20%3A00&timeSup=22%3A00&paraSim=1 no es necesario enviar los minutos
    return axios.post(
        API_URL.url + "packages/cargarEnviosSim?fecha=" + obj.fecha + "&timeInf=" + obj.timeInf + "&timeSup=" + obj.timeSup + "&paraSim="+ obj.paraSim,
    )
}
export const getShipmentsByInput = (input) => {
    const obj = {
        input: input
    }
    console.log(obj);
    return axios.get(
        API_URL.url + "orders?input=" + obj.input,
        obj,
    )
}

export const registerFlights = (variables) => {
    return axios.post(
        API_URL.url + "flights/generate?fecha=" + variables.date + "&dias=" + variables.days + "&paraSim=" + variables.paraSim
    )
}

export const registerDateTimes = (variables) => {
    return axios.get(
        API_URL.url + "airports/dateTimes?fecha=" + variables.date + "&dias=" + variables.days + "&paraSim=" + variables.paraSim
    )
}

export const getPlanifiedOrders = (variables) => {
    return axios.get(
        API_URL.url + "orders/planifiedOrders?fecha=" + variables.date + "&timeInf=" + variables.timeInf.split(':')[0] + "%3A" + 
        variables.timeInf.split(':')[1] + "&timeSup=" + variables.timeSup.split(':')[0] + "%3A" + variables.timeSup.split(':')[1] +
        "&paraSim=" + variables.paraSim
    )
}

export const getPackageRoute = (idPackage) => {
    return axios.get(
        API_URL.url + "packages/route/{id}?id=" + idPackage
    )
}