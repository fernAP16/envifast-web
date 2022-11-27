import { Dialog, DialogContent, DialogTitle, Grid, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { getCoordenadasAeropuertos } from '../../services/envios/EnviosServices';
import './Simulacion5Dias.css';

const ReporteSimulacion5Dias = () => {
  const {state} = useLocation();
  // const { lastDate, from } = state;
  const [idPlanSelected, setIdPlanSelected] = React.useState(0);
  const [isSelected, setIsSelected] = React.useState(true);
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
    <div>
      Reporte Simulación 5 días
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