// MainNotification.jsx
import React, { useEffect, useState } from 'react';
import Notification from './Notification'; // Import the Notification subcomponent
import './mainNotification.scss'; // Import the CSS file for styling
const perPage=40;
const baseUrl="http://localhost:3000";
export default function MainNotification() {
  const [notifications,setNotifications]=useState([]); 
  const [loadMore,setLoadMore]=useState(false);

  const loadNotify = async () => {
    try {
      const skip=notifications.length;
      const response = await fetch(`${baseUrl}/notification/getNotifications?limit=${perPage}&skip=${skip}`,{
        credentials:'include'
      });
      const data = await response.json();

      if(data.length>0){
        setLoadMore(true);
        setNotifications((prevNotifications) => [...prevNotifications, ...data]);
      }
      else{
        setLoadMore(false);
      }

     
     
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  useEffect(()=>{
    loadNotify();
  },[])
    

  return (
    <div className="main-notification-container">
      {notifications.map((notification) => (
        <Notification key={notification._id} data={notification} />
      ))}
      {loadMore&&<button onClick={loadNotify} className='loadMore'>Load More</button>}
    </div>
  );
}
