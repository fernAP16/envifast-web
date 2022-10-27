import { CssBaseline, Drawer, Toolbar, Typography } from "@mui/material";
import React from "react";
import MenuLateral from "../../components/menu/MenuLateral";
import AppBar from '@mui/material/AppBar';
import Auxiliar from "../auxiliar/Auxiliar";
import Box from "@mui/material/Box";
import './Layout.css';

const Layout = (props) => {

    const {window, title} = props;
    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <Auxiliar>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline/>|
                <AppBar
                    position="fixed"
                    sx={{
                    width: { sm: `calc(100% - 100px)` },
                    ml: { sm: `100px` },
                    }}
                >
                    <Toolbar className="toolbar-main">
                        <Typography>
                            Usuario
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className="layoutDrawer"
                    variant="permanent" 
                    open
                >
                    <MenuLateral/>
                </Drawer>
                <Box
                    component="main"
                    style={{marginLeft:"215px", marginTop:"0px"}}
                >
                    <Toolbar />
                    {props.children}
                </Box>
            </Box>
        </Auxiliar>
    )
}

export default Layout;