import React, { useContext, useState, useEffect } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import UserContext from "../context/createContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const Navigate = useNavigate();
  const { setRole } = useContext(UserContext); // Use setRole from context
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [passType, setPassType] = useState("password");

  // Toggle password visibility
  const changePassType = () => {
    setPassType(passType === "text" ? "password" : "text");
  };

  // Update credentials state
  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  // Check for authentication on page load
  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      Navigate("/");
    }
  }, [Navigate]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:2000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: creds.email, password: creds.password }),
    });

    const json = await response.json();

    if (json.success) {
      localStorage.setItem("auth-token", json.token); // Store token in local storage
      Navigate("/"); // Redirect to homepage
    } else {
      alert(`Error: ${json.error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-black to-gray-900 opacity-90"></div>
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="text-gray-500 text-[60px] md:text-[100px] font-extrabold tracking-wide animate-pulse">
          🌕
        </div>
      </div>

      {/* Login form */}
      <div className="relative z-10 bg-gray-900 shadow-2xl rounded-lg p-6 md:p-8 w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-yellow-300 text-center">
          Welcome Back, Survivor
        </h2>
        <p className="text-yellow-100 text-center mt-2">
          In a world that’s fallen apart, you’ve made it here. Together, we can rebuild what was lost.
        </p>

        <form className="mt-6" onSubmit={handleLogin}>
          <div className="relative mb-4">
            <input
              type="email"
              className="peer bg-gray-800 border border-yellow-500 rounded-lg w-full p-3 text-yellow-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your email"
              value={creds.email}
              onChange={handleChange}
              name="email"
              required
            />
            <label className="absolute left-3 text-yellow-400 text-sm">
              Email Address
            </label>
          </div>

          <div className="relative mb-4">
            <input
              type={passType}
              className="peer bg-gray-800 border border-yellow-500 rounded-lg w-full p-3 text-yellow-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your password"
              value={creds.password}
              name="password"
              onChange={handleChange}
              required
            />
            <label className="absolute left-3 text-yellow-400 text-sm">
              Password
            </label>
            <IoMdEye
              className={`${passType === "text" ? "hidden" : ""} absolute top-4 right-4 text-xl text-yellow-500 hover:cursor-pointer`}
              onClick={changePassType}
            />
            <IoMdEyeOff
              className={`${passType === "password" ? "hidden" : ""} absolute top-4 right-4 text-xl text-yellow-500 hover:cursor-pointer`}
              onClick={changePassType}
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-500 text-gray-900 w-full py-3 rounded-lg hover:bg-yellow-600 transition-all font-bold shadow-md"
          >
            Enter the Sanctuary
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-yellow-300 text-sm">
            Haven’t joined the survivors yet?{" "}
            <a
              href="/signup"
              className="text-yellow-500 hover:text-yellow-600 font-bold"
            >
              Sign Up Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
