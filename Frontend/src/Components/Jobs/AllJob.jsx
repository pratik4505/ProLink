
import './job.scss';

export default function AllJob (props) {

 
  return (
   
    <div className="job-container" onClick={()=>{props.onClick(props.data)}}>
      <div className="job-image">
        {/* <img src={`http://localhost:3000/${props.data.imageUrl}`} alt="Job" /> */}
      </div>
      <div className="job-details">
        <h3>{props.data.jobTitle}</h3>
        <p>{props.data.company}</p>
        <p>{props.data.location}</p>
        <p>{props.data.hasApplied ? 'You have applied' : 'Not applied yet'}</p>
      </div>
    </div>
  );
}

