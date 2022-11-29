import React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import AppRouter from "./routes/AppRouter/AppRouter";
import { CssBaseline } from '@mui/material';
import { getPlanifiedOrdersd2d } from './services/envios/EnviosServices';


function App() {

  React.useEffect(() => {
    const interval = setInterval(() => {
      getPlanifiedOrdersd2d()
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      })
    }, 600000);
    return () => {
      clearInterval(interval);
    };
  }, [])
  
  return (
    <StyledEngineProvider injectFirst>   
        <CssBaseline/>
          <AppRouter onError={(error) => console.log(error)} />   
    </StyledEngineProvider>
  );
}

export default App;
