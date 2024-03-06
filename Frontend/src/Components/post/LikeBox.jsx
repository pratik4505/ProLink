import React, { useState, useEffect, useCallback } from "react";
import "./likeBox.scss";
import PostHeader from "./PostHeader";
import { API } from "../../utils/api";
const userPerPage = 7;
const baseUrl = import.meta.env.VITE_SERVER_URL;
const LikeBox = (props) => {
  const [users, setUsers] = useState([]);
  const [loadMore, setLoadMore] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const response = await API.get(
        `/post/likesByUser?postId=${props.postId}&skip=${users.length}&limit=${userPerPage}`
      );

      if (response.status!==200) {
        throw new Error("Failed to fetch likes data");
      }

      const result = response.data;
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
