import React, { useState } from "react";
import Exp from "./Exp"; // Assuming you have a component named Exp for rendering individual experiences
import '../../sass/Popup.scss';
import './Experience.scss'
import { v4 as uuidv4 } from "uuid";

const def = {
  title: "",
  description: "",
  startDate: "",
  endDate:"",
  imageUrl: "",
};

const baseUrl = import.meta.env.VITE_BASE_URL;

function ExperienceContainer(props) {
  const [experiences, setExperiences] = React.useState(props.data);
  const [isUpdating, setIsUpdating] = React.useState(undefined);
  const [showPopup, setShowPopup] = useState(false);

  const [formdata, setFormdata] = useState(def);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setIsUpdating(null);
  };

  const handleSubmit = async () => {

    if(!formdata.title&&!formdata.startDate)
    return;

    const id = uuidv4();
    const apiUrl = isUpdating
      ? `${baseUrl}/profile/postExperience/${isUpdating}`
      : `${baseUrl}/profile/postExperience/${id}`;

      let data=formdata;
    const formData = new FormData();
    formData.append("image", data.imageUrl);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    if(!data.endDate )
    data.endDate = "-present";
    formData.append("endDate", formdata.endDate);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        console.log("Experience details updated successfully");
        const key = isUpdating || id;
        const responseData = await response.json();
        setExperiences((prev)=>{
          return {...prev,[key]:responseData[key]}
        })
     
       
        
      } else {
        console.error("Failed to update experience details");
      }
    } catch (error) {
      console.error(
        "An error occurred while updating experience details:",
        error
      );
    }
    closePopup();
  };

  const updateExp = (key) => {
    setIsUpdating(key);
    setFormdata(experiences[key]);
    openPopup();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="container mt-3">
      <div className="experience-header-profile">
        <h1>Experience</h1>

        {props.isOwner&&<button className="btn btn-primary" onClick={openPopup}>
          Add Experience
        </button>}
        {showPopup && (
          <div className="popup">
            <div className="popup-content card">
              <h2 className="card-header">Add your Experience</h2>
              <div className="card-body">
                <label htmlFor="imageInput">Select Image:</label>
                <input
                  type="file"
                  id="imageInput"
                  className="form-control"
                  onChange={(e) =>
                    setFormdata((prevData) => ({
                      ...prevData,
                      imageUrl: e.target.files[0],
                    }))
                  }
                />
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={formdata.title}
                  onChange={handleInputChange}
                  required
                />
                <br />
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="form-control"
                  value={formdata.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <br />
                <label htmlFor="startDate">Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={formdata.startDate}
                  onChange={handleInputChange}
                  required
                />
                <br />
                <label htmlFor="endDate">End Date(leave if not ended):</label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={formdata.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="card-footer">
                <button className="btn exp-submit-popup-btn" onClick={handleSubmit}>
                  Submit
                </button>
                <button className="btn btn-secondary" onClick={closePopup}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="row scrolling">
        {experiences&&Object.entries(experiences).map(([key, value]) => (
          <Exp key={key} data={value} onUpdate={updateExp} expKey={key} />
        ))}
      </div>
    </div>
  );
}

export default ExperienceContainer;
