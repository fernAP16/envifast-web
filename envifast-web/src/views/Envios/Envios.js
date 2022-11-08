import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import './Envios.css'

const Envios  = (props) => {  
    const [shipments, setShipments] = React.useState([]);
    const [isRegistering, setIsRegistering] = React.useState(false);
    const [countryFrom, setCountryFrom] = React.useState('');
    const [countryTo, setCountryTo] = React.useState('');

    React.useEffect(() => {
        setShipments([{
            id: 1,
            emisor: 'Esther Campos Bolivar',
            destinatario: 'Salvador Banda',
            estado: 2,
            origen: 'Lima',
            destino: 'Montevideo',
            cantPaquetes: 1,
            fechaEnvio: new Date().toLocaleDateString()
        },{
            id: 2,
            emisor: 'Esther Campos Bolivar',
            destinatario: 'Salvador Banda',
            estado: 1,
            origen: 'Lima',
            destino: 'Montevideo',
            cantPaquetes: 1,
            fechaEnvio: new Date().toLocaleDateString()
        }])
    },[])

    const handleCountryFrom = (e) => {
        setCountryFrom(e.target.value);
    }

    const handleCountryTo = (e) => {
        setCountryTo(e.target.value);
    }

    const handleRegister = () => {
        setIsRegistering(true);
    }

    const handleRegisterShipment = () => {
        setIsRegistering(false);
    }

    const handleReturn = () => {
        setCountryFrom('');
        setCountryTo('');
        setIsRegistering(false);
    }

    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick") 
            return;
        handleReturn();
    }

    return (
        <div>
            <Grid className='container-shipment'>
                <Typography className='title-shipment'>Envíos</Typography>
                <Grid container className='search-actions'>
                    <Grid item xs={4}>
                        <TextField size='small' fullWidth label='Buscar'></TextField>
                    </Grid>
                    <Grid item xs={4} className='group-buttons'>
                        <Button className='buttons-actions'>Buscar</Button>
                        <Button className='buttons-actions'>Subir envíos</Button>
                        <Button className='buttons-actions' onClick={handleRegister}>Registrar envíos</Button>
                    </Grid>
                </Grid>
                <Grid container xs={12} >
                    <TableContainer component={Paper} className='table-shipment'>
                        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table" size='medium'>
                            <TableHead>
                            <TableRow>
                                <TableCell className='table-shipment-header' >ID</TableCell>
                                <TableCell className='table-shipment-header'>Emisor</TableCell>
                                <TableCell className='table-shipment-header'>Destinatario</TableCell>
                                <TableCell className='table-shipment-header'>Estado del envío</TableCell>
                                <TableCell className='table-shipment-header'>Ciudad de origen</TableCell>
                                <TableCell className='table-shipment-header'>Ciudad de destino</TableCell>
                                <TableCell className='table-shipment-header'>N° de paquetes</TableCell>
                                <TableCell className='table-shipment-header'>Fecha de envío</TableCell>
                                <TableCell className='table-shipment-header' align='center'>Acciones</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {shipments.map((shipment) => (
                                <TableRow
                                    key={shipment.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{shipment.id}</TableCell>
                                    <TableCell>{shipment.emisor}</TableCell>
                                    <TableCell>{shipment.destinatario}</TableCell>
                                    <TableCell align='center'>
                                        <Grid justifyContent='center'>
                                            <Typography className='table-state'
                                                border={shipment.estado === 0 ? "1.5px solid #FFFA80" : shipment.estado === 1 ? "1.5px solid #FFA0A0" : "1.5px solid #B6FFD8"}
                                                backgroundColor={shipment.estado === 0 ? "#FFFA80" : shipment.estado === 1 ? "#FFA0A0" : "#B6FFD8"}
                                            >
                                                {shipment.estado === 0 ? "Por enviar" : shipment.estado === 1 ? "Enviándose" : "Enviado"}
                                            </Typography>  
                                        </Grid> 
                                    </TableCell>
                                    <TableCell>{shipment.origen}</TableCell>
                                    <TableCell>{shipment.destino}</TableCell>
                                    <TableCell align='center'>{shipment.cantPaquetes}</TableCell>
                                    <TableCell align='center'>{shipment.fechaEnvio}</TableCell>
                                    <TableCell align='center'><Button className='buttons-actions'>Ver detalle</Button></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Dialog
                open={isRegistering}
                onClose={handleClose}
            >
                <DialogTitle className='dialog-title'>
                    <Typography className='register-title'>REGISTRAR ENVÍO:</Typography>
                    <hr className='dialog-line'/>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="register-dialog-description">
                        <Grid>
                            <Typography className='register-label'>Emisor:</Typography>
                            <Grid container spacing={1} className='container-textfields'>
                                <Grid item xs={8}>
                                    <TextField size='small' label='Nombre' fullWidth></TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel size='small'>Origen</InputLabel>
                                        <Select
                                            size='small'
                                            value={countryFrom}
                                            label='Origen'
                                            onChange={handleCountryFrom}
                                        >
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} className='container-textfields'>
                                <Grid item xs={8}>
                                    <TextField size='small' className='' label='Correo electrónico' fullWidth></TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField size='small' className='' label='Número de celular'></TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid>
                            <Typography className='register-label'>Destinatario:</Typography>
                            <Grid container spacing={1} className='container-textfields'>
                                <Grid item xs={8}>
                                    <TextField size='small' label='Nombre' fullWidth></TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel size='small'>Destino</InputLabel>
                                        <Select
                                            size='small'
                                            value={countryTo}
                                            label='Origen'
                                            onChange={handleCountryTo}
                                        >
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} className='container-textfields'>
                                <Grid item xs={8}>
                                    <TextField size='small' className='' label='Correo electrónico' fullWidth></TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField size='small' className='' label='Número de celular'></TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Typography className='register-label'>Cantidad de paquetes:</Typography>
                        <TextField size='small' className='' label='N° de paquetes'></TextField>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className='button-cancel' variant='outlined' onClick={handleReturn}>Cancelar</Button>
                    <Button className='button-register' onClick={handleRegisterShipment} autoFocus>Registrar</Button>
                </DialogActions>
            </Dialog>
        </div>
    
    );
}
export default Envios;