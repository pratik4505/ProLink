import {useContext} from 'react'

import { useNavigate } from "react-router-dom";
import GlobalContext from '../context/GlobalContext';
import MainNotification from '../Components/Notifications/MainNotification';
export default function Notifications(){
   
   
    
    return <div>
       
       <MainNotification/>
    </div>
}
