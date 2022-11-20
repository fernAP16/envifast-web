import React from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import './Envios.css'
import { getAeropuertos, getShipmentsByInput, registerShipment } from '../../services/envios/EnviosServices';

const Envios  = (props) => {  
    const [shipments, setShipments] = React.useState([]);
    const [airportsCities, setAirportsCities] = React.useState([]);
    const [input, setInput] = React.useState('');
    const [nameFrom, setNameFrom] = React.useState('');
    const [paternalNameFrom, setPaternalNameFrom] = React.useState('');
    const [maternalNameFrom, setMaternalNameFrom] = React.useState('');
    const [countryFrom, setCountryFrom] = React.useState('');
    const [emailFrom, setEmailFrom] = React.useState('');
    const [numberFrom, setNumberFrom] = React.useState('');
    const [nameTo, setNameTo] = React.useState('');
    const [paternalNameTo, setPaternalNameTo] = React.useState('');
    const [maternalNameTo, setMaternalNameTo] = React.useState('');
    const [countryTo, setCountryTo] = React.useState('');
    const [emailTo, setEmailTo] = React.useState('');
    const [numberTo, setNumberTo] = React.useState('');
    const [numberPackages, setNumberPackages] = React.useState('');
    const [shipmentDetail, setShipmentDetail] = React.useState(null);
    const [isRegistering, setIsRegistering] = React.useState(false);
    const [confirmRegister, setConfirmRegister] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [shipmentRegistered, setShipmentRegistered] = React.useState(false);
    const [isDetail, setIsDetail] = React.useState(false);
    const [isLoadingInit, setIsLoadingInit] = React.useState(true);

    React.useEffect(() => {
        getAeropuertos()
        .then(function (response) {
            var arrayAirports = [];
            for (const element of response.data) {
            arrayAirports.push({
                id: element.id,
                label: element.ciudad.nombre,
            })
            };
            setAirportsCities(arrayAirports);
            getShipments()
        })
        .catch(function (error) {
            console.log(error);
        })
    },[])

    const getShipments = () => {
        console.log(input);
        setShipments([]);
        getShipmentsByInput(input)
        .then(function (response) {
            console.log(response);
            var arrayShipments = [];
            for (const element of response.data) {
                arrayShipments.push({
                    id: element.id,
                    codigo: element.codigo,
                    nombreEmisor: element.emisorNombres + ' ' + element.emisorApellidoP + ' ' + element.emisorApellidoM,
                    correoEmisor: element.emisorCorreo,
                    numeroEmisor: element.emisorTelefonoNumero,
                    nombreDestinatario: element.destinatarioNombres + ' ' + element.destinatarioApellidoP + ' ' + element.destinatarioApellidoM,
                    correoDestinatario: element.destinatarioCorreo,
                    telefonoDestinatario: element.destinatarioTelefonoNumero,
                    paquetes: element.paquetes,
                    estado: 0, // Cambiar para que tenga sentido
                    origen: element.origen,
                    destino: element.destino,
                    cantPaquetes: element.paquetes.length,
                    fechaEnvio: new Date(element.fechaEnvio).toLocaleDateString(),
                    tiempoTotal: element.tiempoTotal
                })
            };
            console.log(arrayShipments)
            setShipments(arrayShipments);
            setIsLoadingInit(false);
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    const handleRegister = () => {
        setIsRegistering(true);
    }

    const handleRegisterDialog = () => {
        setIsRegistering(false);
        setConfirmRegister(true);
    }

    const handleConfirmRegister = () => {
        setConfirmRegister(false);
        // setIsLoading(true);
        let date = new Date();
        date.setHours(date.getHours() - 5);
        let variables = {
            emisorNombres: nameFrom,
            emisorApellidoP: paternalNameFrom,
            emisorApellidoM: maternalNameFrom,
            emisorCorreo: emailFrom,
            emisorTelefonoNumero: numberFrom,
            destinatarioNombres: nameTo,
            destinatarioApellidoP: paternalNameTo,
            destinatarioApellidoM: maternalNameTo,
            destinatarioCorreo: emailTo,
            destinatarioTelefonoNumero: numberTo,
            cantidadPaquetes: parseInt(numberPackages),
            origen: countryFrom.id,
            destino: countryTo.id,
            fechaEnvio: date
        }
        console.log(variables);
        registerShipment(variables)
        .then(function (response) {
            setIsLoading(false);
            setShipmentRegistered(true);
        })
        .catch(function (error) {
            console.log(error);
            setIsLoading(false);
        })
    }

    const handleReturn = () => {
        eraseRegisterInfo()
        setIsRegistering(false);
    }

    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick") 
            return;
        handleReturn();
    }

    const handleReturnConfirm = () => {
        setConfirmRegister(false);
        setIsRegistering(true);
    }

    const handleCloseConfirm = (event, reason) => {
        if (reason && reason === "backdropClick") 
            return;
        handleReturn();
    }

    const eraseRegisterInfo = () => {
        setNameFrom('');
        setPaternalNameFrom('');
        setMaternalNameFrom('');
        setCountryFrom('');
        setEmailFrom('');
        setNumberFrom('');
        setNameTo('');
        setPaternalNameTo('');
        setMaternalNameTo('');
        setCountryTo('');
        setEmailTo('');
        setNumberTo('');
        setNumberPackages('');
    }

    const handleVerDetalle = (shipment) => {
        setShipmentDetail(shipment);
        setIsDetail(true);
    }

    return (
        <div>
            <Grid className='container-shipment'>
                <Typography className='title-shipment'>Envíos</Typography>
                <Grid container className='search-actions'>
                    <Grid item xs={4}>
                        <TextField size='small' label='Buscar' fullWidth value={input} onChange={(e) => setInput(e.target.value)}></TextField>
                    </Grid>
                    <Grid item xs={4} className='group-buttons'>
                        <Button className='buttons-actions' onClick={getShipments}>Buscar</Button>
                        <Button className='buttons-actions'>Subir envíos</Button>
                        <Button className='buttons-actions' onClick={handleRegister}>Registrar envíos</Button>
                    </Grid>
                </Grid>
                <Grid container xs={12} width='1250px'>
                    <TableContainer component={Paper} className='table-shipment'>
                        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table" size='medium'>
                            <TableHead>
                            <TableRow>
                                <TableCell className='table-shipment-header'>N°</TableCell>
                                <TableCell className='table-shipment-header' width='150px'>Emisor</TableCell>
                                <TableCell className='table-shipment-header' width='150px'>Destinatario</TableCell>
                                <TableCell className='table-shipment-header'>Estado del envío</TableCell>
                                <TableCell className='table-shipment-header'>Ciudad de origen</TableCell>
                                <TableCell className='table-shipment-header'>Ciudad de destino</TableCell>
                                <TableCell className='table-shipment-header'>N° de paquetes</TableCell>
                                <TableCell className='table-shipment-header'>Fecha de envío</TableCell>
                                <TableCell className='table-shipment-header' align='center' width='150px'>Acciones</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {shipments.map((shipment, index) => (
                                <TableRow
                                    key={shipment.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{index+1}</TableCell>
                                    <TableCell>{shipment.nombreEmisor}</TableCell>
                                    <TableCell>{shipment.nombreDestinatario}</TableCell>
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
                                    <TableCell>{shipment.origen.ciudad.nombre}</TableCell>
                                    <TableCell>{shipment.destino.ciudad.nombre}</TableCell>
                                    <TableCell>{shipment.cantPaquetes}</TableCell>
                                    <TableCell>{shipment.fechaEnvio}</TableCell>
                                    <TableCell align='center'><Button className='buttons-actions' onClick={() => handleVerDetalle(shipment)}>Ver detalle</Button></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Dialog
                className='dialog-register'
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
                                <Grid item xs={5}>
                                    <TextField size='small' label='Nombres' fullWidth value={nameFrom} onChange={(e) => setNameFrom(e.target.value)}></TextField>
                                </Grid>
                                <Grid item xs={3.5}>
                                    <TextField size='small' label='Apellido paterno' fullWidth value={paternalNameFrom} onChange={(e) => setPaternalNameFrom(e.target.value)}></TextField>
                                </Grid>
                                <Grid item xs={3.5}>
                                    <TextField size='small' label='Apellido materno' fullWidth value={maternalNameFrom} onChange={(e) => setMaternalNameFrom(e.target.value)}></TextField>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} className='container-textfields'>
                                
                                <Grid item xs={5}>
                                    <TextField size='small' className='' label='Correo electrónico' value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} fullWidth></TextField>
                                </Grid>
                                <Grid item xs={3.5}>
                                    <TextField size='small' className='' label='Número de celular' value={numberFrom} onChange={(e) => setNumberFrom(e.target.value)}></TextField>
                                </Grid>
                                <Grid item xs={3.5}>
                                    <FormControl fullWidth>
                                        <InputLabel size='small'>Origen</InputLabel>
                                        <Select
                                            size='small'
                                            value={countryFrom}
                                            label='Origen'
                                            onChange={(e) => setCountryFrom(e.target.value)}
                                        >
                                        {airportsCities.map((airportCity) => (
                                            <MenuItem
                                                key={airportCity.label}
                                                value={airportCity}
                                            >
                                                <Typography size="small">{airportCity.label}</Typography>
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid>
                            <Typography className='register-label'>Destinatario:</Typography>
                            <Grid container spacing={1} className='container-textfields'>
                                <Grid item xs={5}>
                                    <TextField size='small' label='Nombres' fullWidth value={nameTo} onChange={(e) => setNameTo(e.target.value)}></TextField>
                                </Grid>
                                <Grid item xs={3.5}>
                                    <TextField size='small' label='Apellido paterno' fullWidth value={paternalNameTo} onChange={(e) => setPaternalNameTo(e.target.value)}></TextField>
                                </Grid>
                                <Grid item xs={3.5}>
                                    <TextField size='small' label='Apellido materno' fullWidth value={maternalNameTo} onChange={(e) => setMaternalNameTo(e.target.value)}></TextField>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} className='container-textfields'>
                                <Grid item xs={5}>
                                    <TextField size='small' className='' label='Correo electrónico' value={emailTo} onChange={(e) => setEmailTo(e.target.value)} fullWidth></TextField>
                                </Grid>
                                <Grid item xs={3.5}>
                                    <TextField size='small' className='' label='Número de celular' value={numberTo} onChange={(e) => setNumberTo(e.target.value)}></TextField>
                                </Grid>
                                <Grid item xs={3.5}>
                                    <FormControl fullWidth>
                                        <InputLabel size='small'>Destino</InputLabel>
                                        <Select
                                            size='small'
                                            value={countryTo}
                                            label='Origen'
                                            onChange={(e) => setCountryTo(e.target.value)}
                                        >
                                        {airportsCities.map((airportCity) => (
                                            <MenuItem
                                                key={airportCity.label}
                                                value={airportCity}
                                            >
                                                <Typography size="small">{airportCity.label}</Typography>
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} className='container-textfields'>
                            <Grid item xs={3.5}>
                                <Typography className='register-label'>Cantidad de paquetes:</Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                                <TextField size='small' className='' label='Cant.' value={numberPackages} onChange={(e) => setNumberPackages(e.target.value)}></TextField>
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className='button-cancel' variant='outlined' onClick={handleReturn}>Cancelar</Button>
                    <Button className='button-register' onClick={handleRegisterDialog} autoFocus>Registrar</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                className='dialog-register'
                open={confirmRegister}
                onClose={handleCloseConfirm}
            >
                <DialogContent className='content-confirm'>
                    <Typography className='register-label'>¿Está seguro de confirmar el registro?</Typography>
                </DialogContent>
                <DialogActions className='actions-confirm'>
                    <Button className='button-cancel' variant='outlined' onClick={handleReturnConfirm}>Volver</Button>
                    <Button className='button-register confirm' onClick={handleConfirmRegister} autoFocus>Confirmar</Button>
                </DialogActions>
            </Dialog>
            <Dialog 
                open={isLoading}
                >
                <DialogTitle>
                    Cargando...
                </DialogTitle>
                <DialogContent>
                    <Grid item container justifyContent='center'>
                        <CircularProgress className='loading-comp'/>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Dialog
                className='dialog-register'
                open={shipmentRegistered}
            >
                <DialogContent className='content-confirm'>
                    <Typography className='register-label'>El envío se registró correctamente</Typography>
                </DialogContent>
                <DialogActions className='actions-confirm'>
                    <Button className='button-register' onClick={() => {setShipmentRegistered(false);getShipments()}} autoFocus>Volver a envíos</Button>
                </DialogActions>
            </Dialog>
            {shipmentDetail &&
            <Dialog 
                open={isDetail}
                >
                <DialogTitle>
                    {'Detalle del envío ' + shipmentDetail.codigo}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="register-dialog-description">
                        <Grid>
                            <Typography className='register-label'>Emisor:</Typography>
                            <Grid container spacing={1} className='container-textfields'>
                                <Grid item xs={8}>
                                    <TextField size='small' className='input-' label='Nombre completo' fullWidth value={shipmentDetail.nombreEmisor} disabled={true}></TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField size='small' label='Ciudad' fullWidth value={shipmentDetail.origen.ciudad.nombre}  disabled={true}></TextField>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} className='container-textfields'>
                                <Grid item xs={8}>
                                    <TextField size='small' className='' label='Correo electrónico' value={shipmentDetail.correoEmisor} disabled={true} fullWidth></TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField size='small' className='' label='Número de celular' value={shipmentDetail.numeroEmisor} disabled={true} fullWidth></TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid>
                            <Typography className='register-label'>Destinatario:</Typography>
                            <Grid container spacing={1} className='container-textfields'>
                                <Grid item xs={8}>
                                    <TextField size='small' label='Nombre completo' fullWidth value={shipmentDetail.nombreDestinatario} disabled={true}></TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField size='small' label='Ciudad' fullWidth value={shipmentDetail.destino.ciudad.nombre}  disabled={true}></TextField>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} className='container-textfields'>
                                <Grid item xs={8}>
                                    <TextField size='small' className='' label='Correo electrónico' value={shipmentDetail.correoDestinatario} disabled={true} fullWidth></TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField size='small' className='' label='Número de celular' value={shipmentDetail.telefonoDestinatario} disabled={true} fullWidth></TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} className='container-textfields'>
                            <Grid item xs={4}>
                                <Typography className='register-label'>N° de paquetes:</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <TextField size='small' className='' label='Cant.' value={shipmentDetail.cantPaquetes} disabled={true}></TextField>
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='actions-confirm'>
                    <Button className='button-register' onClick={() => setIsDetail(false)} autoFocus>Volver</Button>
                </DialogActions>
            </Dialog>
            }
            <Dialog open={isLoadingInit}>
                <DialogTitle>
                    Cargando...
                </DialogTitle>
                <DialogContent>
                    <Grid item container justifyContent='center'>
                        <CircularProgress className='loading-comp'/>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
}
export default Envios;