import React, { useState, useEffect } from "react";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch all items when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch("http://localhost:2000/trade/items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });

      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      } else {
        setErrorMessage(data.error);
      }
    };

    fetchItems();
  }, []);

  // Handle Tick (✔️) Button
  const handleAccept = async (itemId, offeredId) => {
    try {
      const response = await fetch("http://localhost:2000/trade/initiate-trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({
          itemId, // The ID of the item to trade
          offeredId, // The owner of the item
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Trade request accepted!");
        setErrorMessage("");
        // Optionally, remove the item from the list
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      } else {
        setErrorMessage(data.error);
        setSuccessMessage("");
      }
    } catch (err) {
      setErrorMessage("Failed to accept trade request.");
      setSuccessMessage("");
      console.error(err);
    }
  };

  // Handle Cross (❌) Button
  const handleReject = async (itemId) => {
    try {
      // Implement rejection logic here if necessary
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      setSuccessMessage("Item removed from trade options.");
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Failed to reject trade request.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Available Items</h2>

        {/* Display success or error messages */}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item._id}
              className="bg-gray-700 p-4 rounded shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p>{item.description}</p>

                {/* Display requested item if it exists */}
                {item.requestedItem && (
                  <p className="text-sm text-gray-400 mt-2">
                    <strong>Requested Item:</strong> {item.requestedItem}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                {/* Tick Button */}
                <button
                  onClick={() => handleAccept(item._id, item.offeredBy)}
                  className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 flex items-center justify-center"
                  title="Accept"
                >
                  ✔️
                </button>

                {/* Cross Button */}
                <button
                  onClick={() => handleReject(item._id)}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 flex items-center justify-center"
                  title="Reject"
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ItemList;
