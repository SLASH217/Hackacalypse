import React, { useState } from "react";
import OfferItem from "../component/OfferItem";
import ItemList from "../component/ItemList";

const Trade = () => {
  // State to manage which component to display
  const [activeTab, setActiveTab] = useState("offer");

  return (
    <div className="bg-black min-h-screen text-white font-mono">
      {/* Navigation Tabs */}
      <nav className="flex justify-center space-x-4 bg-gray-900 py-4">
        <button
          className={`px-6 py-3 rounded-lg text-lg font-bold transition-all ${
            activeTab === "offer"
              ? "bg-red-600 text-black"
              : "bg-gray-700 text-red-400"
          } hover:bg-red-700 hover:text-white`}
          onClick={() => setActiveTab("offer")}
        >
          Offer Item
        </button>
        <button
          className={`px-6 py-3 rounded-lg text-lg font-bold transition-all ${
            activeTab === "list"
              ? "bg-red-600 text-black"
              : "bg-gray-700 text-red-400"
          } hover:bg-red-700 hover:text-white`}
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
