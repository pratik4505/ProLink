import React from 'react'
import { GlobalProvider } from './context/GlobalProvider'
import { Helmet } from 'react-helmet'
import { router } from "./routes/index";
import { RouterProvider, useLocation } from "react-router-dom";
function App() {
    
  return (
    <GlobalProvider>
        {/* <Helmet>
        <title>{location.pathname}</title>
      </Helmet> */}
      <RouterProvider router={router} />
    </GlobalProvider>
  )
}

export default App