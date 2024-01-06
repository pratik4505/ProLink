import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/login";
import Jobs from "../pages/Jobs";
import Requests from "../pages/Requests";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import Message from "../pages/Message";
import Register from "../pages/Register";
import Home from "../pages/Home";
import { Suspense } from "react";
import FallbackLoading from "../Components/loader/FallbackLoading";

const AppRoutes = () => {
  return (
    <Suspense fallback={<FallbackLoading/>}>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="*" element={<h1>Not Found</h1>} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Home />} />
          <Route path="Register" element={<Register />} />
          <Route path="Jobs" element={<Jobs />} />
          <Route path="Requests" element={<Requests />} />
          <Route path="Profile/:ownerId" element={<Profile />} />
          <Route path="Notifications" element={<Notifications />} />
          <Route path="Message" element={<Message />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
