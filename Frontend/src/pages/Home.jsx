import {useContext} from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import "../sass/HomeDesign.scss";

import GlobalContext from "../context/GlobalContext";


import Feeds from '../Components/post/Feeds';
export default function Home() {
  
  const navigate = useNavigate();
  const gloContext = useContext(GlobalContext);
  if(!gloContext.isLoggedIn){
    navigate('/Login')
  }
  return (
    <div>
       <Navbar></Navbar>
      <Feeds/>
    </div>
     
   
  );
}
