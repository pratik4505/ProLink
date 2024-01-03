import LoginComponent from "../Components/Auth/LoginCom";
import {useContext} from 'react'
import { useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
export default function Login(){
   
  const navigate = useNavigate();
  const gloContext = useContext(GlobalContext);
  if(gloContext.isLoggedIn){
    navigate('/')
  }
    return (
        <div>
            <LoginComponent />
        </div>
            
    )
}