import React, { useState, useEffect, useContext } from "react";
const baseUrl = import.meta.env.VITE_SERVER_URL;
import { FaRegUser } from "react-icons/fa";
import GlobalContext from "../../context/GlobalContext";

export default function ChatList(props) {
  const [unreadMsg, setUnreadMsg] = useState(undefined);
  const gloContext = useContext(GlobalContext);

  gloContext.socket.on("receiveMessage", (data) => {
    if (
      props.currChat &&
      props.currChat.chatId !== props.chat.chatId &&
      data.senderId === props.chat.otherMemberId
    ) {
      setUnreadMsg(data.message);
    }
  });
  const handleImageError = (event) => {
    // Handle image loading error here
    event.target.style.display = 'none'; // Hide the image on error
  };

  return (
    <div
      onClick={() => {
        props.onChatClick(props.chat);
      }}
      className="flex p-3 shadow-sm "
    >
      {props.chat.otherMemberImageUrl && (
        <img
          src={`${baseUrl}/${props.chat.otherMemberImageUrl}`}
          alt="Profile"
          className="w-12 h-12 rounded-full mr-2"
          onError={handleImageError}
        />
      )}
      {!props.chat.otherMemberImageUrl && (
        <FaRegUser  className="h-full w-[10%] mr-2" />
      )}
      <p>
        <b>{props.chat.otherMemberName}</b>
      </p>
      {unreadMsg && props.currChat.chatId !== props.chat.chatId && (
        <p className="text-green-500">{unreadMsg}</p>
      )}
     
    </div>
  );
}
