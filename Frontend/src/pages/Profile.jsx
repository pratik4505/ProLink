import {useContext} from "react";

import { useNavigate } from "react-router-dom";
import UserProfile from "../Components/userProfile/UserProfile";
import GlobalContext from "../context/GlobalContext";
import { useParams } from 'react-router-dom';
export default function Profile() {
 
 
  

  const { ownerId} = useParams();
 
  return (
    <>
      
      <UserProfile ownerId={ownerId}/>
    </>
  );
}