import { CssBaseline, Drawer, Toolbar, Typography } from "@mui/material";
import React from "react";
import MenuLateral from "../../components/menu/MenuLateral";
import Auxiliar from "../auxiliar/Auxiliar";
import Box from "@mui/material/Box";
import './Layout.css';

const Layout = (props) => {

    const {window, title} = props;
    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <Auxiliar>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline/>
                <Toolbar className="toolbar-main">
                    <Typography>
                        Envifast
                    </Typography>
                </Toolbar>
                <Drawer 
                    variant="permanent" 
                    sx={{display: 'block'}}
                    open>
                    <MenuLateral/>
                </Drawer>
                <Box
                    component="main"
                    style={{marginLeft:"60px"}}
                >
                    <Toolbar />
                    {props.children}
                </Box>
            </Box>
        </Auxiliar>
    )
}

export default Layout;