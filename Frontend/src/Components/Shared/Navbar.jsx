import { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { memo } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { AiOutlineBars } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { FaBell } from "react-icons/fa"; // Import notification icon
import VideoCall from "../Message/VideoCall";
import { Cookies } from "react-cookie";
import MainNotification from "../Notifications/MainNotification";
import Search from "./Search";
import GlobalContext from "../../context/GlobalContext";
import Logo from "../../assets/Logo.png";
import { FaRegUser } from "react-icons/fa";

const Navbar = ({ toggleLeftbar, showLeftbar }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // New state for notifications
  const cookies = new Cookies();
  const ownerId = cookies.get("userId");
  const gloContext = useContext(GlobalContext);
  const dropdownRef = useRef(null);
  const notificationButtonRef = useRef(null); // Ref for the notification button
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  console.log(gloContext.userData);
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const logout = async () => {
    setLoggingOut(true);
    // Delete userId and token from cookies
    cookies.remove("userId");
    cookies.remove("token");

    setLoggingOut(false);
    // Reload the page
    window.location.reload();
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-20 md:mb-3 flex justify-center gap-10 border bg-white p-2 md:items-center md:justify-between md:px-36">
      <Link to="/" className="hidden  md:inline-block">
        <img src={Logo} className="w-36 ml-8" alt="ProLink" />
      </Link>

      <button className="inline-block md:hidden" onClick={toggleLeftbar}>
        {showLeftbar ? <RxCross1 /> : <AiOutlineBars />}
      </button>
      <Search />
      <div className="relative flex justify-end md:w-36">
        {/* Notification button */}

        <button
          ref={notificationButtonRef}
          type="button"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full mr-4"
          onClick={handleNotificationClick}
        >
          <FaBell />
        </button>

        {/* Profile button */}
        <button
          type="button"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
          onClick={handleProfileClick}
        >
         {gloContext.userData?.imageUrl? <img src={`${baseUrl}/${gloContext.userData.imageUrl}`} alt="profile"
          className="h-8 w-8 rounded-full object-cover" /> :<FaRegUser  className="h-full w-[10%] mr-2" />}
        </button>

        {/* Notification dropdown */}
        <Transition
          show={showNotifications}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {() => (
            <div className="absolute px-2 text-xs overflow-auto right-0 top-10 mt-2 w-72 h-auto max-h-[75vh] origin-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
              <h2 className=" mt-2 text-3xl font-bold text-center  text-gray-800">
                Notifications
              </h2>

              <MainNotification />
            </div>
          )}
        </Transition>

        {/* Profile dropdown */}
        <Transition
          show={showDropdown}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {() => (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div className="py-1" role="none">
                <div className="flex flex-col items-center">
                  <img
                    src={`${baseUrl}/${gloContext.userData.imageUrl}`}
                    alt="profile"
                    className="mb-2 h-16 w-16 rounded-full object-cover"
                  />
                  <div className="text-sm font-semibold text-gray-700 hover:underline">
                    <Link to={`/Profile/${ownerId}`}>
                      {gloContext.userData.userName}
                    </Link>
                  </div>
                  <div className="text-sm text-gray-500">
                    {gloContext.userData.email}
                  </div>
                </div>
                <hr className="my-2" />
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="block w-full px-4 py-2  text-left text-sm text-red-400 hover:cursor-pointer hover:text-red-600"
                    role="menuitem"
                    onClick={logout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <div className="text-center">Logging out...</div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Logout</span>
                        <IoLogOutOutline className="ml-2" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Transition>
        <VideoCall />
      </div>
    </nav>
  );
};

export default memo(Navbar);
