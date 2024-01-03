
import "./cjob.scss";

export default function Currjob(props) {
  const handleApply = () => {};

  return (
    <div className="job-container">
      <div className="job-header">
        {props.data.imageUrl&&<img
          className="job-image"
          src={`http://localhost:3000/${props.data.imageUrl}`}
          alt="Job"
        />}
        <div className="job-title">{props.data.jobTitle}</div>
      </div>
      <div className="job-details">
        <div className="job-info">
          <div className="job-company">{props.data.company}</div>
          <div className="job-location">{props.data.location}</div>
        </div>
        <div className="job-industry">{props.data.industry}</div>
      </div>
      <div className="job-description">{props.data.description}</div>
      {props.data.skillsRequired&&<div className="job-skills">
        Skills Required: {props.data.skillsRequired.join(", ")}
      </div>}
      <button
        className={`apply-button ${props.data.hasApplied ? "applied" : ""}`}
        onClick={handleApply}
        disabled={props.data.hasApplied}
      >
        {props.data.hasApplied ? "Applied" : "Apply Now"}
      </button>
    </div>
  );
}


