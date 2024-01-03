import { createBrowserRouter, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import Login from "../pages/login";
import Jobs from "../pages/Jobs";
import Requests from "../pages/Requests";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import Message from "../pages/Message";
import Register from "../pages/Register";
import Home from "../pages/Home";
import GlobalContext from "../context/GlobalContext";

const ProtectedRoute = ({ element, allowUnauthenticated, path }) => {
  const gloContext = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gloContext.isLoggedIn && !allowUnauthenticated) {
      navigate('/Login');
    }
  }, [gloContext.isLoggedIn, allowUnauthenticated]);

  return gloContext.isLoggedIn || allowUnauthenticated ? element : null;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<Home />} />,
  },
  {
    path: "/Register",
    element: <ProtectedRoute element={<Register />} allowUnauthenticated />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Jobs",
    element: <ProtectedRoute element={<Jobs />} />,
  },
  {
    path: "/Requests",
    element: <ProtectedRoute element={<Requests />} />,
  },
  {
    path: "/Profile/:ownerId",
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: "/Notifications",
    element: <ProtectedRoute element={<Notifications />} />,
  },
  {
    path: "/Message",
    element: <ProtectedRoute element={<Message />} />,
  },
  {
    path: "*", // This is a catch-all route for 404 errors
    element: <h1>Not Found</h1>,
  },
]);
