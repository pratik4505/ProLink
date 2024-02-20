import { useContext } from "react";

import { useNavigate } from "react-router-dom";
import MainJob from "../Components/Jobs/Jobss";
import GlobalContext from "../context/GlobalContext";
export default function Jobs() {
  return (
    <div>
      <MainJob />
    </div>
  );
}
