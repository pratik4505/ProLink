import  {  memo } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import { MdPeopleOutline } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineTrophy } from 'react-icons/ai';
import { Cookies } from "react-cookie";

const Leftbar = () => {
  const cookies = new Cookies();
  const ownerId = cookies.get("userId");

  return (
    <div  className="hidden md:block  bg-white fixed top-20 pt-5 h-[85vh] rounded-md border w-[20%]">
      <div className="flex flex-col justify-start items-center">
        <div className="flex flex-col items-start gap-4 w-full px-5">
          <Link
            className="flex items-center gap-2 text-lg font-medium hover:text-primary"
            to="/"
          >
            <AiOutlineHome className="text-xl" />
            <p>Feeds</p>
          </Link>

          <Link
            className="flex items-center gap-2 text-lg font-medium hover:text-primary"
            to="/Jobs"
          >
            <BsBriefcase size={24} className="text-xl" />
            <p>Jobs</p>
          </Link>


          <Link
            className="flex items-center gap-2 text-lg font-medium hover:text-primary"
            to="/Jobs"
          >
            <AiOutlineTrophy size={24} className="text-xl" />
            <p>Challenges</p>
          </Link>

          <Link
            className="flex items-center gap-2 text-lg font-medium hover:text-primary"
            to="/Requests"
          >
            <MdPeopleOutline size={24} className="text-xl" />
            <p>Request</p>
          </Link>

          <Link
            className="flex items-center gap-2 text-lg font-medium hover:text-primary"
            to="/Message"
          >
            <BiMessageDetail size={24} className="text-xl" />
            <p>Message</p>
          </Link>

          <Link
            className="flex items-center gap-2 text-lg font-medium hover:text-primary"
            to="/Notifications"
          >
            <IoIosNotificationsOutline size={24} className="text-xl" />
            <p>Notify</p>
          </Link>

          <Link
            className="flex items-center gap-2 text-lg font-medium hover:text-primary"
            to={`/Profile/${ownerId}`}
          >
            <BiUserCircle size={24} className="text-xl" />
            <p>Profile</p>
          </Link>

          <hr className="w-full my-4 border-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default memo(Leftbar);
