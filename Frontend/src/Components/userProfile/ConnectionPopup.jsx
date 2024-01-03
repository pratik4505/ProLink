import React, { useEffect, useState } from "react";

import '../../sass/Popup.scss';
const connectionPerPage = 10;
const baseUrl = "http://localhost:3000";
const ConnectionPopup = (props) => {
  const [usersData, setUsersData] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  

  const loadData = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/profile/getConnections?ownerId=${props.ownerId}&skip=${usersData.length}&limit=${connectionPerPage}`,{
            credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsersData((prevData) => [...prevData, ...data.data]);
       
        setLoadMore(data.hasMore);
       
      } else {
        console.error("Failed to fetch connections");
      }
    } catch (error) {
      console.error("An error occurred while fetching connections:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="popup">
      <div className="popup-content card">
        {usersData.map((user) => (
          <div key={user._id}>
            <img src={`${baseUrl}/user.imageUrl`} alt="Profile" />
            <p>{user.userName}</p>
            <p>{user.summary}</p>
          </div>
        ))}
        {loadMore && (
          <button onClick={loadData} className="load-more">
            Load More
          </button>
        )}
      </div>
      <button onClick={props.onCancel}>Close</button>
  
    </div>
  )
};

export default ConnectionPopup;
