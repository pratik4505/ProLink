import React from 'react'
import { GlobalProvider } from './context/GlobalProvider'
import { Helmet } from 'react-helmet'
import AppRoutes from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";
function App() {
    const location = useLocation();
  return (
    <GlobalProvider>
        <Helmet>
        <title>{location.pathname}</title>
      </Helmet>
      <AppRoutes/>
    </GlobalProvider>
  )
}

export default App;