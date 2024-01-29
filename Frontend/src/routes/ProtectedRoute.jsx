import { useEffect, useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { Navigate, Outlet } from "react-router-dom";

import Leftbar from "../Components/Shared/Leftbar";
import Navbar from "../Components/Shared/Navbar";
const ProtectedRoute = () => {
  const gloContext = useContext(GlobalContext);

  return gloContext.isLoggedIn ? (
    <div className="scroll-smooth w-full h-full">
      <Navbar />

      <div className="w-full md:flex md:px-[2%]">
        <Leftbar />
        <div className=" w-full md:w-4/5 md:ml-[22%] ">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/Login" />
  );
};

export default ProtectedRoute;
