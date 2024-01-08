import {useContext} from "react";
import RegisterComponent from "../Components/Auth/RegisterCom";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
export default function Register(){
    
   
  const navigate = useNavigate();
  const gloContext = useContext(GlobalContext);
  if(gloContext.isLoggedIn){
    navigate('/');
  }
    return (
       
    <RegisterComponent />
        
            
    )
}