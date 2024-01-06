import {useContext} from 'react'

import { useNavigate } from "react-router-dom";
import MainJob from '../Components/Jobs/Jobss';
import GlobalContext from '../context/GlobalContext';
export default function Jobs(){
    
  const navigate = useNavigate();
  const gloContext = useContext(GlobalContext);
  if(!gloContext.isLoggedIn){
    navigate('/Login')
  }
    
    return (
    <div>
       
       <MainJob/>
    </div>
    );
}