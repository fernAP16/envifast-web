import axios from "axios";

const API_URL = window.globalConfig || { url: process.env.REACT_APP_WEB_SERVICES_URL, keyCode: process.env.REACT_APP_KEYCODE} ;

export const getAeropuertos = (variables) => {
    return axios.get(
        API_URL.url + "activity/list",
    );
}