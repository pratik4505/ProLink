import React, { useEffect, useState, useContext } from "react";
import ChatList from "./ChatList";
import MessageContainer from "./MessageContainer";
import AddChatPopup from "./AddChatPopup";
import GlobalContext from "../../context/GlobalContext";
import { IoMdAddCircleOutline } from "react-icons/io";


const baseUrl = import.meta.env.VITE_BASE_URL;
export default function MainMessage() {
  const gloContext = useContext(GlobalContext);
  const [chats, setChats] = useState([]);
  const [currChat, setCurrChat] = useState(null);
  const [popup, setPopup] = useState(false);

  const loadChats = async () => {
    try {
      const response = await fetch(`${baseUrl}/message/getChats`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data); // Update the state with the received chat data
      } else {
        console.error("Failed to fetch chats");
      }
    } catch (error) {
      console.error("An error occurred while fetching chats:", error);
    }
  };

  const currChatHandler = (data) => {
    setCurrChat(data);
  };

  const chatAdder = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/message/createChat/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        gloContext.socket.emit("joinChat", {
          chatId: data.chatId,
          otherId: data.otherMemberId,
          userData: gloContext.userData,
        });
        setChats((prevChats) => [data, ...prevChats]); // Put the new chat data in front of the chats array
      } else {
        console.error("Failed to add chat");
      }
    } catch (error) {
      console.error("An error occurred while adding chat:", error);
    }
  };

  useEffect(() => {
    gloContext.setMessageStatus(true);
    loadChats();

    return () => {
      gloContext.setMessageStatus(false);
    };
  }, []);

  return (
    <div className=" flex  w-full h-[90vh] ">
      {popup && (
        <AddChatPopup
          chatAdder={chatAdder}
          onCancel={() => {
            setPopup(false);
          }}
          chats={chats}
        />
      )}

      <div
        className={`w-full shadow-2xl relative md:w-[35%]  h-full ${
          currChat ? "hidden" : "block"
        } md:block bg-white`}
      >
        <div className=" bg-primary-300 flex items-center h-[10%] justify-between px-[2%] ">
          <h1 className="text-3xl ml-2 font-bold text-[#ffffff]">Chats</h1>
        </div>
        <div className="flex flex-col overflow-y-auto ">
          {chats.map((chat) => (
            <ChatList
              key={chat.chatId}
              chat={chat}
              onChatClick={currChatHandler}
              currChat={currChat}
            />
          ))}
         
        </div>

        <button
          onClick={() => {
            setPopup(true);
          }}
          className=" absolute bottom-4 right-4 focus:outline-none"
        >
          <IoMdAddCircleOutline size={45} color="#00aeff" />
        </button>
      </div>
      {currChat && (
        <MessageContainer
          key={currChat.chatId}
          data={currChat}
          closeContainer={() => setCurrChat(null)}
        />
      )}
    </div>
  );
}
