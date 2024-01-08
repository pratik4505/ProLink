import React ,{useState} from 'react'
import AddRecPopup from './AddRecPopup';

export default function Skill(props) {

const [rec,setRec]=useState(false);

function endorseHandler(rec=null) {
    props.onEndorse(props.skillKey,!props.data.hasEndorsed,rec);
    setRec(false);
}
function deleteHandler(){
    props.onDelete(props.skillKey);
}

  return (
    <div>
        {rec&&<AddRecPopup onSubmit={endorseHandler} onCancel={()=>setRec(false)}/>}
        <h2>{props.data.skill}</h2>
        <p>{`${props.data.endorsementCount} endorses`}</p>
        {props.isConnection&&!props.data.hasEndorsed&&<button onClick={()=>setRec(true)}>Endorse</button>}
        {props.isConnection&&props.data.hasEndorsed&&<button onClick={endorseHandler}>Endorsed</button>}
        {props.isOwner&&<button onClick={deleteHandler}>Delete</button>}
    </div>
  )
}
