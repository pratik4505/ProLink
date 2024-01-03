import React from 'react'
import { useState } from 'react';
import '../../sass/Popup.scss';
import './AddSkillPopup.scss'
export default function AddSkillPopup(props) {
    const [skill, setSkill] = useState('');

    const handleAboutChange = (e) => {
      setSkill(e.target.value);
    };
  
    const handleSubmit = () => {
      if(skill){
        props.onSubmit(skill);
      }
    };
  
   
  return (
    <div className="popup">
    <div className="popup-content card">
      <h2 className="card-header">Tell about yourself</h2>
      <div className="card-body">
        <label htmlFor="skill">Enter Skill:</label>
        <input
          type="text"
          id="skill"
          className="form-control"
          value={skill}
          onChange={handleAboutChange}
          required
        />
        <br />
       
      </div>
      <div className="card-footer">
        <button className="btn add-skill-popup-btn" onClick={handleSubmit}>
          Submit
        </button>
        <button className="btn btn-secondary" onClick={()=>props.onCancel()}>
          Cancel
        </button>
      </div>
    </div>
  </div>
  )
}
