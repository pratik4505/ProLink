import React, { useState, useEffect, useContext, useCallback } from "react";
import "../../sass/ProfileDesign.scss";
import AboutForm from "./AboutForm";
import DetailForm from "./DetailForm";
import Skill from "./Skill";
import EducationContainer from "./EducationContainer";
import ExperienceContainer from "./ExperienceContainer";
import AddSkillPopup from "./AddSkillPopup";
import { v4 as uuidv4 } from "uuid";
import ImageForm from "./ImageForm";
import SectionPopup from "./SectionPopup";
import GlobalContext from "../../context/GlobalContext";
import AddPostup from "./AddPostup";
import ConnectionPopup from "./ConnectionPopup";
import './userProfile.scss'

const baseUrl = import.meta.env.VITE_BASE_URL;

const UserProfile = (props) => {
  const [profileData, setProfileData] = useState(null);
  const [detailPopup, setDetailPopup] = useState(false);
  const [aboutPopup, setAboutPopup] = useState(false);
  const [skillPopup, setSkillPopup] = useState(false);
  const [imagePopup, setImagePopup] = useState(false);
  const [sectionPopup, setSectionPopup] = useState(false);
  const [postPopup, setPostPopup] = useState(false);
  const [connectionPopup, setConnectionPopup] = useState(false);

  const gloContext = useContext(GlobalContext);

 console.log(gloContext.socket)

  const initialLoad = useCallback(async () => {
    try {
      const ownerId = props.ownerId;
      const response = await fetch(
        `${baseUrl}/profile/getUserProfile/${ownerId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setProfileData(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching user profile data:",
        error.message
      );
    }
  }, [props.ownerId]);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  const detailFinish = async (data) => {
    setDetailPopup(false);
    setProfileData((prevData) => ({
      ...prevData,
      userName: data.userName,
      summary: data.summary,
      industry: data.industry,
      location: data.location,
    }));

    try {
      const response = await fetch(`${baseUrl}/profile/postDetails`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Details updated successfully");
      } else {
        console.error("Failed to update details");
      }
    } catch (error) {
      console.error("An error occurred while updating details:", error);
    }
  };

  const aboutFinish = async (data) => {
    setAboutPopup(false);
    setProfileData((prevData) => ({
      ...prevData,
      about: data.about,
    }));

    try {
      const response = await fetch(`${baseUrl}/profile/postAbout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("About updated successfully");
      } else {
        console.error("Failed to update about");
      }
    } catch (error) {
      console.error("An error occurred while updating about:", error);
    }
  };

  const expUpdater = (exp) => {
    setProfileData((prev) => {
      return { ...prev, experience: exp };
    });
  };
  const eduUpdater = (edu) => {
    setProfileData((prev) => {
      return { ...prev, education: edu };
    });
  };

  const onDeleteSkill = async (key) => {
    // Remove the skill from the local state
    const updatedSkills = { ...profileData.skills };
    delete updatedSkills[key];
    setProfileData((prevData) => ({ ...prevData, skills: updatedSkills }));

    try {
      // Send the key to the server to delete the skill
      const response = await fetch(`${baseUrl}/profile/deleteSkill/${key}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Skill deleted successfully");
      } else {
        console.error("Failed to delete skill");
      }
    } catch (error) {
      console.error("An error occurred while deleting skill:", error);
    }
  };

  const onEndorse = async (key, isEndorsed, recommendation) => {
    // Update the local state based on the endorsement action
    const updatedSkills = { ...profileData.skills };
    const skill = updatedSkills[key];

    if (isEndorsed) {
      // If endorsing, increase endorsementCount by one and set hasEndorsed to true
      skill.endorsementCount += 1;
      skill.hasEndorsed = true;
    } else {
      // If unendorsing, decrease endorsementCount by one and set hasEndorsed to false
      skill.endorsementCount -= 1;
      skill.hasEndorsed = false;
    }

    // Update the local state with the modified skill
    setProfileData((prevData) => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        [key]: skill,
      },
    }));

    try {
      // Send the endorsement data to the server
      const response = await fetch(`${baseUrl}/profile/endorse`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId: props.ownerId,
          key,
          isEndorsed,
          recommendation,
        }),
      });

      if (response.ok) {
        console.log("Endorsement updated successfully");

        gloContext.socket.emit("endorsement", {
          to: props.ownerId,
          skill: skill.skill,
          recommendation,
        });
      } else {
        console.error("Failed to update endorsement");
      }
    } catch (error) {
      console.error("An error occurred while updating endorsement:", error);
    }
  };

  const onAddSkill = async (value) => {
    // Generate a new UUID for the skill
    const skillId = uuidv4();

    // Create a new skill object
    const newSkill = {
      skill: value,
      endorsementCount: 0,
      hasEndorsed: false,
    };

    // Update the profileData with the new skill
    setProfileData((prevData) => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        [skillId]: newSkill,
      },
    }));

    // Make a POST request to update the skill on the server
    try {
      const response = await fetch(`${baseUrl}/profile/addSkill`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillId, skill: value }),
      });

      if (response.ok) {
        console.log("Skill added successfully");
      } else {
        console.error("Failed to add skill");
      }
    } catch (error) {
      console.error("An error occurred while adding skill:", error);
    }

    // Close the skill popup
    setSkillPopup(false);
  };

  const SectionAdder = async (data) => {
    const id = uuidv4();

    // Add the new section to profileData.moreSections
    setProfileData((prevData) => ({
      ...prevData,
      moreSections: { ...(prevData.moreSections || {}), [id]: data },
    }));

    // Send the id and data to the 'profile/addSection' endpoint
    try {
      const response = await fetch(`${baseUrl}/profile/addSection`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, data }),
      });

      if (response.ok) {
        console.log("Section added successfully");
      } else {
        console.error("Failed to add section");
      }
    } catch (error) {
      console.error("An error occurred while adding section:", error);
    }
  };

  const sectionDelete = async (e) => {
    const key = e.target.id;

    try {
      // Make a delete request to the server
      const response = await fetch(`${baseUrl}/profile/deleteSection/${key}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log(`Section with key ${key} deleted successfully.`);
        const updatedSections = { ...profileData.moreSections };
        delete updatedSections[key];

        setProfileData((prevData) => ({
          ...prevData,
          moreSections: updatedSections,
        }));
      } else {
        console.log(`deleted unsuccessfull.`);
      }
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const connectRequest = async () => {
    setProfileData((prev) => ({ ...prev, isConnecting: true }));
    const ownerId = props.ownerId;

    try {
      const response = await fetch(`${baseUrl}/profile/postRequest`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "connect", ownerId }),
      });

      if (response.ok) {
        const res = await response.json();
        gloContext.socket.emit("request", {
          to: ownerId,
          by: res.userId,
          type: "connectRequest",
        });
        console.log("Connect request sent successfully");
      } else {
        console.error("Failed to send connect request");
      }
    } catch (error) {
      console.error("An error occurred while sending connect request:", error);
    }
  };

  const messageRequest = async () => {
    setProfileData((prev) => ({ ...prev, isMessaging: true }));

    try {
      const ownerId = props.ownerId;

      const response = await fetch(`${baseUrl}/profile/postRequest`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "message", ownerId }),
      });

      if (response.ok) {
        const res = await response.json();
        gloContext.socket.emit("request", {
          to: ownerId,
          by: res.userId,
          type: "messageRequest",
        });
        console.log("Message request sent successfully");
      } else {
        console.error("Failed to send message request");
      }
    } catch (error) {
      console.error("An error occurred while sending message request:", error);
    }
  };

  return (
    profileData && (
      <div className="full-body-profile">
        <div className="info">
          <div className="container mt-3">
            <div className="row">
              
                <div className="profile-picture">
                  {profileData.imageUrl&&<img
                    src={`${baseUrl}/${profileData.imageUrl}`}
                    alt="Profile Picture"
                    className="img-fluid rounded-circle"
                  />}
                </div>
                
                
              {postPopup && (
                <AddPostup
                  type="user"
                  onCancel={() => setPostPopup(false)}
                  ownerId={props.ownerId}
                />
              )}

              {!profileData.isOwner && (
                <div>
                  {!profileData.isConnection && !profileData.isConnecting && (
                    <button onClick={connectRequest} className="profile-connect-btn btn">Connect</button>
                  )}
                  {profileData.isConnecting && (
                    <button className="profile-connecting-btn btn">connection Request Sent</button>
                  )}
                  {!profileData.isConnection &&
                    !profileData.isConnecting &&
                    !profileData.isMessaging && (
                      <button onClick={messageRequest} className="message-Request-btn btn">Message</button>
                    )}
                  {!profileData.isConnection &&
                    !profileData.isConnecting &&
                    profileData.isMessaging && (
                      <button className="message-Requestsent-btn btn">Message Request Sent</button>
                    )}
                </div>
              )}
              
              <div className="col-md-8 summary-profile">
               
                <h1>{profileData.userName}</h1>
                <p>{profileData.summary}</p>
                <p>{`${profileData.industry}`}</p>
                <p>{profileData.location}</p>
                <p
                  onClick={() => {
                    setConnectionPopup(true);
                  }}
                >{`${profileData.connectionCount} connections`}</p>
                {connectionPopup && (
                  <ConnectionPopup
                    onCancel={() => {
                      setConnectionPopup(false);
                    }}
                  />
                )}
              </div>
              
              <div className="All-btns-profile">
              {profileData.isOwner && (
                  <button onClick={() => setDetailPopup(true)} className="update-details-btn btn">
                    Update details
                  </button>
                )}
              {profileData.isOwner && (
                <button onClick={() => setPostPopup(true)} className="add-post-btn btn">Add post</button>
              )}
              {profileData.isOwner && (
                  <button onClick={() => setImagePopup(true)} className="btn update-image-profile">
                    Update image
                  </button>
                )}
              </div>
              {imagePopup && (
                  <ImageForm
                    onCancel={() => setImagePopup(false)}
                    imageHandler={(url) =>
                      setProfileData((prev) => ({
                        ...prev,
                        imageUrl: `${baseUrl}/${url}`,
                      }))
                    }
                  />
                )}
              {detailPopup && (
                <DetailForm
                  detailHandler={detailFinish}
                  data={{
                    userName: profileData.userName,
                    summary: profileData.summary,
                    industry: profileData.industry,
                    location: profileData.location,
                  }}
                  cancel={() => setDetailPopup(false)}
                />
              )}
              
            </div>

            <hr></hr>

            <div className="row  mt-4 about-section">
            <div className="header-about-section">
                <h1>About</h1>
                <p>{profileData.about}</p>
              </div>
              {profileData.isOwner && (
                <button onClick={() => setAboutPopup(true)} className="update-about-btn btn">
                  update About
                </button>
              )}
              {aboutPopup && (
                <AboutForm
                  aboutHandler={aboutFinish}
                  data={profileData.about}
                  onCancel={() => setAboutPopup(false)}
                />
              )}
            </div>

            <hr></hr>

            <EducationContainer
              data={profileData.education}
              isOwner={profileData.isOwner}
              eduUpdater={eduUpdater}
            />

            <hr></hr>

            <ExperienceContainer
              data={profileData.experience}
              isOwner={profileData.isOwner}
              expUpdater={expUpdater}
            />

            <hr></hr>

            <div className="container mt-3">
            <div className="scrolling">
              <div className="experience-header-profile">
            
                <h1>Skills</h1>
                {profileData.isOwner && (
                  <button onClick={() => setSkillPopup(true)} className="add btn btn-primary add-skills-profilesec-btn">
                    Add skill{" "}
                  </button>
                )}
                {skillPopup && (
                  <AddSkillPopup
                    onCancel={() => setSkillPopup(false)}
                    onSubmit={onAddSkill}
                  />
                )}
                
                {Object.entries(profileData.skills).map(([key, value]) => (
                  <Skill
                    key={key}
                    data={value}
                    onEndorse={onEndorse}
                    onDelete={onDeleteSkill}
                    isOwner={profileData.isOwner}
                    isConnection={profileData.isConnection}
                    skillKey={key}
                  />
                ))}
                </div>
              </div>
            </div>
            <div className="subcontainer">
              <button className="add" />
              {profileData.moreSections &&
                Object.entries(profileData.moreSections).map(([key, value]) => (
                  <div id={key} key={key} className="container mt-3">
                    <h2>{value.title}</h2>
                    <div className="experience-header-profile">
                      {value.description}
                    </div>
                    <button id={key} onClick={sectionDelete} className="btn">
                      Delete section
                    </button>
                  </div>
                ))}
              {profileData.isOwner && (
                <button onClick={() => setSectionPopup(true)} className="btn btn-primary">
                  Add section
                </button>
              )}
              {sectionPopup && (
                <SectionPopup
                  onCancel={() => setSectionPopup(false)}
                  onSubmit={SectionAdder}
                />
              )}
            </div>
          </div>
        </div>
        
        <hr></hr>
        <div className="last-profile-ele">
        <p>&copy;Lync:All rights Reserved</p>
        </div>
      </div>
    )
  );
};
export default React.memo(UserProfile);
