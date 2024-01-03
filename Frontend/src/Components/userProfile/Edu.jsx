

const baseUrl = "http://localhost:3000";
export default function Edu(props){

  function update(){
    props.onUpdate(props.eduKey);
  }
  const end=props.data.endDate===undefined? props.data.endDate: "- present";
    return(<div>
         <div className="col-md-3">
          <img
            src={`${baseUrl}/${props.data.imageUrl}`}
            alt="University Logo"
            className="img-fluid"
          />
        </div>
        <div className="col-md-9">
          <h5>{props.data.place}</h5>
          <p>{props.data.degree}</p>
          <p>{props.data.startDate}</p>
          <p>{end}</p>
        </div>
        <button onClick={update}/>
        </div>
    )
}