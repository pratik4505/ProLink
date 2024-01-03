import {useContext} from 'react'
import Navbar from '../Components/Navbar'
import { useNavigate } from "react-router-dom";
import GlobalContext from '../context/GlobalContext';
import MainRequest from '../Components/Requests/MainRequest';

export default function Requests(){
   
   
  const navigate = useNavigate();
  const gloContext = useContext(GlobalContext);
  if(!gloContext.isLoggedIn){
    navigate('/Login')
  }

    return <div>
        <Navbar></Navbar>
       <MainRequest/>
    </div>
}