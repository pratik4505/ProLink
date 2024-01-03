import React, {useState,useEffect,useContext}from 'react'
const baseUrl = "http://localhost:3000";
import GlobalContext from '../../context/GlobalContext';
import "./chatList.scss";
export default function ChatList(props) {

    const [unreadMsg,setUnreadMsg]=useState(undefined);
    const gloContext = useContext(GlobalContext);
    
    gloContext.socket.on("receiveMessage",(data)=>{
     
        if(props.currChat&&props.currChat.chatId!==props.chat.chatId&&data.senderId===props.chat.otherMemberId){
            setUnreadMsg(data.message);
        }
    })
  
  return (
    <div onClick={()=>{props.onChatClick(props.chat)}} >
        {props.chat.otherMemberImageUrl&&<img
          src={`${baseUrl}/${props.chat.otherMemberImageUrl}`}
          alt="Profile"
          className="profile-image"
        />}
        <p><b>{props.chat.otherMemberName}</b></p>
        {unreadMsg&&props.currChat.chatId!==props.chat.chatId&&<p className='unread'>{unreadMsg}</p>}
      </div>
  )
}
