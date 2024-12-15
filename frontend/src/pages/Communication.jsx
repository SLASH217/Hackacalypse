import React from 'react';

const Communication = () => {
  // Handle SOS button click
  const handleSOSClick = () => {
    alert('SOS! Help is on the way!'); // Placeholder action, replace with your logic
    // You can add further logic here, such as sending an API request
  };

  return (
    <div className="flex justify-center items-center bg-black min-h-screen">
      <div className="bg-black border-2 p-6 rounded-lg shadow-lg w-full max-w-4xl border-red-400">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-400 font-mono uppercase">
          Communication
        </h2>

        {/* SOS Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSOSClick}
            className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition duration-300"
            title="SOS"
          >
            SOS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Communication;
