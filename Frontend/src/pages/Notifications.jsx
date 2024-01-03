import {useContext} from 'react'
import Navbar from '../Components/Navbar'
import { useNavigate } from "react-router-dom";
import GlobalContext from '../context/GlobalContext';
import MainNotification from '../Components/Notifications/MainNotification';
export default function Notifications(){
   
    const navigate = useNavigate();
    const gloContext = useContext(GlobalContext);
    if(!gloContext.isLoggedIn){
      navigate('/Login')
    }
    
    return <div>
        <Navbar></Navbar>
       <MainNotification/>
    </div>
}
