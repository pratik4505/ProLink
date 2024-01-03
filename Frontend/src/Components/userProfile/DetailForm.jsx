import React, { useState } from "react";
import '../../sass/Popup.scss';
import './DetailForm.scss'
function DetailForm(props) {
  const [formData, setFormData] = useState(props.data);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    if(formData.userName=='')
    return;
    props.detailHandler(formData);
  };

  const closePopup = () => {
    props.cancel();
  };

  return (
    <div className="popup">
      <div className="popup-content card">
        <h2 className="card-header">Enter your deatils</h2>
        <div className="card-body">
          <label htmlFor="userName">User Name:</label>
          <input
            type="text"
            id="userName"
            className="form-control"
            value={formData.userName}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="summary">Summary:</label>
          <textarea
            id="summary"
            className="form-control"
            value={formData.summary}
            onChange={handleInputChange}
            rows="3"
          />
          <br />
          <label htmlFor="industry">Industry:</label>
          <input
            type="text"
            id="industry"
            className="form-control"
            value={formData.industry}
            onChange={handleInputChange}
          />
          <br />
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            className="form-control"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="card-footer">
          <button className="btn submit-detail-popup-btn" onClick={handleSubmit}>
            Submit
          </button>
          <button className="btn btn-secondary" onClick={closePopup}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailForm;
