import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react'


export default function Popup(props){
    const {tittle, children , openPopUp, setOpenPopUp} = props;
    return(
        <div>
            <Dialog open = {openPopUp}>
                <DialogTitle>
                    Este es el plan de vuelo
                </DialogTitle>

                <DialogContent>
                    El vuelo pasa por los siguientes paises
                </DialogContent>
            </Dialog>
        </div>
    )
}