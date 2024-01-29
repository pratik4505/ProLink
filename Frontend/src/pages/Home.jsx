import { useContext } from "react";

import { useNavigate } from "react-router-dom";
import "../sass/HomeDesign.scss";

import GlobalContext from "../context/GlobalContext";


import Feeds from "../Components/post/Feeds";
export default function Home() {
  return (
    <>
      <Feeds />
      
    </>
  );
}
