import { useEffect, useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { Navigate, Outlet } from "react-router-dom";

import Leftbar from "../Components/Shared/Leftbar";
import Navbar from "../Components/Shared/Navbar";
const ProtectedRoute = () => {
  const gloContext = useContext(GlobalContext);

  return gloContext.isLoggedIn ? (
    <div className="scroll-smooth">
      <Navbar />

      <div className="w-full flex px-[2%]">
        <Leftbar />
        <div className=" w-4/5 ml-[20%] px-[2%]">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/Login" />
  );
};

export default ProtectedRoute;
