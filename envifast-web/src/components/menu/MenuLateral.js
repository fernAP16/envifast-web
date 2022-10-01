import * as React from 'react';
import { Divider, List, ListItem, Typography } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import * as ROUTES from "../../routes/routes";
import { useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import './MenuLateral.css'

const MenuLateral = (props) => {
    
    const navigate = useNavigate();
    const icons = ["ion:home-sharp", "mdi:calendar-clock-outline","icon-park-outline:setting-laptop"];
    const routes = [ROUTES.MAPAVUELO, ROUTES.ENVIOS, ROUTES.SIMULACION];
    const [selectedIndex, setSelectedIndex] = React.useState('Login');
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
      };

    return (
        <div >
            <div className='logoContainer'>
                <Icon icon="carbon:content-delivery-network" color="white" width="40px"/>
                <Typography className='logoText'>EnviFast</Typography>
            </div>
            <Divider/>
            <List className='menuLateralContainer'>
                {['Mapa de vuelos','Envios','Simulacion'].map((text,index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton 
                            selected={selectedIndex === text}
                            onClick={(event) => { handleListItemClick(event, text); navigate(routes[index]); console.log(routes[index])}}
                            className={'lateralMenuButton ' +  (selectedIndex === text ? "buttonSelected" : " ")}
                            disabled={text === ''}>
                            <ListItemIcon>
                                <Icon className="menuIcon" icon={icons[index]} color="white" width="30px" />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
        

    )
}

export default MenuLateral;