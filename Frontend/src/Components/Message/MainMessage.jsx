import React, { useEffect, useState ,useContext} from "react";
import ChatList from "./ChatList";
import MessageContainer from "./MessageContainer";
import AddChatPopup from "./AddChatPopup";
import GlobalContext from "../../context/GlobalContext";
import "./mainMessage.scss";
const baseUrl = "http://localhost:3000";
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
        setChats((prevChats) => [data, ...prevChats]); // Put the new chat data in front of the chats array
        gloContext.socket.emit("joinChat",{chatId:data.chatId,otherId:data.otherMemberId})
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

    return ()=>{
        gloContext.setMessageStatus(false);
    }
  }, []);

  return (
    <div className="main_message">
      {popup && (
        <AddChatPopup
          chatAdder={chatAdder}
          onCancel={() => {
            setPopup(false);
          }}
          chats={chats}
        />
      )}
      <div className="chat__section">
        <div className="brand-message-section">
          <h1>Lync</h1>
          <button
            onClick={() => {
              setPopup(true);
            }}
            className="btn add-chats-messaging"
          >
            Add Chats
          </button>
        </div>
        <div className="chatlist-messaging">
          {chats.map((chat) => (
            <ChatList
              key={chat.chatId}
              chat={chat}
              onChatClick={currChatHandler}
              currChat={currChat}
            />
          ))}
        </div>
      </div>
      {currChat && <MessageContainer key={currChat.chatId}data={currChat} />}
    </div>
  );
}
