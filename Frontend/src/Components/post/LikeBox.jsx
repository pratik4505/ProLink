import React, { useState, useEffect, useCallback } from "react";
import "./likeBox.scss";
import PostHeader from "./PostHeader";
const userPerPage = 7;
const baseUrl = import.meta.env.VITE_BASE_URL;
const LikeBox = (props) => {
  const [users, setUsers] = useState([]);
  const [loadMore, setLoadMore] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/post/likesByUser?postId=${props.postId}&skip=${users.length}&limit=${userPerPage}`,{
            credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch likes data");
      }

      const result = await response.json();
      const { data, hasMore } = result;
      console.log(data, hasMore);
      setUsers((prevUsers) => [...prevUsers, ...data]);
      setLoadMore(hasMore);
    } catch (error) {
      console.error("Error fetching likes data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="main_likeBox">
      {users.map((user) => {
        return (
          <PostHeader
            key={user.id}
            id={user.id}
            name={user.userName}
            type="user"
            summary={user.summary}
            likeType={user.likeType}
          />
        );
      })}
      {loadMore && (
        <button onClick={loadData} className="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
};

export default LikeBox;
