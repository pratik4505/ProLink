import React, { useState, useEffect } from "react";
import "./addChatPopup.scss"
const baseUrl = "http://localhost:3000";
let chatsPerPage=5;
export default function AddChatPopup(props) {
  const [chatData, setChatData] = useState([]);

  const [loadMore, setLoadMore] = useState(false);

  const dataLoad = async () => {
    try {
      const response = await fetch(`${baseUrl}/message/getPossibleChats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chats: props.chats,
          limit: chatsPerPage,
          skip: chatData.length,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the state with the received chat data
        if(data.length > 0) {
        setChatData((prevData) => [...prevData, ...data]);
        setLoadMore(true);
        }
        else{
            setLoadMore(false);
        }

        
      } else {
        console.error("Failed to fetch possible chats");
      }
    } catch (error) {
      console.error("An error occurred while fetching possible chats:", error);
    }
  };

  useEffect(() => {
    dataLoad();
  }, []);

  return (
    <div className="popup">
      <div className="popup-content card">
        {chatData.map((data) => (
          <div className="brand" key={data._id}>
            {data.imageUrl&&<img height="40" src={`${baseUrl}/${data.imageUrl}`} alt="" />}
            <h1>{data.userName}</h1>
            <button onClick={() => props.chatAdder(data._id)}  className="btn btn-primary add-chat-section-messaging">Add</button>
          </div>
        ))}
        {loadMore && <button onClick={dataLoad} className="btn btn-primary load-more-section-messaging">Load More</button>}
      </div>
      <button className="btn btn-primary close-chat-section" onClick={() => props.onCancel() }>Close</button>
    </div>
  );
}
