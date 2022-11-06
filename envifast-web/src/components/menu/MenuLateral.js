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
    const routes = [ROUTES.MAPAVUELO, ROUTES.ENVIOS, '', ROUTES.SIMULACION5DIAS, ROUTES.SIMULACIONCOLAPSO];
    const [enableSimulacion, setEnableSimulacion] = React.useState(true);
    const [selectedIndex, setSelectedIndex] = React.useState('Login');
    
    const handleListItemClick = (event, index, text) => {
        setSelectedIndex(text);
        if(index >= 2){
            setEnableSimulacion(false);
        } else {
            setEnableSimulacion(true);
        }
        navigate(routes[index]);
        
      };

    return (
        <div className='menuLateralContainer' >
            <div className='logoContainer'>
                <Icon icon="carbon:content-delivery-network" color="white" width="35px"/>
                <Typography className='logoText'>EnviFast</Typography>
            </div>
            <Divider/>
            <List>
                {['Mapa de vuelos','Envios','Simulacion','De 5 dias','Colapso logístico'].map((text,index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton 
                            selected={selectedIndex === text}
                            onClick={(event) => { handleListItemClick(event, index, text) }}
                            className={'lateralMenuButton ' +  (selectedIndex === text ? 'buttonSelected ' : ' ') + ((index > 2 && enableSimulacion === true)? 'buttonInvisible' : 'buttonVisible')}
                            disabled={(index > 2 ? enableSimulacion : false)}
                            >
                            <ListItemIcon>
                                <Icon className="menuIcon" icon={icons[index]} color="white" width="25px" />
                            </ListItemIcon>
                            <ListItemText primary={text} style={index >= 3 ? {marginLeft: "5px"} : {}}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
        

    )
}

export default MenuLateral;