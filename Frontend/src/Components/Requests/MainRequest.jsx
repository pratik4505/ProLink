import { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { memo } from "react";
import axios from "axios";
import RequestItem from "./RequestItem";
import FallbackLoading from "../loader/FallbackLoading";
import GlobalContext from "../../context/GlobalContext";
const baseUrl = import.meta.env.VITE_SERVER_URL;

const MainRequest = () => {
  const gloContext = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  

  // Function to handle accept/decline requests
  const handleRequest = useCallback(async (mkey, request, action) => {
    try {
      // Send post request to handleRequest endpoint
      await axios.post(
        `${baseUrl}/request/handleRequest`,
        {
          mkey,
          request,
          action,
        },
        {
          withCredentials: true, // Set this option to send credentials (cookies) with the request
        }
      );

      if (action === "accept") {
        gloContext.socket.emit("acceptRequest", {
          to: request.fromUser._id,
          requestType:
            request.type === "connect" ? "Connect Request" : "Message Request",
        });
      }

      // After a successful request, remove the key from requests
      gloContext.setRequests((prevRequests) => {
        const updatedRequests = { ...prevRequests };
        delete updatedRequests[mkey];
        return updatedRequests;
      });
    } catch (error) {
      console.error("Error handling request:", error);
    }
  }, []);

  // Fetch requests using the provided endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/request/getRequests/`, {
          withCredentials: true,
        });

        gloContext.setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized list of RequestItem components
  const RequestList = useMemo(
    () => (
      <div className="w-full">
        {Object.entries( gloContext.requests).map(([key, request]) => (
          <RequestItem
            key={key}
            mkey={key}
            request={request}
            handleRequest={handleRequest}
          />
        ))}
      </div>
    ),
    [ gloContext.requests,  gloContext.handleRequest]
  );

  // Loading state
  if (loading) {
    return <FallbackLoading />;
  }

  return (
    <div className="bg-gradient-to-br from-sky-blue-500 to-sky-blue-400 flex flex-col p-4">
      {/* Display the list of requests */}
      {RequestList}
    </div>
  );
};

export default memo(MainRequest);
