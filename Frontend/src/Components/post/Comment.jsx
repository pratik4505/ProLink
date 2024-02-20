import React, { useState } from 'react';
import './Comment.scss';
const baseUrl = import.meta.env.VITE_SERVER_URL;
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Comment = (props) => {
   
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const handleAddReply = async () => {
    try {
      const response = await fetch(`${baseUrl}/post/comment/addReply`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
         
        },
        body: JSON.stringify({
          content: replyText,
          commentId: props.commentData._id,
        }),
      });
  
      if (response.ok) {
        const newCommentData = await response.json();
  
        // Update commentsData in the CommentBox component
        props.replyHandler(newCommentData);
  
        // Clear the reply text input
        setReplyText("");
      } else {
        console.error("Error adding reply:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };
  

  return (
    <div className="comment">
      <div className="comment-content">
        <div className="commenter-name">{props.commentData.commentBy}</div>
        <div className="comment-text">{props.commentData.content}</div>
        <button className="reply-button" onClick={() => setShowReplies(!showReplies)}>
          {showReplies ? "Hide Replies" : "Show Replies"}
        </button>

      </div>

      {showReplies && (
        <div className="replies">
          {props.commentData.replies.map((reply, index) => (
            <div key={index} className="reply">
              <div className="replier-name">{reply.name}</div>
              <div className="reply-text">
                <span className="to-name">{formatDate(reply.createdAt)}: </span>
                {reply.content}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="reply-input">
        <input
          type="text"
          placeholder="Add a reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button onClick={handleAddReply} className='btn-reply'>Reply</button>
      </div>
    </div>
  );
};

export default Comment;


















// import React, { useState } from 'react';
// import './Comment.css';

// const Comment = ({ commentBy,commentById,content,replies,createdAt }) => {
//   const [isReplying, setIsReplying] = useState(false);
//   const [replyContent, setReplyContent] = useState('');

//   const handleReplyClick = () => {
//     setIsReplying((value)=>{return !value});
//   };

//   const handleReplyChange = (e) => {
//     setReplyContent(e.target.value);
//   };

//   const handleReplySubmit = () => {
//     // Handle the reply submission here (you can send the replyContent to your API or state management)
//     // You may want to clear the reply field and update the UI as needed
//     setIsReplying(false);
//     setReplyContent('');
//   };



//   return (
//     <div className="comment">

//       <div className="comment-info">
//         <span className="commenter-name">{commenterName}</span>
//         {recipientName && (
//           <span className="recipient-name"> &rarr; {recipientName}</span>
//         )}
//       </div>

//       <div className="comment-content">{content}</div>

//       <div className="comment-actions">
//         <a className="reply-link" onClick={handleReplyClick}>
//           Reply
//         </a>
//         {isReplying && (
//           <div className="reply-field">
//             <textarea
//               rows="2"
//               placeholder="Write a reply..."
//               value={replyContent}
//               onChange={handleReplyChange}
//             ></textarea>
//             <button onClick={handleReplySubmit}>Submit</button>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default Comment;
