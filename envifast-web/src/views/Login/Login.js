import { Box, Button, Grid, Icon, TextField, Typography } from "@mui/material";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../routes/routes.js'
import ArrowIcon from '../../assets/icons/arrow-right.png'
import packages from '../../assets/icons/packages.png'

const Login  = (props) => {   
    let navigate = useNavigate();

    return (
        <div> 
            <Grid>
                <Typography className='view-title' align='center'>Envíos de paquetes RedEx</Typography>
                <img src={packages} className='view-image'/>
            </Grid> 
            <Grid className='container-login'>
                <Typography className='login-title' align='center'>Iniciar sesión</Typography>
                <TextField className='login-textfield-email' label='Correo electrónico' variant='standard' />
                <TextField className='login-textfield-password' label='Contraseña' variant='standard' />
                <Box textAlign='center'>
                    <Button 
                        className="login-button"
                        onClick={() => {navigate(ROUTES.ENVIOS);}}
                        endIcon={<img src={ArrowIcon} width="22px" />}
                    >
                        INGRESAR
                    </Button>
                </Box>
            </Grid>
        </div>
    );
}
export default Login;