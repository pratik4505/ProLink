import {useContext} from 'react'
import Navbar from '../Components/Navbar'
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
        <Navbar></Navbar>
       <MainMessage/>
    </div>
}
