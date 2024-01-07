import React, { useState } from "react";
import Edu from "./Edu";
import '../../sass/Popup.scss';
import './Education.scss'
import { v4 as uuidv4 } from "uuid";
const def = {
  imageUrl: "",
  place: "",
  degree: "",
  startDate: "",
  endDate: "",
};
const baseUrl = import.meta.env.VITE_BASE_URL;

function EducationContainer(props) {
  const [educations, setEducations] = React.useState(props.data);
  const [isUpdating, setIsUpdating] = React.useState(null);
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
    const id=uuidv4();
    const apiUrl = isUpdating
      ? `${baseUrl}/profile/postEducation/${isUpdating}`
      : `${baseUrl}/profile/postEducation/${id}`;

    const formData = new FormData();
    formData.append("image", formdata.imageUrl);
    formData.append("place", formdata.place);
    formData.append("degree", formdata.degree);
    formData.append("startDate", formdata.startDate);
    formData.append("endDate", formdata.endDate);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        console.log("Education details updated successfully");

        const responseData = await response.json();
        const key = isUpdating || id;
        if(!responseData.endDate)
        responseData[key].endDate="-Present";
        setEducations((prevEducations) => {
          return {...prevEducations ,[key]:responseData[key]}
        });
        
       
      } else {
        console.error("Failed to update education details");
      }
    } catch (error) {
      console.error(
        "An error occurred while updating education details:",
        error
      );
    }
    closePopup();
  };

  const updateEdu = (key) => {
    setIsUpdating(key);
    setFormdata(educations[key]);
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
      <div className="education-header-profile">
        <h1>Education</h1>

        {props.isOwner&&<button className="btn btn-primary" onClick={openPopup}>
          Add Education
        </button>}
        {showPopup && (
          <div className="popup">
            <div className="popup-content card">
              <h2 className="card-header">Add your Education</h2>
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
                <label htmlFor="place">Place:</label>
                <input
                  type="text"
                  id="place"
                  className="form-control"
                  value={formdata.place}
                  onChange={handleInputChange}
                  required
                />
                <br />
                <label htmlFor="degree">Degree</label>
                <input
                  type="text"
                  id="degree"
                  className="form-control"
                  value={formdata.degree}
                  onChange={handleInputChange}
                  required
                />
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
                <button className="btn edu-popup-submit-btn" onClick={handleSubmit}>
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
        {educations&&Object.entries(educations).map(([key, value]) => (
          <Edu key={key} data={value} onUpdate={updateEdu} eduKey={key} />
        ))}
        {/* {Array.from(educations.entries()).map(([key, value]) => (
          <Edu key={key} data={value} onUpdate={updateEdu}/>
        ))} */}
      </div>
    </div>
  );
}

export default EducationContainer;
