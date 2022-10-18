import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as ROUTES from "../routes";
import Login from "../../views/Login/Login"
import MapaVuelo from "../../views/MapaVuelos/MapaVuelos";
import Envios from "../../views/Envios/Envios";
import Layout from '../../hoc/layout/Layout';
import Simulacion5Dias from '../../views/Simulacion/Simulacion5Dias';
import SimulacionColapso from '../../views/Simulacion/SimulacionColapso';

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
            <Route path={ROUTES.SIMULACION5DIAS} element={<Layout title='Simulacion 5 dias'><Simulacion5Dias/></Layout>}/>  
            <Route path={ROUTES.SIMULACIONCOLAPSO} element={<Layout title='Simulacion colapso logístico'><SimulacionColapso/></Layout>}/>  
        </Routes>
    );

    return(
        <BrowserRouter>
            {true ? routes : publicRoutes}
        </BrowserRouter>
    )

};

export default AppRouter;