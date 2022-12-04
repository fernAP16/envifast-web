import React from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import './Envios.css'
import { getAeropuertos, getPackageRoute, getShipmentsByInput, registerDateTimes, registerFlights, registerShipment } from '../../services/envios/EnviosServices';

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
    const [dateRegister, setDateRegister] = React.useState('');
    const [daysRegister, setDaysRegister] = React.useState(0);
    const [isRegisteringFlights, setIsRegisteringFlights] = React.useState(false);
    const [flightsRegistered, setFlightsRegistered] = React.useState(false);
    const [packageFlights, setPackagesFlights] = React.useState([]);
    const [packageSelected, setPackageSelected] = React.useState({});
    const [isSelected, setIsSelected] = React.useState(false);
    const [isLoadingRoute, setIsLoadingRoute] = React.useState(false);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: "#AFD6D6",
          color: theme.palette.common.black,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
    
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

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
        setShipments([]);
        let variables = {
            input: input,
            paraSim: 0
        }
        getShipmentsByInput(variables)
        .then(function (response) {
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
                    estado: element.estado,
                    origen: element.origen,
                    destino: element.destino,
                    cantPaquetes: element.paquetes.length,
                    fechaEnvio: new Date(element.fechaEnvio).toLocaleDateString(),
                    tiempoTotal: element.tiempoTotal
                })
            };
            setShipments(arrayShipments);
            setIsLoadingInit(false);
        })
        .catch(function (error) {
            console.log(error);
            setIsLoadingInit(false);
        })
    }

    const handleRegisterDays = () => {
        setIsRegisteringFlights(false);
        setIsLoading(true);
        let variables = {
            date: dateRegister,
            days: daysRegister,
            paraSim: 0
        }
        registerFlights(variables)
        .then(function (response) {
            registerDateTimes(variables)
            .then(function (response) {
                setDaysRegister(0);
                setDateRegister('');
                setIsLoading(false);
                setFlightsRegistered(true);
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false);
            })
        })
        .catch(function (error) {
            console.log(error);
            setIsLoading(false);
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
        setIsLoadingRoute(true);
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

    const handleSeeRoute = (pack) => {
        setIsLoadingRoute(true);
        getPackageRoute(pack.id)
        .then(function (response) {
          var array = [];
          for (const element of response.data) {
            array.push({
              origen: element.ciudadOrigen,
              destino: element.ciudadDestino,
              horaSalida: element.horaSalida,
              horaLLegada: element.horaLLegada
            })        
          };
          setPackagesFlights(array);
          setPackageSelected({
            idPackage: pack.id,
          })
          setIsLoadingRoute(false);
        })
        .catch(function (error) {
            console.log(error);
        })
        setIsSelected(true);
    }

    const handleReturnToDetail = () => {
        setPackagesFlights([])
        setIsSelected(false);
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
        // Obtener paquetes con sus rutas
        setShipmentDetail(shipment);
        setIsDetail(true);
    }

    return (
        <div className='container-shipment'>
            <Grid className='container-shipment-title'>
                <Typography className='title-shipment'>Envíos</Typography>
                <Grid container className='search-actions'>
                    <Grid item xs={4}>
                        <TextField size='small' label='Buscar' fullWidth value={input} onChange={(e) => setInput(e.target.value)}></TextField>
                    </Grid>
                    <Grid item xs={4} className='group-buttons'>
                        <Button className='buttons-actions' onClick={getShipments}>Buscar</Button>
                        <Button className='buttons-actions' onClick={() => setIsRegisteringFlights(true)}>Cargar días</Button>
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
                                <TableCell className='table-shipment-header' align='center'>Estado del envío</TableCell>
                                <TableCell className='table-shipment-header'>Ciudad de origen</TableCell>
                                <TableCell className='table-shipment-header'>Ciudad de destino</TableCell>
                                <TableCell className='table-shipment-header' align='center'>N° de paquetes</TableCell>
                                <TableCell className='table-shipment-header' align='center'>Fecha de envío</TableCell>
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
                                        <Grid container justifyContent='center'>
                                            <Typography className='table-state' align='center'
                                                border={shipment.estado === 0 ? "1.5px solid #FFFA80" : shipment.estado === 1 ? "1.5px solid #FFA0A0" : "1.5px solid #B6FFD8"}
                                                backgroundColor={shipment.estado === 0 ? "#FFFA80" : shipment.estado === 1 ? "#FFA0A0" : "#B6FFD8"}
                                            >
                                                {shipment.estado === 0 ? "Por enviar" : shipment.estado === 1 ? "Enviándose" : "Enviado"}
                                            </Typography>
                                        </Grid>
                                    </TableCell>
                                    <TableCell>{shipment.origen.ciudad.nombre}</TableCell>
                                    <TableCell>{shipment.destino.ciudad.nombre}</TableCell>
                                    <TableCell align='center'>{shipment.cantPaquetes}</TableCell>
                                    <TableCell align='center'>{shipment.fechaEnvio}</TableCell>
                                    <TableCell align='center'><Button className='buttons-detail' onClick={() => handleVerDetalle(shipment)}>Ver detalle</Button></TableCell>
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
                open={isLoading }
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
                    <Button className='button-register' onClick={() => {setShipmentRegistered(false);eraseRegisterInfo();getShipments()}} autoFocus>Volver a envíos</Button>
                </DialogActions>
            </Dialog>
            {shipmentDetail &&
            <Dialog
                open={isDetail && !isSelected}
                >
                <DialogTitle>
                    {'Detalle del envío ' + shipmentDetail.codigo}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="register-dialog-description">
                        <Grid>
                            <Grid>
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
                            </Grid>
                            <Grid>
                                <Grid item xs={4}>
                                    <Typography className='register-label'>Listado de paquetes:</Typography>
                                </Grid>
                                <TableContainer component={Paper} className="table-packages-detail">
                                    <Table stickyHeader aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell className='table-flights-cell row-cell' align="center" width='10px'>N°</StyledTableCell>
                                            <StyledTableCell className='table-flights-cell row-cell' align="center">Paquete</StyledTableCell>
                                            <StyledTableCell className='table-flights-cell row-cell' align="center">Acciones</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody> 
                                        {shipmentDetail.paquetes && 
                                        shipmentDetail.paquetes.map((pack, index) => (
                                            <StyledTableRow key={pack.id}>
                                                <StyledTableCell className='table-flights-cell row-cell' align="center" width='10px'>{index+1}</StyledTableCell>
                                                <StyledTableCell className='table-flights-cell row-cell' align="center">{pack.id}</StyledTableCell>
                                                <StyledTableCell className='table-flights-cell row-cell' align="center">
                                                    <Button className='button-return' onClick={() => handleSeeRoute(pack)}>
                                                        <Typography className='text-plan'>Ver plan de vuelo</Typography>
                                                    </Button>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                        }
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='actions-confirm'>
                    <Button className='button-register' onClick={() => {setIsDetail(false);shipmentDetail(null)}} autoFocus>Volver</Button>
                </DialogActions>
            </Dialog>
            }
            {packageSelected && !isLoading &&
            <Dialog
                open={isSelected}
                maxWidth="1000px"
            >
                <DialogTitle>
                {"Paquete: " + packageSelected.idPackage}
                </DialogTitle>
                <DialogContent>
                    <Typography>{"Plan de vuelo del paquete: "}</Typography>
                    <TableContainer component={Paper} className="table-package">
                        <Table stickyHeader aria-label="customized table">
                        <TableHead>
                            <TableRow>
                            <StyledTableCell className='table-flights-cell row-cell' align="center">N°</StyledTableCell>
                            <StyledTableCell className='table-flights-cell row-cell' align="center">Ciudad de origen</StyledTableCell>
                            <StyledTableCell className='table-flights-cell row-cell' align="center">Ciudad de destino</StyledTableCell>
                            <StyledTableCell className='table-flights-cell row-cell' align="center">Salida</StyledTableCell>
                            <StyledTableCell className='table-flights-cell row-cell' align="center">Llegada</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody> 
                            {packageFlights && 
                            packageFlights.map((flight, index) => (
                                <StyledTableRow key={flight.name}>
                                <StyledTableCell className='table-flights-cell row-cell' align="center">{index+1}</StyledTableCell>
                                <StyledTableCell className='table-flights-cell row-cell' align="center">{flight.origen}</StyledTableCell>
                                <StyledTableCell className='table-flights-cell row-cell' align="center">{flight.destino}</StyledTableCell>
                                <StyledTableCell className='table-flights-cell row-cell' align="center">{flight.horaSalida.split('T')[0] + ', ' + flight.horaSalida.split('T')[1]}</StyledTableCell>
                                <StyledTableCell className='table-flights-cell row-cell' align="center">{flight.horaLLegada.split('T')[0] + ', ' + flight.horaLLegada.split('T')[1]}</StyledTableCell>                        
                                </StyledTableRow>
                            ))
                            }
                        </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                <Button className='button-return' onClick={handleReturnToDetail}>Volver</Button>
                </DialogActions>
            </Dialog>
            }

            <Dialog open={isLoadingInit || isLoadingRoute}>
                <DialogTitle>
                    Cargando...
                </DialogTitle>
                <DialogContent>
                    <Grid item container justifyContent='center'>
                        <CircularProgress className='loading-comp'/>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Dialog open={isRegisteringFlights}>
                <DialogTitle>
                    Cargar vuelos
                </DialogTitle>
                <DialogContent>
                    <Grid container alignItems='center' justifyContent='center'>
                        <Grid item xs={3}>Desde:</Grid>
                        <Grid item xs={6}><TextField type='date' size='small' value={dateRegister} fullWidth onChange={(e) => setDateRegister(e.target.value)}/></Grid>
                    </Grid>
                    <Grid container alignItems='center' justifyContent='center' marginTop='10px'>
                        <Grid item xs={3}>Para:</Grid>
                        <Grid item xs={3}><TextField type='number' size='small' value={daysRegister} fullWidth onChange={(e) => setDaysRegister(e.target.value)}/></Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={2}>días</Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button className='button-cancel' variant='outlined' onClick={() => {setIsRegisteringFlights(false); setDateRegister('')}}>Cancelar</Button>
                    <Button className='button-register' onClick={handleRegisterDays} autoFocus>Registrar</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                className='dialog-register'
                open={flightsRegistered}
            >
                <DialogContent className='content-confirm'>
                    <Typography className='register-label'>Los vuelos se registraron correctamente</Typography>
                </DialogContent>
                <DialogActions className='actions-confirm'>
                    <Button className='button-register' onClick={() => {setFlightsRegistered(false);getShipments()}} autoFocus>Volver a envíos</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default Envios;