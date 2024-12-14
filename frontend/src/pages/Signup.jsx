import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [creds, setCreds] = useState({username: "", email:"", password:"", confirmPassword:""});

  const [passType, setPassType] = useState("password");
  const [confirmPassType, setConfirmPassType] = useState("password");

  const togglePassType = () => {
    setPassType(passType === "text" ? "password" : "text");
  };
  const Navigate=useNavigate();

  const toggleConfirmPassType = () => {
    setConfirmPassType(confirmPassType === "text" ? "password" : "text");
  };

  const handleSignup = async(e) => {
    e.preventDefault();
    if (creds.password !== creds.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const response=await fetch('http://localhost:3000/auth/signup',{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: creds.username, email: creds.email, password: creds.password})
    }
)
const json=await response.json();
if(json.success){
    localStorage.setItem('auth-token', json.msg);
    Navigate('/');
}
else{
    alert(`Error: ${json.msg}`);
}
    // Handle signup logic here
    console.log("Signup:", { username, email, password });
  };
  const handleChange=(e)=>{
    setCreds({...creds,[e.target.name]:e.target.value});
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-md">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create an Account
        </h2>
        <p className="text-gray-600 text-center mt-2">Sign up to get started</p>

        {/* Signup Form */}
        <form className="mt-6" onSubmit={handleSignup}>
          {/* Username Input */}
          <div className="relative mb-4">
            <input
              type="text"
              className="peer bg-gray-100 border border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
              value={creds.username}
              name="username"
              onChange={handleChange}
              required
            />
            <label
              className="absolute left-3 text-gray-500 text-sm peer-placeholder-shown:text-[17px] peer-focus:block peer-placeholder-shown:block hidden peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 transition-all"
              htmlFor="username"
            >
              Username
            </label>
          </div>

          {/* Email Input */}
          <div className="relative mb-4">
            <input
              type="email"
              className="peer bg-gray-100 border border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
              value={creds.email}
              name="email"
              onChange={handleChange}
              required
            />
            <label
              className="absolute left-3 text-gray-500 text-sm peer-placeholder-shown:text-[17px] peer-focus:block peer-placeholder-shown:block hidden peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 transition-all"
              htmlFor="email"
            >
              Email Address
            </label>
          </div>

          {/* Password Input */}
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
            <label
              className="absolute left-3 text-gray-500 text-sm peer-placeholder-shown:text-[17px] peer-focus:block peer-placeholder-shown:block hidden peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 transition-all"
              htmlFor="password"
            >
              Password
            </label>
            <IoMdEye
              className={`${
                passType === "text" ? "hidden" : ""
              } absolute top-4 right-4 text-xl hover:cursor-pointer`}
              onClick={togglePassType}
            />
            <IoMdEyeOff
              className={`${
                passType === "password" ? "hidden" : ""
              } absolute top-4 right-4 text-xl hover:cursor-pointer`}
              onClick={togglePassType}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-4">
            <input
              type={confirmPassType}
              className="peer bg-gray-100 border border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
              value={creds.confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
              required
            />
            <label
              className="absolute left-3 text-gray-500 text-sm peer-placeholder-shown:text-[17px] peer-focus:block peer-placeholder-shown:block hidden peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 transition-all"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <IoMdEye
              className={`${
                confirmPassType === "text" ? "hidden" : ""
              } absolute top-4 right-4 text-xl hover:cursor-pointer`}
              onClick={toggleConfirmPassType}
            />
            <IoMdEyeOff
              className={`${
                confirmPassType === "password" ? "hidden" : ""
              } absolute top-4 right-4 text-xl hover:cursor-pointer`}
              onClick={toggleConfirmPassType}
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-600 transition-all font-bold"
          >
            Sign Up
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:text-blue-700 font-bold"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

