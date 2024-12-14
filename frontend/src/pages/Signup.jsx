import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [creds, setCreds] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [passType, setPassType] = useState("password");
  const [confirmPassType, setConfirmPassType] = useState("password");
  const Navigate = useNavigate();

  const togglePassType = () => {
    setPassType(passType === "text" ? "password" : "text");
  };

  const toggleConfirmPassType = () => {
    setConfirmPassType(confirmPassType === "text" ? "password" : "text");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (creds.password !== creds.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: creds.username, email: creds.email, password: creds.password }),
    });

    const json = await response.json();

    if (json.success) {
      localStorage.setItem("auth-token", json.msg);
      Navigate("/");
    } else {
      alert(`Error: ${json.msg}`);
    }
  };

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
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

      {/* Signup form */}
      <div className="relative z-10 bg-gray-900 shadow-2xl rounded-lg p-6 md:p-8 w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-yellow-300 text-center">
          Join the Sanctuary
        </h2>
        <p className="text-yellow-100 text-center mt-2">
          The world is in ruins, but together, we can rebuild. Be part of something greater.
        </p>

        <form className="mt-6" onSubmit={handleSignup}>
          {/* Username Input */}
          <div className="relative mb-4">
            <input
              type="text"
              className="peer bg-gray-800 border border-yellow-500 rounded-lg w-full p-3 text-yellow-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your username"
              value={creds.username}
              name="username"
              onChange={handleChange}
              required
            />
            <label className="absolute left-3 text-yellow-400 text-sm">Username</label>
          </div>

          {/* Email Input */}
          <div className="relative mb-4">
            <input
              type="email"
              className="peer bg-gray-800 border border-yellow-500 rounded-lg w-full p-3 text-yellow-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your email"
              value={creds.email}
              name="email"
              onChange={handleChange}
              required
            />
            <label className="absolute left-3 text-yellow-400 text-sm">Email Address</label>
          </div>

          {/* Password Input */}
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
            <label className="absolute left-3 text-yellow-400 text-sm">Password</label>
            <IoMdEye
              className={`${passType === "text" ? "hidden" : ""} absolute top-4 right-4 text-xl text-yellow-500 hover:cursor-pointer`}
              onClick={togglePassType}
            />
            <IoMdEyeOff
              className={`${passType === "password" ? "hidden" : ""} absolute top-4 right-4 text-xl text-yellow-500 hover:cursor-pointer`}
              onClick={togglePassType}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-4">
            <input
              type={confirmPassType}
              className="peer bg-gray-800 border border-yellow-500 rounded-lg w-full p-3 text-yellow-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Confirm your password"
              value={creds.confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
              required
            />
            <label className="absolute left-3 text-yellow-400 text-sm">Confirm Password</label>
            <IoMdEye
              className={`${confirmPassType === "text" ? "hidden" : ""} absolute top-4 right-4 text-xl text-yellow-500 hover:cursor-pointer`}
              onClick={toggleConfirmPassType}
            />
            <IoMdEyeOff
              className={`${confirmPassType === "password" ? "hidden" : ""} absolute top-4 right-4 text-xl text-yellow-500 hover:cursor-pointer`}
              onClick={toggleConfirmPassType}
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="bg-yellow-500 text-gray-900 w-full py-3 rounded-lg hover:bg-yellow-600 transition-all font-bold shadow-md"
          >
            Begin Anew
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-4 text-center">
          <p className="text-yellow-300 text-sm">
            Already part of the sanctuary?{" "}
            <a href="/login" className="text-yellow-500 hover:text-yellow-600 font-bold">
              Login Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
