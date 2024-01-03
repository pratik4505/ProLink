import React from "react";
import "../sass/NavbarDesign.scss";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoIosNotifications } from "react-icons/io";
import { BsBriefcaseFill } from "react-icons/bs";
import { MdEmojiPeople } from "react-icons/md";
import { Cookies } from 'react-cookie';

export default function Navbar() {
  const cookies = new Cookies();
  const ownerId=cookies.get('userId');
  const [showMenu, setShowMenu] = React.useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div className="navbar-container">
      <div className={`nav-bar ${showMenu ? 'show-menu' : ''}`}>
        <div className="img-ham">
      <img src="/Lyncwoback.png" alt="" />
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`bar ${showMenu ? 'open' : ''}`}></div>
          <div className={`bar ${showMenu ? 'open' : ''}`}></div>
          <div className={`bar ${showMenu ? 'open' : ''}`}></div>
        </div>
        </div>
        <div className={`link-bar ${showMenu ? 'show-menu' : ''}`}>
        <Link to="/">
            <AiFillHome size={40} className="react-icons" />
          </Link>
          <span>
          <Link to="/">Home</Link>
          </span>
        </div>
        <div className={`link-bar ${showMenu ? 'show-menu' : ''}`}>
        <Link to="/Jobs">
            < BsBriefcaseFill size={40} className="react-icons" />
          </Link>
          <span>
          <Link to="/Jobs">Jobs</Link>
          </span>
        </div>
        <div className={`link-bar ${showMenu ? 'show-menu' : ''}`}>
        <Link to="/Requests">
            <MdEmojiPeople size={40} className="react-icons" />
          </Link>
          <span>
          <Link to="/Requests">Request</Link>
          </span>
        </div>
        <div className={`link-bar ${showMenu ? 'show-menu' : ''}`}>
        <Link to="/Message">
            <BiSolidMessageDetail size={40} className="react-icons" />
          </Link>
          <span>
          <Link to="/Message">Message</Link>
          </span>
        </div>
        <div className={`link-bar ${showMenu ? 'show-menu' : ''}`}>
        <Link to="/Notifications">
            <IoIosNotifications size={40} className="react-icons" />
          </Link>
          <span>
          <Link to="/Notifications">Notify</Link>
          </span>
        </div>
        <div className={`link-bar ${showMenu ? 'show-menu' : ''}`}>
        <Link to={`/Profile/${ownerId}`}>
            <BiUserCircle size={40} className="react-icons" />
          </Link>
          <span>
            <Link to={`/Profile/${ownerId}`}>Profile</Link>
          </span>
        </div>
      </div>
    </div>
  );
}