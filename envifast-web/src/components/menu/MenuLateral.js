import * as React from 'react';
import { Divider, List, ListItem } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as ROUTES from "../../routes/routes";
import { useNavigate } from 'react-router';
import './MenuLateral.css'

const MenuLateral = (props) => {
    
    const navigate = useNavigate();

    const routes = [ROUTES.MAPAVUELO, ROUTES.ENVIOS, ROUTES.SIMULACION]
    const [selectedIndex, setSelectedIndex] = React.useState('Envios')
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
      };

    return (
        <div>
            <div >
                <b>Envifast</b>
            </div>
            <Divider/>
            <List>
                {['Mapa de vuelos','Envios','Simulacion'].map((text,index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton 
                            selected={selectedIndex === text}
                            onClick={(event) => { handleListItemClick(event, text); navigate(routes[index]); console.log(routes[index])}}
                            className={'lateralMenuButton ' +  (selectedIndex === text ? "buttonSelected" : " ")}>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
        

    )
}

export default MenuLateral;