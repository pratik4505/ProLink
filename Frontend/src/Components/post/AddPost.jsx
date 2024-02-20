import React, { useState } from 'react';

import "./AddPost.scss"
const baseUrl = import.meta.env.VITE_SERVER_URL;
export default function AddPost(props) {
  const [formdata, setFormdata] = useState({
    content: '',
    imageUrl: null,
    videoUrl: null,
    ownerId: props.ownerId,
    type: props.type,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { id } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [id]: e.target.files[0],
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('content', formdata.content);
    formData.append('image', formdata.imageUrl);
    formData.append('video', formdata.videoUrl);
    formData.append('ownerId', formdata.ownerId);
    formData.append('type', formdata.type);

    try {
      const response = await fetch(`${baseUrl}/addPost`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        console.log('Post added successfully');
        
      } else {
        console.error('Failed to add post');
      }
    } catch (error) {
      console.error('An error occurred while adding post:', error);
    }

   
    closePopup();
  };

  const closePopup = () => {
    props.onCancel();
  };

  return (
    
      <div className="">
        <h2 className="">Add Post</h2>
        <div className="">
        <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            className="form-control"
            value={formdata.content}
            onChange={handleInputChange}
            required
          ></textarea>
          <label htmlFor="imageInput">Select Image:</label>
          <input
            type="file"
            id="imageUrl"
            className="form-control"
            onChange={handleFileChange}
          />
          <label htmlFor="videoInput">Select Video:</label>
          <input
            type="file"
            id="videoUrl"
            className="form-control"
            onChange={handleFileChange}
          />  
        </div>
        <div className="card-footer">
          <button className="btn submit-add-post-btn" onClick={handleSubmit}>
            Submit
          </button>
          <button className="btn btn-secondary" onClick={closePopup}>
            Cancel
          </button>
        </div>
      </div>
    
  );
}
