import React, { useState } from "react";

const OfferItem = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [requestedItem, setRequestedItem] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const [errorMessage, setErrorMessage] = useState(""); // For errors
  const [successMessage, setSuccessMessage] = useState(""); // For success

  const handleOfferItem = async () => {
    // Reset messages and set loading
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    // Validate inputs
    if (!name.trim() || !description.trim() || !requestedItem.trim()) {
      setErrorMessage("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:2000/trade/offer-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ name, description, requestedItem }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Item successfully offered for trade.");
        setName("");
        setDescription("");
        setRequestedItem("");
      } else {
        setErrorMessage(data.error || "Failed to offer item.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Offer Item</h2>

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* Input for Item Name */}
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        />

        {/* Input for Item Description */}
        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        />

        {/* Input for Requested Item */}
        <textarea
          placeholder="Requested Item (e.g., 'A book in exchange')"
          value={requestedItem}
          onChange={(e) => setRequestedItem(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        />

        {/* Submit Button */}
        <button
          onClick={handleOfferItem}
          disabled={loading}
          className={`w-full p-3 rounded ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Offer"}
        </button>
      </div>
    </div>
  );
};

export default OfferItem;
