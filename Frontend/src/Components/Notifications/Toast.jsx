import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toast() {
  const notify = () => {
    const senderName = 'John'; // Replace with the actual sender's name or dynamic content
    toast(`${senderName} wants to connect with you`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div>
      <button onClick={notify}>Show Notification</button>
      
    </div>
  );
}

export default Toast;
