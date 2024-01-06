import { useRef, useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { memo } from "react";

import { IoLogOutOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { AiOutlineBars } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

import { Cookies } from "react-cookie";

const Navbar = ({ toggleLeftbar, showLeftbar }) => {
  
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const cookies = new Cookies();
  const ownerId = cookies.get("userId");

  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const logout = async () => {
    setLoggingOut(true);
    //await dispatch(logoutAction());
    setLoggingOut(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-20 mb-5 flex justify-center gap-10 border bg-white p-2 md:items-center md:justify-between md:px-36">
      <Link to="/" className="hidden md:inline-block">
        <img className="w-36"  alt="" />
      </Link>

      <button className="inline-block md:hidden" onClick={toggleLeftbar}>
        {showLeftbar ? <RxCross1 /> : <AiOutlineBars />}
      </button>

     

      <div className="relative flex justify-end md:w-36">

        <button
          type="button"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
          onClick={handleProfileClick}
        >
          <img
           
            alt="profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        </button>

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
                    
                    alt="profile"
                    className="mb-2 h-16 w-16 rounded-full object-cover"
                  />
                  <div className="text-sm font-semibold text-gray-700 hover:underline">
                    <Link to={`/Profile/${ownerId}`}>name</Link>
                  </div>
                  <div className="text-sm text-gray-500">email</div>
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
      </div>
    </nav>
  );
};

export default memo(Navbar);
