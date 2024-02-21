

import { Link } from 'react-router-dom';
import './postHeader.scss'; 

const baseUrl = import.meta.env.VITE_SERVER_URL;

const PostHeader = (props) => {
  return (
    <Link className="post-header-container" to={props.type === 'user' ? `/Profile/${props.id}` : ''}>
      <div className="left">
        {props.imageUrl ?
          <img src={`${baseUrl}/${props.imageUrl}`} alt="Profile" className="profile-image" />
          :
          <div className="default-profile-image"></div>
        }
      </div>
      <div className="right">
        <div className="name">{props.name}</div>
        <div className="summary">{props.summary}</div>
        {props.likeType&&<div>{props.likeType}</div>}
      </div>
    </Link>
  );
};

export default PostHeader;
