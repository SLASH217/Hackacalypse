import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/createContext";
import { IoMdClose, IoMdCreate } from "react-icons/io";

const DisasterDashboard = () => {
  const { role, broadCast, setBroadCast } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [broadcasts, setBroadcasts] = useState(broadCast || []);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
        setErrorMessage("There was an error fetching broadcasts.");
        console.log(error);
      }
    };

    fetchBroadcasts();
  }, [setBroadCast]);

  const handleSubmit = async () => {
    if (message.trim() === "") {
      setErrorMessage("Please enter a message before broadcasting.");
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
        setBroadcasts([...broadcasts, data.broadcast]); // Add the new broadcast
        setBroadCast([...broadcasts, data.broadcast]); // Update context
        setMessage("");
        setSuccessMessage("Broadcasted successfully!");
        setErrorMessage(""); // Clear any previous errors
      } else {
        setErrorMessage(data.msg);
        setSuccessMessage(""); // Clear success message if error occurs
      }
    } catch (error) {
      setErrorMessage("There was an error while broadcasting.");
      console.log(error);
      setSuccessMessage(""); // Clear success message if error occurs
    }
  };

  const handleEdit = (id) => {
    const broadcastToEdit = broadcasts.find((b) => b._id === id); // Use `_id`
    setMessage(broadcastToEdit.text);
    setBroadcasts(broadcasts.filter((b) => b._id !== id)); // Filter out the edited broadcast
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
        setBroadcasts(broadcasts.filter((b) => b._id !== id)); // Remove the broadcast from state
        setBroadCast(broadcasts.filter((b) => b._id !== id)); // Update context
        setSuccessMessage("Broadcast deleted successfully!");
        setErrorMessage(""); // Clear any previous errors
      } else {
        setErrorMessage(data.msg);
        setSuccessMessage(""); // Clear success message if error occurs
      }
    } catch (error) {
      setErrorMessage("There was an error while deleting broadcast.");
      console.log(error);
      setSuccessMessage(""); // Clear success message if error occurs
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {role === "admin" ? (
        <div className="bg-gray-900 text-green-400 shadow-2xl rounded-lg p-8 w-full max-w-lg border-t-4 border-green-500">
          <h2 className="text-3xl font-bold text-green-400 mb-6 text-center uppercase font-mono">
            Disaster Alert Dashboard
          </h2>

          <p className="text-sm text-gray-400 mb-4 text-center font-mono">
            As an Admin, you can broadcast critical emergency alerts.
          </p>

          <div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-green-400 text-lg font-mono mb-2">
                Emergency Message
              </label>
              <textarea
                id="message"
                rows="5"
                className="w-full px-4 py-3 border rounded-lg bg-gray-800 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-md font-mono"
                placeholder="Type the emergency message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 font-mono"
            >
              Broadcast Alert
            </button>

            {/* Show success or error messages */}
            {successMessage && <p className="text-green-400 mt-4 font-mono">{successMessage}</p>}
            {errorMessage && <p className="text-red-400 mt-4 font-mono">{errorMessage}</p>}
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {/* Broadcasted Messages Section */}
      <div className="w-full mt-8 space-y-4 px-4">
        {broadcasts.map((broadcast) => (
          <div
            key={broadcast._id} // Use `_id` from the backend
            className="relative bg-gray-800 text-green-300 shadow-lg rounded-lg p-4 border-l-4 border-green-500 flex items-center hover:shadow-green-500 transition duration-300 ease-in-out"
          >
            <p className="text-xl font-mono uppercase flex-grow text-center tracking-wider">
              {broadcast.text}
            </p>
            <div className="flex space-x-4 absolute right-4">
              <IoMdCreate
                className="text-yellow-400 hover:text-yellow-500 cursor-pointer text-2xl"
                onClick={() => handleEdit(broadcast._id)} // Use `_id`
              />
              <IoMdClose
                className="text-red-400 hover:text-red-500 cursor-pointer text-2xl"
                onClick={() => handleDelete(broadcast._id)} // Use `_id`
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisasterDashboard;
