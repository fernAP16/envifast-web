import { Button } from "@mui/material";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../routes/routes.js'

const Login  = (props) => {   
    let navigate = useNavigate();

    return (
        <div>
            <h3>Iniciar sesion</h3>
            <Button 
                className="buttonLogin"
                onClick={() => {navigate(ROUTES.ENVIOS);}}
            >
                INICIAR SESION
            </Button>
        </div>
    );
}
export default Login;