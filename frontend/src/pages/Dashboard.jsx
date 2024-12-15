import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import UserContext from "../context/createContext";
import { IoMdClose } from "react-icons/io";

const DisasterDashboard = () => {
  const { role, broadCast, setBroadCast } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [broadcasts, setBroadcasts] = useState(broadCast || []);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Redirect to login if auth-token is not present
  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    if (!authToken) {
      navigate("/login"); // Redirect to login page
    }
  }, [navigate]);

  // Fetch broadcasts when component mounts
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await fetch("http://localhost:2000/broadcast/render", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        });

        const data = await response.json();
        if (data.success) {
          setBroadcasts(data.broadcasts);
          setBroadCast(data.broadcasts); // Update context as well
        } else {
          setErrorMessage(data.msg);
        }
      } catch (error) {
        setErrorMessage("Error fetching broadcasts. Please try again.");
        console.log(error);
      }
    };

    fetchBroadcasts();
  }, [setBroadCast]);

  const handleSubmit = async () => {
    if (message.trim() === "") {
      setErrorMessage("No message entered. Please provide an alert to broadcast.");
      return;
    }

    try {
      const response = await fetch("http://localhost:2000/broadcast/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ text: message }),
      });

      const data = await response.json();

      if (data.success) {
        setBroadcasts([...broadcasts, data.broadcast]); // Add new broadcast
        setBroadCast([...broadcasts, data.broadcast]); // Update context
        setMessage("");
        setSuccessMessage("Alert broadcasted successfully!");
        setErrorMessage(""); // Clear any previous errors
      } else {
        setErrorMessage(data.msg);
        setSuccessMessage(""); // Clear success message if error occurs
      }
    } catch (error) {
      setErrorMessage("Error broadcasting alert. Try again.");
      console.log(error);
      setSuccessMessage(""); // Clear success message if error occurs
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:2000/broadcast/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });

      const data = await response.json();

      if (data.success) {
        setBroadcasts(broadcasts.filter((b) => b._id !== id)); // Remove broadcast
        setBroadCast(broadcasts.filter((b) => b._id !== id)); // Update context
        setSuccessMessage("Alert deleted successfully.");
        setErrorMessage(""); // Clear any previous errors
      } else {
        setErrorMessage(data.msg);
        setSuccessMessage(""); // Clear success message if error occurs
      }
    } catch (error) {
      setErrorMessage("Error deleting the alert. Please try again.");
      console.log(error);
      setSuccessMessage(""); // Clear success message if error occurs
    }
  };

  return (
    <div className="w-screen pt-16 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 font-mono">
      {/* Main Admin Dashboard */}
      {role === "admin" ? (
        <div className="bg-gray-900 text-red-400 shadow-xl rounded-lg p-8 w-full max-w-lg border border-red-600 transform hover:scale-[1.01] transition-transform duration-300">
          <h2 className="text-4xl font-bold text-red-500 mb-6 text-center uppercase tracking-widest">
            ⚠️ Urgent Disaster Alerts ⚠️
          </h2>

          <p className="text-gray-400 text-center mb-6 text-lg italic">
            Broadcast critical emergency messages to survivors in need. Time is of the essence.
          </p>

          {/* Broadcast Message Input */}
          <div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-red-400 text-lg mb-2 tracking-wide"
              >
                Emergency Alert Message
              </label>
              <textarea
                id="message"
                rows="5"
                className="w-full p-3 border border-red-500 rounded bg-gray-800 text-red-300 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-md"
                placeholder="Type the emergency message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md tracking-wide transition-transform transform hover:scale-105"
            >
              Broadcast Alert
            </button>

            {/* Status Messages */}
            {successMessage && (
              <p className="text-green-400 mt-4 text-center">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      {/* Broadcasted Messages Section */}
      <h3 className="text-3xl font-bold text-red-500 text-center my-8">Active Disaster Alerts</h3>
      <div className="w-full mt-8 px-4 space-y-4">
        {broadcasts.map((broadcast) => (
          <div
            key={broadcast._id} // Use `_id` from the backend
            className="relative bg-gray-900 text-red-300 shadow-lg rounded-lg p-6 border-l-4 border-red-600 flex items-center transition-transform hover:scale-[1.02]"
          >
            <p className="text-xl flex-grow text-center tracking-wide">
              {broadcast.text}
            </p>
            <div className="flex space-x-4 absolute right-4">
              {/* Delete Button */}
              {role === "admin" ? (
                <IoMdClose
                  className="text-red-400 hover:text-red-500 cursor-pointer text-2xl"
                  onClick={() => handleDelete(broadcast._id)} // Use `_id`
                />
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Sections for Apocalypse Victims */}
      <div className="w-full mt-16 px-6 space-y-6 text-gray-400">
        <h3 className="text-3xl font-bold text-red-400 text-center mb-4">
          Help the Survivors
        </h3>
        <p className="text-lg text-center italic">
          In the wake of the apocalypse, countless survivors struggle to find shelter, food, and safety. Your efforts can help bring hope to those who need it most. Your donations, actions, and words of support are crucial during these times of despair.
        </p>

        <div className="space-y-4">
          <h4 className="text-2xl text-red-400 text-center">Survival Assistance</h4>
          <p className="text-center text-lg">
            Every survivor has a story of loss and endurance. Providing access to medical supplies, food, and water can help restore the dignity of those displaced by the disaster. Your contribution can make a life-saving difference.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-2xl text-red-400 text-center">Restoring Hope</h4>
          <p className="text-center text-lg">
            In this new world, survivors need not just physical aid, but emotional support. The broadcast of safety messages, availability of community shelters, and sharing of resources is key to rebuilding their lives.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-2xl text-red-400 text-center">Join the Relief Efforts</h4>
          <p className="text-center text-lg">
            You can assist by joining local relief groups, organizing shelter points, or sharing knowledge and resources to help victims adapt to a post-apocalyptic world. The future of the survivors lies in your hands.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisasterDashboard;
