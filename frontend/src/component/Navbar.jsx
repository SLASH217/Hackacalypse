import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigator = useNavigate();
  const location = useLocation();
  const [hideNavigation, setHideNavigation] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      setHideNavigation(true);
    } else {
      setHideNavigation(false);
    }
  }, [location]);

  return (
    <nav
      className={`${
        hideNavigation ? "hidden" : ""
      } ${
        location.pathname === "/addnote" ? "fixed w-full z-10" : ""
      } bg-black shadow-lg border-b border-red-500`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="text-red-400 text-xl font-bold font-mono tracking-wide">
          <Link to="/">
            Echo<span className="text-blue-500">Link</span>
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="text-red-400 md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Nav Links */}
        <ul
          className={`flex-col md:flex-row md:flex md:items-center space-y-4 md:space-y-0 md:space-x-6 absolute md:static bg-black w-full md:w-auto left-0 md:left-auto top-14 md:top-auto ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          <li>
            <NavLink
              to="/"
              className="text-red-300 font-mono hover:text-red-400 px-4 py-2 transition-colors duration-200"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/trade"
              className="text-red-300 font-mono hover:text-red-400 px-4 py-2 transition-colors duration-200"
            >
              Trade
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/communication"
              className="text-red-300 font-mono hover:text-red-400 px-4 py-2 transition-colors duration-200"
            >
              Communication
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/map"
              className="text-red-300 font-mono hover:text-red-400 px-4 py-2 transition-colors duration-200"
            >
              Map
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
