import {useContext} from 'react'

import MainMessage from '../Components/Message/MainMessage'
import { useNavigate } from "react-router-dom";
import GlobalContext from '../context/GlobalContext';
export default function Message(){
    
    
  const navigate = useNavigate();
  const gloContext = useContext(GlobalContext);
  if(!gloContext.isLoggedIn){
    navigate('/Login')
  }
    
    return <div>
        
       <MainMessage/>
    </div>
}
