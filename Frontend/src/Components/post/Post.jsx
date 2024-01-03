import React, { useState, useContext } from "react";
import "./post.scss";
import PostHeader from "./PostHeader";
import CommentBox from "./CommentBox";
import LikeBox from "./LikeBox";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";
import { FaLightbulb } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import GlobalContext from "../../context/GlobalContext";
const baseUrl = "http://localhost:3000";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Post = (props) => {
  // const gloContext=useContext(GlobalContext);
  const [postData, setPostData] = useState(props.postData);
  const [commentOnOff, setCommentOnOff] = React.useState(false);
  const [likesOnOff, setLikesOnOff] = React.useState(false);

  const bottomHandler = (e) => {
    if (e.target.id === "like") {
      setCommentOnOff(() => {
        return false;
      });
      setLikesOnOff((prev) => {
        return !prev;
      });
    } else {
      setLikesOnOff(() => {
        return false;
      });
      setCommentOnOff((prev) => {
        return !prev;
      });
    }
  };

  const likeHandler = async (e) => {
    const postId = postData._id;
    const likeType = e.target.id;

    try {
      setPostData((prevData) => ({
        ...prevData,
        hasLiked: true,
        likeCount: prevData.likeCount + 1,
        likeType: likeType,
      }));

      const response = await fetch(
        `${baseUrl}/post/like?postId=${postId}&likeType=${likeType}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update like");
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const unlikeHandler = async () => {
    try {
      const response = await fetch(`${baseUrl}/postUnlike/${postData._id}`, {
        credentials: "include"
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to update unlike");
      }

      setPostData((prevData) => ({
        ...prevData,
        hasLiked: false,
        likeCount: prevData.likeCount - 1,
      }));
    } catch (error) {
      console.error("Error updating unlike:", error);
    }
  };

  return (
    <div className="complete_post">
      <div className="post-container">
        <PostHeader
          imageUrl={postData.profileImageUrl}
          name={postData.name}
          id={postData.ownerId}
          summary={postData.summary}
          type={postData.type}
        />

        <div className="sub-post-container">
          <div className="post-content">
            <p>{postData.content}</p>
          </div>

          {postData.postImageUrl && (
            <img
              className="post-image"
              src={`${baseUrl}/${postData.postImageUrl}`}
              alt="Post Image"
            />
          )}

          {props.postData.videoUrl && (
            <video className="post-video" controls style={{ width: "100%" }}>
              <source
                src={`${baseUrl}/${postData.videoUrl}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}

          <div className="like-comment">
            <button
              id="like"
              className="btn comment-button show-likes-btn"
              onClick={bottomHandler}
            >
              {`Likes (${postData.likeCount})`}
            </button>

            {!postData.hasLiked && (
              <div className="Likes">
                <button
                  className="comment-button emoji-btn"
                  onClick={likeHandler}
                  id="thumbsup"
                >
                  <FaRegThumbsUp />
                </button>
                <button
                  className="comment-button emoji-btn"
                  onClick={likeHandler}
                  id="congo"
                >
                  <FaHandsClapping />
                </button>
                <button
                  className="comment-button emoji-btn"
                  onClick={likeHandler}
                  id="mindblowing"
                >
                  <FaLightbulb />
                </button>
                <button
                  className="comment-button emoji-btn"
                  onClick={likeHandler}
                  id="heart"
                >
                 <FaHeart />
                </button>
              </div>
            )}

            {postData.hasLiked && (
              <button className="comment-button Unlike-btn" onClick={unlikeHandler}>
                Unlike
              </button>
            )}

            <button
              className="comment-button btn comment-btn"
              id="comment"
              onClick={bottomHandler}
            >
              Comment ({postData.commentCount})
            </button>
          </div>
          <div className="post-date">{formatDate(postData.createdAt)}</div>
        </div>
      </div>

      <div className="bottom">
        {commentOnOff && (
          <CommentBox postId={postData._id} isOpen={commentOnOff} />
        )}
        {likesOnOff &&postData.likeCount>0 && <LikeBox postId={postData._id} />}
      </div>
    </div>
  );
};

export default Post;

Post.jsx;
