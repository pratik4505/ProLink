import  { useState, useEffect } from "react";
import "./commentBox.scss";

import Comment from "./Comment";

const baseUrl = import.meta.env.VITE_SERVER_URL;
const CommentBox = (props) => {
  const [newComment, setNewComment] = useState("");
  const [commentsData, setCommentsData] = useState([]);

  const fetchComments = async () => {
    try {
     
      const response = await fetch(
        `${baseUrl}/post/getComments/${props.postId}`,
       
        {  credentials: 'include',
          headers: {
            "Content-Type": "application/json",
           
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCommentsData(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
   
    fetchComments();
  }, []);

  const newCommentHandler = async () => {
    try {
      const newCommentData = {
        content: newComment,
        postID: props.postId,
      };

      const response = await fetch(`${baseUrl}/post/addComment`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify(newCommentData),
      });

      if (response.ok) {
        const newComment = await response.json();

        setCommentsData((prevCommentsData) => [
          newComment,
          ...prevCommentsData,
        ]);

        setNewComment("");
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const replyHandler = (newCommentData) => {
    // Find the index of the comment in commentsData
    const commentIndex = commentsData.findIndex(
      (comment) => comment._id === newCommentData._id
    );
  
    if (commentIndex !== -1) {
      // Replace the old comment with the new comment data
      commentsData[commentIndex] = newCommentData;
      setCommentsData([...commentsData]);
    }
  };
  

  return (
    <div  className="main_commentBox" >
      <div className="comment-input">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={newCommentHandler} className="AddComment-btn">Add Comment</button>
      </div>

      <div className="comments">
        {commentsData &&
          commentsData.map((commentData) => (
            <Comment
              key={commentData._id}
              commentData={commentData}
              replyHandler={replyHandler}
            />
          ))}
      </div>
    </div>
  );
};

export default CommentBox;
