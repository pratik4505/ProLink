import React from 'react'
import { useState } from 'react';
import '../../sass/Popup.scss';
export default function AddRecPopup() {
    const [recommendation, setRecommendation] = useState('');

    const handleAboutChange = (e) => {
      setSkill(e.target.value);
    };
  
    const handleSubmit = () => {
      props.onSubmit(recommendation);
    };
  
    
  return (
    <div className="popup">
    <div className="popup-content card">
      <h2 className="card-header">Tell about yourself</h2>
      <div className="card-body">
        <label htmlFor="recommendation">Give Recommendation</label>
        <textarea
          type="text"
          id="recommendation"
          className="form-control"
          value={recommendation}
          onChange={handleAboutChange}
          required
        />
        <br />
       
      </div>
      <div className="card-footer">
        <button className="btn add-recpopup-btn" onClick={handleSubmit}>
          Endorse
        </button>
        <button className="btn btn-secondary" onClick={()=>props.onCancel()}>
          Cancel
        </button>
      </div>
    </div>
  </div>
  )

}
