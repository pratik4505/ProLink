import { useEffect, useState, useCallback } from "react";
import GlobalContext from "./GlobalContext";
import io from "socket.io-client";

import FallbackLoading from "../Components/loader/FallbackLoading";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {API} from "../utils/api";
import Peer from "peerjs";
const baseUrl = import.meta.env.VITE_SERVER_URL;

export function GlobalProvider(props) {
  const [socket, setSocket] = useState(
    io(baseUrl.replace("http", "ws"), {
      transports: ["websocket"],
      upgrade: false,
      withCredentials: true,
      pingInterval: 1000 * 60,
      pingTimeout: 1000 * 60 * 3,
    })
  );
  const [userData, setUserData] = useState(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [requests, setRequests] = useState({});
  const [feedsData, setFeedsData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [toCallData, setToCallData] = useState(null);

  const [peer, setPeer] = useState(null);


  useEffect(() => {
    if (userData) {
      const tempPeer = new Peer(userData._id);

      setPeer(tempPeer);
      tempPeer.on("open", (id) => {
        console.log("Peer connected", id);
      });
    }
  }, [userData]);

  const setMessageStatus = (value) => {
    setIsMessageOpen(value);
  };

  useEffect(() => {
    // Function to send a ping to the server
    setGlobalLoading(true);
    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    window.addEventListener('beforeunload', ()=>{setGlobalLoading(true)});

    initialLoad();
    setGlobalLoading(false);

    return () => {
      // Disconnect the socket
      socket.disconnect();
      if(peer){
        peer.destroy();
      }
      window.removeEventListener('beforeunload', ()=>{setGlobalLoading(true)});
    };
  }, []);

  const initialLoad = useCallback(async () => {
    const data=JSON.parse(localStorage.getItem('userData'));
    if(data){
      const userId = data.userId;
      const token = data.token;
     
      if (token && userId) {
        try {
          const response = await API.get(`/isAuth`);
  
          if (response.status === 200) {
           
  
            setUserData({ ...response.data.userData });
            setIsLoggedIn(true);
            socket.emit("setup", userId);
            listen();
          } else {
            setIsLoggedIn(false);
            console.log("user Not autorized");
          }
        } catch (error) {
          setIsLoggedIn(false);
          console.error("An error occurred while authorizing:", error);
        }
      } else {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
   
  }, []);

  const listen = () => {
    socket.on("newNotification", (data) => {
      if (data.type === "newRequest") {
        setNotifications((prev) => [data, ...prev]);
        toast(
          <div>
            <Link to="/Requests" className="text-blue-500 ">
              <p>
                <strong>{data.title}</strong>
              </p>
              <p>{data.description}</p>
            </Link>
          </div>,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else if (data.type === "endorsement") {
        setNotifications((prev) => [data, ...prev]);
        toast(
          <div>
            <Link
              to={`/Profile/${JSON.parse(localStorage.getItem('userData'))?.userId}`}
              className="text-blue-500 "
            >
              <p>
                <strong>{data.title}</strong>
              </p>
              <p>{data.description}</p>
            </Link>
          </div>,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else if (data.type === "acceptRequest") {
        setNotifications((prev) => [data, ...prev]);
        toast(
          <div>
            <Link to={`/Profile/${data.byId}`} className="text-blue-500 ">
              <p>
                <strong>{data.title}</strong>
              </p>
              <p>{data.description}</p>
            </Link>
          </div>,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    });

    socket.on("clientJoinChat", (data) => {
      socket.emit("joinChat", data);
    });

   
  };

  const context = {
    socket: socket,
    listen: listen,
    initialLoad,
    isMessageOpen,
    setMessageStatus,
    isLoggedIn,
    notifications,
    setNotifications,
    userData,
    requests,
    setRequests,
    feedsData,
    setFeedsData,
    globalLoading,
    toCallData,
    setToCallData,
    tempData,
    setTempData,
    peer,
  };

  if (globalLoading) {
    return <FallbackLoading />;
  }

  return (
    <GlobalContext.Provider value={context}>
      {props.children}
    </GlobalContext.Provider>
  );
}
