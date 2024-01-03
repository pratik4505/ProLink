import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toast({ data }) {
  const notify = () => {
    toast.dark(`${data.userName} wants to connect with you`, {
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
