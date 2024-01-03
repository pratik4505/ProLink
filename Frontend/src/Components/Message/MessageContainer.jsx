import React, { useEffect, useState, useContext } from "react";
import "./messageContainer.scss";
const baseUrl = "http://localhost:3000";
import { Cookies } from "react-cookie";
import GlobalContext from "../../context/GlobalContext";
import { v4 as uuidv4 } from "uuid";
import ScrollToBottom from "react-scroll-to-bottom";
const msgPerLoad = 50;
let cookies;
let myId;

export default function MessageContainer(props) {
  const [messages, setMessages] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [currMsg, setCurrMsg] = useState("");

  const gloContext = useContext(GlobalContext);

  const messageLoader = async () => {
    try {
      const limit = msgPerLoad;
      const chatId = props.data.chatId;
      const createdAt =
        messages.length > 0 ? messages[0].createdAt : new Date();

      const response = await fetch(
        `${baseUrl}/message/getMessages?limit=${limit}&chatId=${chatId}&createdAt=${createdAt}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();

        // If the response is not empty, update the messages array
        if (data.length > 0) {
          setMessages((prevMessages) => [...data, ...prevMessages]);
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("An error occurred while fetching messages:", error);
    }
  };

  useEffect(() => {
    cookies = new Cookies();
    myId = cookies.get("userId");
    setMessages([]);
    messageLoader();
    gloContext.socket.on("receiveMessage", (data) => {
     console.log("useEffect")
      if (data.senderId === props.data.otherMemberId) {
        setMessages((prev) => {
          return [
            ...prev,
            {
              _id: uuidv4(),
              message: data.message,
              senderId: data.senderId,
              createdAt: data.createdAt,
              chatId: props.data.chatId,
            },
          ];
        });
      }
    });
  }, [props.data.chatId]);

  const sendMsg = async () => {
    const _id = uuidv4();

    const msg = currMsg;

    setMessages((prev) => {
      return [...prev, { _id: _id, senderId: myId, message: currMsg }];
    });
    setCurrMsg("");
    
    gloContext.socket.emit("sendMessage", {
      room: props.data.chatId,
      message: msg,
      senderId: myId,
      createdAt: new Date(),
    });
    const data = {
      senderId: myId,
      chatId: props.data.chatId,
      message: msg,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/message/postMessage",
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to save message to the server");
      }
    } catch (error) {
      console.error("An error occurred while posting the message:", error);
    }
  };

  return (
    <div className="chat__section">
      <div className="brand">
        {props.data.otherMemberImageUrl && (
          <img
            height="40"
            src={`${baseUrl}/${props.data.otherMemberImageUrl}`}
            alt=""
          />
        )}
        <h1>{props.data.otherMemberName}</h1>
      </div>
      <ScrollToBottom className="message__area">
        {loadMore && <button onClick={messageLoader} className="btn btn-primary loadmore-messaging-section">Load More</button>}
        {messages.map((msg) => (
          <div
            className={`message ${
              msg.senderId === myId ? "outgoing" : "incoming"
            }`}
            key={msg._id}
          >
            {msg.message}
          </div>
        ))}
      </ScrollToBottom>
      <div className="textarea-container">
        <textarea
          id="textarea"
          cols="25"
          rows="1"
          value={currMsg}
          onChange={(e) => {
            setCurrMsg(e.target.value);
          }}
          placeholder="Write a message..."
        ></textarea>
        <button onClick={sendMsg} className="btn btn-primary">Send</button>
      </div>
    </div>
  );
}
