import { Button, Icon } from "@mui/material";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../routes/routes.js'
import ArrowIcon from '../../assets/icons/arrow-right.png'

const Login  = (props) => {   
    let navigate = useNavigate();

    return (
        <div>
            <h3>Iniciar sesion</h3>
            <Button 
                className="buttonLogin"
                onClick={() => {navigate(ROUTES.ENVIOS);}}
                endIcon={<img src={ArrowIcon} width="22px" />}
            >
                INGRESAR
            </Button>
        </div>
    );
}
export default Login;