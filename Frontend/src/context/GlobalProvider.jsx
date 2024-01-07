import { useEffect, useState,useCallback } from "react";
import GlobalContext from "./GlobalContext";
import io from "socket.io-client";
import { Cookies } from "react-cookie";
const baseUrl = import.meta.env.VITE_BASE_URL;


export function GlobalProvider(props) {
  const [socket, setSocket] = useState(
    io("ws://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
    })
  );
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cookies = new Cookies();

  const setMessageStatus = (value) => {
    setIsMessageOpen(value);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    initialLoad();
    return () => {
      socket.disconnect();
    };
  }, []);

  const initialLoad = useCallback(async () => {
    const userId = cookies.get("userId");
    const token = cookies.get("token");

    if (token && userId) {
      try {
        const response = await fetch(`${baseUrl}/isAuth`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
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
    }
    else{
      setIsLoggedIn(false); 
    }
  },[]);

  const listen = () => {
    socket.on("newNotification", (data) => {
      if (data.type === "connectRequest") {
        // PushNotification.create({
        //   title: "Connection Request",
        //   message: `${data.userName} wants to connect with you`,
        //   theme: 'darkblue',
        //   native: true,
        //   duration: 5000,
        // });
      } else if (data.type === "messageRequest") {
        // PushNotification.create({
        //   title: "Message Request",
        //   message: `${data.userName} wants to message you`,
        //   theme: 'darkblue',
        //   native: true,
        //   duration: 5000,
        // });
      } else if (data.type === "jobAlert") {
        //jobalert notify
      } else {
        // PushNotification.create({
        //   title: data.title,
        //   message: data.description,
        //   theme: 'darkblue',
        //   native: true,
        //   duration: 5000,
        // });
      }
    });

    socket.on("clientJoinChat", (data) => {
      socket.emit("joinChat", data);
    });

    socket.on("receiveMessage", (data) => {
      if (!isMessageOpen) {
        //notify
      }
    });
  };

  const context = {
    socket: socket,
    listen: listen,
    initialLoad,
    isMessageOpen,
    setMessageStatus,
    isLoggedIn,
  };

  return (
    <GlobalContext.Provider value={context}>
      {props.children}
    </GlobalContext.Provider>
  );
}
