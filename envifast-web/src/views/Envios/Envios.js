import React from 'react';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import './Envios.css'

const Envios  = (props) => {  

    
    
    function createData(id, emisor, destinatario, estado, origen, destino, cantPaquetes, fechaEnvio) {
        return { id, emisor, destinatario, estado, origen, destino, cantPaquetes, fechaEnvio};
    }
      
    const rows = [
        createData(1, 'Esther Campos Bolivar', 'Salvador Banda', 2, 'Lima', 'Montevideo', 1, new Date().toLocaleDateString()),
        createData(2, 'Emilio Coyama', 'Josep Tirado', 0, 'Brasilia', 'Praga', 2, new Date().toLocaleDateString()),
        createData(3, 'Francisco Bolognesi', 'Iván Solano', 0, 'La Paz', 'Buenos Aires', 1, new Date().toLocaleDateString()),
        createData(4, 'Rony Cave', 'Ángel Pantoja', 2, 'Santiago de Chile', 'Lima', 1, new Date().toLocaleDateString()),
        createData(5, 'Judith de la Cruz Lazo', 'Jordi Gastélum', 1, 'Bogota', 'Brasilia', 5, new Date().toLocaleDateString()),
        createData(6, 'Esther Campos Bolivar', 'Salvador Banda', 2, 'Lima', 'Montevideo', 1, new Date().toLocaleDateString()),
        createData(7, 'Emilio Coyama', 'Josep Tirado', 0, 'Brasilia', 'Praga', 2, new Date().toLocaleDateString()),
        createData(8, 'Francisco Bolognesi', 'Iván Solano', 0, 'La Paz', 'Buenos Aires', 1, new Date().toLocaleDateString()),
        createData(9, 'Rony Cave', 'Ángel Pantoja', 2, 'Santiago de Chile', 'Lima', 1, new Date().toLocaleDateString()),
        createData(10, 'Judith de la Cruz Lazo', 'Jordi Gastélum', 1, 'Bogota', 'Brasilia', 5, new Date().toLocaleDateString()),
        createData(11, 'Esther Campos Bolivar', 'Salvador Banda', 2, 'Lima', 'Montevideo', 1, new Date().toLocaleDateString()),
        createData(12, 'Emilio Coyama', 'Josep Tirado', 0, 'Brasilia', 'Praga', 2, new Date().toLocaleDateString()),
        createData(13, 'Francisco Bolognesi', 'Iván Solano', 0, 'La Paz', 'Buenos Aires', 1, new Date().toLocaleDateString()),
        createData(14, 'Rony Cave', 'Ángel Pantoja', 2, 'Santiago de Chile', 'Lima', 1, new Date().toLocaleDateString()),
        createData(15, 'Judith de la Cruz Lazo', 'Jordi Gastélum', 1, 'Bogota', 'Brasilia', 5, new Date().toLocaleDateString())
    ];

    /*
    <TableCell >{row.origen}</TableCell>
    <TableCell >{row.destino}</TableCell>
    <TableCell >{row.cantPaquetes}</TableCell>
    <TableCell >{row.fechaEnvio}</TableCell>
    */

    return (
        <div>
            <Grid className='container-shipment'>
                <Typography className='title-shipment'>Envíos</Typography>
                <Grid container className='search-actions'>
                    <Grid item xs={4}>
                        <TextField fullWidth label='Buscar'></TextField>
                    </Grid>
                    <Grid item xs={4} className='group-buttons'>
                        <Button className='buttons-actions'>Buscar</Button>
                        <Button className='buttons-actions'>Subir envíos</Button>
                        <Button className='buttons-actions'>Registrar envíos</Button>
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
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{row.id}</TableCell>
                                    <TableCell>{row.emisor}</TableCell>
                                    <TableCell>{row.destinatario}</TableCell>
                                    <TableCell align='center'>
                                        <Grid justifyContent='center'>
                                            <Typography className='table-state'
                                                border={row.estado === 0 ? "1.5px solid #FFFA80" : row.estado === 1 ? "1.5px solid #FFA0A0" : "1.5px solid #B6FFD8"}
                                                backgroundColor={row.estado === 0 ? "#FFFA80" : row.estado === 1 ? "#FFA0A0" : "#B6FFD8"}
                                            >
                                                {row.estado === 0 ? "Por enviar" : row.estado === 1 ? "Enviándose" : "Enviado"}
                                            </Typography>  
                                        </Grid> 
                                    </TableCell>
                                    <TableCell>{row.origen}</TableCell>
                                    <TableCell>{row.destino}</TableCell>
                                    <TableCell align='center'>{row.cantPaquetes}</TableCell>
                                    <TableCell align='center'>{row.fechaEnvio}</TableCell>
                                    <TableCell align='center'><Button className='buttons-actions'>Ver detalle</Button></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    
    );
}
export default Envios;