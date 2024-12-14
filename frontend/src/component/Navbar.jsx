import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigator=useNavigate();
  const location=useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [hideNavigation, setHideNavigation] = useState(false)
  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      setHideNavigation(true);
    } else {
      setHideNavigation(false);
    }
  }, [location]);
  return (
    <nav className={`${hideNavigation?"hidden":""} ${location.pathname==='/addnote'?'fixed w-full z-10':""} bg-gray-800 p-4`}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-lg font-bold"><Link to='/'>EchoLink</Link></div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="text-gray-300 md:hidden focus:outline-none"
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

        {/* Nav Links (Hidden on mobile, visible on larger screens) */}
        <ul
          className={`flex-col md:flex-row md:flex md:items-center space-y-4 md:space-y-0 md:space-x-8 absolute md:static bg-gray-800 w-full md:w-auto left-0 md:left-auto top-14 md:top-auto ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          <li>
              <NavLink to='/' className="text-gray-300 hover:text-white block px-4 py-2">Dashboard</NavLink>
          </li>
          <li>
          <NavLink to='/trade' className="text-gray-300 hover:text-white block px-4 py-2">Trade</NavLink>
          </li>
          <li>
          <NavLink to='/communication' className="text-gray-300 hover:text-white block px-4 py-2">Communication</NavLink>
          </li>
          <li>
          <NavLink to='/map' className="text-gray-300 hover:text-white block px-4 py-2">Map</NavLink>
          </li>
        </ul>

      
      </div>

    </nav>
  );
};

export default Navbar;
