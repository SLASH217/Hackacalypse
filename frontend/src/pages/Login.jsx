import React, { useContext, useState, useEffect } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import UserContext from "../context/createContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const Navigate = useNavigate();
  const { setRole } = useContext(UserContext); // Use setRole from context
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [passType, setPassType] = useState('password');

  // Toggle password visibility
  const changePassType = () => {
    setPassType(passType === 'text' ? 'password' : 'text');
  };

  // Update credentials state
  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  // Check for authentication on page load
  useEffect(() => {
    if (localStorage.getItem('auth-token')) {
      Navigate('/');
    }
  }, [Navigate]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:2000/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: creds.email, password: creds.password })
    });

    const json = await response.json();

    if (json.success) {
      localStorage.setItem("auth-token", json.token); // Store token in local storage
      Navigate('/'); // Redirect to homepage
    } else {
      alert(`Error: ${json.error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-center mt-2">Login to your account</p>

        <form className="mt-6" onSubmit={handleLogin}>
          <div className="relative mb-4">
            <input
              type="email"
              className="peer bg-gray-100 border border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
              value={creds.email}
              onChange={handleChange}
              name="email"
              required
            />
            <label className="absolute left-3 text-gray-500 text-sm peer-placeholder-shown:text-[17px] peer-focus:block peer-placeholder-shown:block hidden peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 transition-all">
              Email Address
            </label>
          </div>

          <div className="relative mb-4">
            <input
              type={passType}
              className="peer bg-gray-100 border border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
              value={creds.password}
              name="password"
              onChange={handleChange}
              required
            />
            <label className="absolute left-3 text-gray-500 text-sm peer-placeholder-shown:text-[17px] peer-focus:block peer-placeholder-shown:block hidden peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 transition-all">
              Password
            </label>
            <IoMdEye className={`${passType === 'text' ? 'hidden' : ''} absolute top-4 right-4 text-xl hover:cursor-pointer`} onClick={changePassType} />
            <IoMdEyeOff className={`${passType === 'password' ? 'hidden' : ''} absolute top-4 right-4 text-xl hover:cursor-pointer`} onClick={changePassType} />
          </div>

          <button type="submit" className="bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-600 transition-all font-bold">
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:text-blue-700 font-bold">
              Sign Up
            </a>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            <a href="/forgot-password" className="text-blue-500 hover:text-blue-700 font-bold">
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
