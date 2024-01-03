import React from 'react';

export default function MainRequest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-500 to-sky-blue-400 flex flex-col">
      {/* Navigation Bar */}
      <nav className="p-4 bg-white backdrop-blur-md bg-opacity-60">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold flex items-center space-x-2">
            <img
              src="/your-logo.png" // Replace with the actual path to your logo
              alt="DeceptiConf Logo"
              className="h-8 w-8"
            />
            <span>DeceptiConf</span>
          </div>
          <div className="text-xl">
            Date: September 30, 2023
            <br />
            Location: Virtual
          </div>
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            Get your Ticket
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        {/* Add your page content here */}
      </div>
    </div>
  );
}
