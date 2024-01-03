// Notification.jsx
import React from 'react';
import './notification.scss'; 

const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
export default function Notification(props) {
  return (
    <div className="notification-container">
      <h3>{props.data.title}</h3>
      <p>{props.data.description}</p>
      <p>{formatDate(props.data.createdAt)}</p>
    </div>
  );
}
