import { useContext, useState, useEffect, useCallback, useRef } from "react";
import GlobalContext from "../../context/GlobalContext";
import { memo } from "react";
import { Transition } from "@headlessui/react";
import { FaPhoneSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoMdCall, IoMdClose } from "react-icons/io";

import global from "global";
import * as process from "process";
global.process = process;

function VideoCall() {
  const gloContext = useContext(GlobalContext);
  const myVideo = useRef();
  const userVideo = useRef();

  const [userData, setUserData] = useState(null);
  const [mediaCall, setMediaCall] = useState(null);
  const [videoDiaglog, setVideoDiaglog] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [fromCallData, setFromCallData] = useState(null);
  const videoDiaglogRef = useRef();
  const handleAcceptCall = (data) => {
    //console.log(temp, gloContext.peer);
    gloContext.socket.emit("answerCall", {
      isAccepted: true,
      to: data.userData._id,
    });
    setVideoDiaglog(true);
    setFromCallData(data);
    toast.dismiss();
  };

  const handleDeclineCall = (data) => {
    gloContext.socket.emit("answerCall", {
      isAccepted: false,
      to: data.userData._id,
    });
    toast.dismiss();
  };

  const callHandler = async (call) => {
    setMediaCall(call);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    myVideo.current.srcObject = stream;

    call.answer(stream);
    call.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });

    //call.close();
    //   call.on("close",()=>{

    //   });

    call.on("error", (err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    const incomingHandler = (data) => {
      toast(
        <div className="incoming-call-notification">
          <img
            src={data.userData.imageUrl}
            alt={data.userData.userName}
            className="caller-image"
          />
          <div className="caller-details">
            <strong>{data.userData.userName}</strong> is calling you.
          </div>
          <div className="action-buttons">
            <IoMdCall
              className="action-icon receive-icon m-3"
              onClick={() => handleAcceptCall(data)}
            />
            <IoMdClose
              className="action-icon decline-icon m-3"
              onClick={() => handleDeclineCall(data)}
            />
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 60000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    };
    gloContext.socket.on("incomingCall", incomingHandler);

    // Cleanup function to stop the media stream when the component unmounts or dependencies change

    return () => {
      gloContext.socket.off("incomingCall", incomingHandler);
    };
  }, [gloContext]);

  useEffect(() => {
    if (gloContext.toCallData) {
      setUserData(gloContext.toCallData);

      setVideoDiaglog(true);
      callUser(gloContext.toCallData._id);
    }
  }, [gloContext.toCallData]);

  useEffect(() => {
    if (fromCallData) {
      setUserData({ ...fromCallData.userData });
      setVideoDiaglog(true);

      answerCall();
    }
  }, [fromCallData]);

  const callUser = async (id) => {
    gloContext.socket.emit("callUser", {
      userToCall: id,
      userData: gloContext.userData,
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    myVideo.current.srcObject = stream;

    gloContext.socket.on("isCallAccepted", (data) => {
      if (data.isAccepted === true) {
        setConnecting(false);
        const call = gloContext.peer.call(id, stream);
        setMediaCall(call);
        call.on("stream", (remoteStream) => {
          userVideo.current.srcObject = remoteStream;
        });
      }
    });
  };

  const answerCall = () => {
    setConnecting(false);
    console.log(myVideo, userVideo);
    gloContext.peer.on("call", callHandler);
  };

  const endCall = () => {
    if (mediaCall) {
      mediaCall.close();
      setMediaCall(null);
    }

    if (myVideo.current) {
      const stream = myVideo.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
    if (userVideo.current) {
      const stream = userVideo.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
    gloContext.peer.off("call", callHandler);

    gloContext.setToCallData(null);
    setFromCallData(null);
    setUserData(null);
    setVideoDiaglog(false);
  };

  return (
    <>
      <Transition
        show={videoDiaglog}
        enter="transition ease-out duration-300 transform origin-bottom-left"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-200 transform origin-bottom-left"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-50"
      >
        {() => (
          <div ref={videoDiaglogRef} className="border-black border-2 absolute right-1/4 top-14 z-50 w-[90vw] h-[90vh] sm:w-[70vw] sm:h-[80vh] bg-opacity-80 backdrop-blur-md px-2 py-3 bg-white flex flex-col items-end">
          <div className="border-black border-2 w-full h-[98%] relative">
           
            <video playsInline ref={userVideo} autoPlay className=" w-full h-full object-cover" />
            
            <video playsInline muted ref={myVideo} autoPlay className=" absolute bottom-2 right-2 h-[10%] md:h-[30%]" />
            
          </div>
        
          <button className="text-red-500 cursor-pointer  mx-auto" onClick={endCall}>
            <FaPhoneSlash size={30} />
          </button>
        
          
        </div>
        )}
      </Transition>
    </>
  );
}

export default memo(VideoCall);
