import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as ROUTES from "../routes";
import Login from "../../views/Login/Login"
import MapaVuelo from "../../views/MapaVuelos/MapaVuelos";
import Envios from "../../views/Envios/Envios";
import Simulacion from "../../views/Simulacion/Simulacion";
import Layout from '../../hoc/layout/Layout';

const AppRouter = (props) => {

    let publicRoutes = (
        <Routes>
            <Route index element={<Login/>} />
            <Route path="*" element={<Login/>} />
        </Routes>
    )

    let routes = (
        <Routes>  
            <Route index element={<Login/>}/> 
            <Route path={ROUTES.MAPAVUELO} element={<Layout title='Mapa de vuelos'><MapaVuelo/></Layout>}/>          
            <Route path={ROUTES.ENVIOS} element={<Layout title='Envios'><Envios/></Layout>}/>  
            <Route path={ROUTES.SIMULACION} element={<Layout title='Simulacion'><Simulacion/></Layout>}/>  
        </Routes>
    );

    return(
        <BrowserRouter>
            {true ? routes : publicRoutes}
        </BrowserRouter>
    )

};

export default AppRouter;