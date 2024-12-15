  import React, { useState, useEffect } from "react";

  // Custom Alert Component
  const CustomAlert = ({ message, type }) => (
    <div
      className={`p-4 rounded-lg text-center font-mono ${
        type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {message}
    </div>
  );

  const ItemList = () => {
    const [items, setItems] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Fetch items from the server
    useEffect(() => {
      const fetchItems = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("http://localhost:2000/trade/items", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("auth-token"),
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch items.");
          }

          const data = await response.json();
          if (data.success) {
            setItems(data.items);
          } else {
            setErrorMessage(data.error);
          }
        } catch (err) {
          setErrorMessage("Error fetching items.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchItems();
    }, []);

    // Handle Accept Trade
    const handleAccept=(itemId)=>{
      setSuccessMessage("Successfully accepted trade offer!");
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    }

    return (
      <div className="flex justify-center items-center bg-black min-h-screen">
        <div className="bg-black border-2 p-6 rounded-lg shadow-lg w-full max-w-4xl border-red-400">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-400 font-mono uppercase">
            Available Items
          </h2>

          {/* Display success or error messages */}
          {successMessage && <CustomAlert message={successMessage} type="success" />}
          {errorMessage && <CustomAlert message={errorMessage} type="error" />}

          {/* Loading State */}
          {isLoading ? (
            <p className="text-center text-red-400">Loading items...</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="bg-black border-2 border-red-400 p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-red-300">{item.name}</h3>
                    <p className="text-red-200">{item.description}</p>

                    {/* Display requested item if it exists */}
                    {item.requestedItem && (
                      <p className="text-sm text-gray-400 mt-2 font-mono">
                        <strong className="text-red-300">Requested Item:</strong> {item.requestedItem}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    {/* Accept (Tick) Button */}
                    <button
                      onClick={() => handleAccept(item._id)} // Pass trade ID
                      className="bg-gray-600 px-4 text-black p-2 rounded-full hover:bg-green-700 flex items-center justify-center transition duration-300 transform hover:scale-105"
                      title="Accept"
                    >
                      ✓
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  export default ItemList;
