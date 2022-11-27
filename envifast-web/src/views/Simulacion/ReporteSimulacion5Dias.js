import { Dialog, DialogContent, DialogTitle, Grid, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { getCoordenadasAeropuertos } from '../../services/envios/EnviosServices';
import './Simulacion5Dias.css';

const ReporteSimulacion5Dias = () => {
  const {state} = useLocation();
  const { lastDate, from, to, type } = state;
  const [idPlanSelected, setIdPlanSelected] = React.useState(0);
  const [isSelected, setIsSelected] = React.useState(false);
  const [packageFlights, setPackageFlights] = React.useState([]);
  const [airportsCoordinates, setAirportsCoordinates] = React.useState([])

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
    getCoordenadasAeropuertos()
    .then(function (response) {
      var arrayAirports = [];
      for (const element of response.data) {
        arrayAirports.push({
          id: element.id,
          cityName: element.cityName,
          lat: element.x_pos,
          lng: element.y_pos
        })
      };
      setAirportsCoordinates(arrayAirports);
    })
    .catch(function (error) {
        console.log(error);
    })
  },[])
  
  return (
    <div className='container-report'>
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
                <TextField size='small' disabled={true} value={1342}></TextField>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <TableContainer component={Paper} className="table-package-flight">
            <Table stickyHeader aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell className='table-flights-cell row-cell' align="center">Id Paquete</StyledTableCell>
                  <StyledTableCell className='table-flights-cell row-cell' align="center">Id Envio</StyledTableCell>
                  <StyledTableCell className='table-flights-cell row-cell' align="center">Hora de Registro</StyledTableCell>
                  <StyledTableCell className='table-flights-cell row-cell' align="center">Plan de Vuelo</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody> 
                {packageFlights && 
                  packageFlights.map((flight, index) => (
                    <StyledTableRow key={flight.name}>
                      <StyledTableCell className='table-flights-cell row-cell' align="center">{index+1}</StyledTableCell>
                      <StyledTableCell className='table-flights-cell row-cell' align="center">{airportsCoordinates[flight.idAeropuertoOrigen-1].cityName}</StyledTableCell>
                      <StyledTableCell className='table-flights-cell row-cell' align="center">{airportsCoordinates[flight.idAeropuertoDestino-1].cityName}</StyledTableCell>
                      <StyledTableCell className='table-flights-cell row-cell' align="center">{flight.horaSalida}</StyledTableCell>                      
                    </StyledTableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
      </Grid>

      {/* Para el pop up */}
      <Dialog
        open={isSelected}
      >
        <DialogTitle>
          {"Plan de vuelo " + idPlanSelected}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1} alignItems='center' marginBottom='10px'>
            <Grid item xs={3}>
              <Typography>Código del paquete:  </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField size='small' disabled={true} value={"ECEJOCS1567848"}></TextField>
            </Grid>
            <Grid item xs={3}>
              <Typography>Fecha de llegada: </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField size='small' disabled={true} value={"28/11/2022"}></TextField>
            </Grid>
          </Grid>
          <TableContainer component={Paper} className="table-package-flight">
            <Table stickyHeader aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell className='table-flights-cell row-cell' align="center">N°</StyledTableCell>
                  <StyledTableCell className='table-flights-cell row-cell' align="center">Ciudad de origen</StyledTableCell>
                  <StyledTableCell className='table-flights-cell row-cell' align="center">Ciudad de destino</StyledTableCell>
                  <StyledTableCell className='table-flights-cell row-cell' align="center">Hora de salida</StyledTableCell>
                  <StyledTableCell className='table-flights-cell row-cell' align="center">Hora de llegada</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody> 
                {packageFlights && 
                  packageFlights.map((flight, index) => (
                    <StyledTableRow key={flight.name}>
                      <StyledTableCell className='table-flights-cell row-cell' align="center">{index+1}</StyledTableCell>
                      <StyledTableCell className='table-flights-cell row-cell' align="center">{airportsCoordinates[flight.idAeropuertoOrigen-1].cityName}</StyledTableCell>
                      <StyledTableCell className='table-flights-cell row-cell' align="center">{airportsCoordinates[flight.idAeropuertoDestino-1].cityName}</StyledTableCell>
                      <StyledTableCell className='table-flights-cell row-cell' align="center">{flight.horaSalida}</StyledTableCell>
                      <StyledTableCell className='table-flights-cell row-cell' align="center">{flight.horaLlegada}</StyledTableCell>                        
                    </StyledTableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
    
  )
}

export default ReporteSimulacion5Dias