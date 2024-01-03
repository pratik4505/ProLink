import React, { useState } from 'react';
import '../../sass/Popup.scss';
import "./SectionAdd.scss"
export default function SectionPopup(props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = () => {
    props.onSubmit({ title, description });
    props.onCancel();
  };

  return (
    <div className="popup">
      <div className="popup-content card">
        <h2 className="card-header">Section Details</h2>
        <div className="card-body">
          <label htmlFor="sectionTitle">Title:</label>
          <input
            type="text"
            id="sectionTitle"
            className="form-control"
            value={title}
            onChange={handleTitleChange}
            required
          />
          <br />
          <label htmlFor="sectionDescription">Description:</label>
          <textarea
            id="sectionDescription"
            className="form-control"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
          <br />
        </div>
        <div className="card-footer">
          <button className="btn add-section-popup-btn" onClick={handleSubmit}>
            Add Section
          </button>
          <button className="btn btn-secondary" onClick={props.onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
