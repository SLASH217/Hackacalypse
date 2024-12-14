import React, { useState } from "react";
import OfferItem from "../component/OfferItem";
import ItemList from "../component/ItemList";
const Trade = () => {
  // State to manage which component to display
  const [activeTab, setActiveTab] = useState("offer");

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navigation Tabs */}
      <nav className="flex justify-center space-x-4 bg-gray-800 py-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "offer" ? "bg-red-600" : "bg-gray-700"
          } hover:bg-red-700 transition`}
          onClick={() => setActiveTab("offer")}
        >
          Offer Item
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "list" ? "bg-red-600" : "bg-gray-700"
          } hover:bg-red-700 transition`}
          onClick={() => setActiveTab("list")}
        >
          Item List
        </button>
      </nav>

      {/* Render Components Based on Active Tab */}
      <div className="p-6">
        {activeTab === "offer" && <OfferItem />}
        {activeTab === "list" && <ItemList />}
      </div>
    </div>
  );
};

export default Trade;
