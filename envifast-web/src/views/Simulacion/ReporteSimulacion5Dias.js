import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { getCoordenadasAeropuertos, getPackageRoute, getPlanifiedOrders, getTotalPackages } from '../../services/envios/EnviosServices';
import './Simulacion5Dias.css';

const ReporteSimulacion5Dias = () => {
  const {state} = useLocation();
  const { firstDate, lastDate, from, to, type } = state;
  const [idPlanSelected, setIdPlanSelected] = React.useState(0);
  const [isSelected, setIsSelected] = React.useState(false);
  const [packages, setPackages] = React.useState(null);
  const [packageSelected, setPackageSelected] = React.useState({});
  const [packageFlights, setPackagesFlights] = React.useState([])
  const [airportsCoordinates, setAirportsCoordinates] = React.useState([]);
  const [isGeneratingReport, setIsGeneratingReport] = React.useState(true);
  const [isLoadingRoute, setIsLoadingRoute] = React.useState(false);
  const [totalPackages, setTotalPackages] = React.useState(null);

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
    let variables = {
      date: lastDate.toISOString().split('T')[0],
      timeInf: from,
      timeSup: to,
      paraSim: 1,
      indicador: (type === 1 ? 0 : 1)
    }
    getPlanifiedOrders(variables)
    .then(function (response) {
      var array = [];
      for (const element of response.data) {
        array.push({
          idPackage: element.codPaquete,
          idShipment: element.codEnvio,
          timeRegistering: element.fecha.split('T')[1]
        })
      };
      setPackages(array);
      getTotalPackages(variables)
      .then(function (response){
        setTotalPackages(response.data);
        setIsGeneratingReport(false);
      })
      .catch(function (error) {
        console.log(error);
      })
      
    })
    .catch(function (error) {
        console.log(error);
    })
  },[])

  const handleDetail= (pack) => {
    // packageFlights
    setIsLoadingRoute(true);
    getPackageRoute(pack.idPackage)
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
        idPackage: pack.idPackage,
        idShipment: pack.idShipment,
        timeRegistering: pack.timeRegistering
      })
      setIsLoadingRoute(false);
    })
    .catch(function (error) {
        console.log(error);
    })
    setIsSelected(true);
  }
  
  const handleReturn = () => {
    setPackagesFlights([])
    setIsSelected(false);
  }

  return (
    
    <div className='container-report'>
      {!isGeneratingReport &&
        <Grid className='container-report-header'>
          <Typography className='container-report-title'>{"Reporte " + (type === 1 ? "Simulación 5 días" : "Colapso logístico")}</Typography>
          <Typography className='container-report-info'>Datos obtenidos </Typography>
          <div className='container-report-grid'>
            <Grid container alignItems='center'>
              <Grid item xs={3}>
                <Typography>Fecha de último registro: </Typography>
              </Grid>
              <Grid item xs={3}>
                <TextField type='date'size='small' disabled={true} value={lastDate.toISOString().split('T')[0]}></TextField>
              </Grid>
              <Grid item xs={1}>
                <Typography>Desde: </Typography>
              </Grid>
              <Grid item xs={2}>
                <TextField type='time' size='small' value={from} disabled={true}></TextField>
              </Grid>
              <Grid item xs={1}>
                <Typography>Hasta: </Typography>
              </Grid>
              <Grid item xs={2}>
                <TextField type='time' size='small' value={to} disabled={true}></TextField>
              </Grid>
            </Grid>
            <Grid container marginTop='15px'>
              <Grid container alignItems='center'>
                <Grid item xs={4}>
                  <Typography className='container-report-label'>Cantidad de paquetes planificados: </Typography>
                </Grid>
                <Grid item xs={1}>
                  <TextField size='small' disabled={true} value={totalPackages ? totalPackages : '-'}></TextField>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <TableContainer component={Paper} className="table-package-flight-large">
              <Table stickyHeader aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell className='table-flights-cell row-cell' align="center">Id Paquete</StyledTableCell>
                    <StyledTableCell className='table-flights-cell row-cell' align="center">Id Envio</StyledTableCell>
                    <StyledTableCell className='table-flights-cell row-cell' align="center">Hora de Registro</StyledTableCell>
                    <StyledTableCell className='table-flights-cell row-cell' align="center">Acciones</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody> 
                  {packages && 
                    packages.map((pack) => (
                      <StyledTableRow>
                        <StyledTableCell className='table-flights-cell row-cell' align="center">{pack.idPackage}</StyledTableCell>
                        <StyledTableCell className='table-flights-cell row-cell' align="center">{pack.idShipment}</StyledTableCell>
                        <StyledTableCell className='table-flights-cell row-cell' align="center">{pack.timeRegistering}</StyledTableCell>
                        <StyledTableCell className='table-flights-cell row-cell' align="center">
                          <Button className='button-return' onClick={() => handleDetail(pack)}>Ver plan de vuelo</Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
        </Grid>
      }
      {packageSelected && !isLoadingRoute &&
      <Dialog
        open={isSelected}
        maxWidth="1000px"
      >
        <DialogTitle>
          {"Paquete " + packageSelected.idPackage}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1} alignItems='center' marginBottom='10px'>
            <Grid item xs={1.5}>
              <Typography>{"Plan de vuelo: "}</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField size='small' disabled={true} value={packageSelected.idShipment}></TextField>
            </Grid>
            <Grid item xs={1.8}>
              <Typography>Hora de registro: </Typography>
            </Grid>
            <Grid item xs={1.3}>
              <TextField size='small' disabled={true} value={packageSelected.timeRegistering}></TextField>
            </Grid>
          </Grid>
          <TableContainer component={Paper} className="table-package-flight">
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
          <Button className='button-return' onClick={handleReturn}>Volver</Button>
        </DialogActions>
      </Dialog>
    }
    <Dialog open={isGeneratingReport || isLoadingRoute}>
      <DialogTitle>
        {isGeneratingReport ? "Generando reporte..." : "Cargando ruta..."}
      </DialogTitle>
      <DialogContent>
        <Grid item container justifyContent='center'>
          <CircularProgress className='loading-comp'/>
        </Grid>
      </DialogContent>
    </Dialog>
    </div>
    
  )
}

export default ReporteSimulacion5Dias