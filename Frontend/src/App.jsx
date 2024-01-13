import React from 'react'
import { GlobalProvider } from './context/GlobalProvider'
import { Helmet } from 'react-helmet'
import AppRoutes from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VideoCall from './Components/Message/VideoCall';
function App() {
    const location = useLocation();
  return (
    <GlobalProvider>
     
      <ToastContainer/>
        <Helmet>
        <title>{location.pathname}</title>
      </Helmet>
      <AppRoutes/>
      
    </GlobalProvider>
  )
}

export default App;