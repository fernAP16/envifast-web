import React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import AppRouter from "./routes/AppRouter/AppRouter";
import { CssBaseline } from '@mui/material';


function App() {
  return (
    <StyledEngineProvider injectFirst>   
        <CssBaseline/>
          <AppRouter onError={(error) => console.log(error)} />   
    </StyledEngineProvider>
  );
}

export default App;
