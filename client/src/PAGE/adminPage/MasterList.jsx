import React from "react";
import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header.jsx";
import StatisticsCollection from "./components/statistics/StatisticsCollection.jsx";

const MasterList = () => {
  return (
    <div className="flex w-screen h-screen relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/plmro.jpg"
          alt="Background"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      </div>

      <Navbar />

      <div className="w-full flex flex-col relative">

        {/* HEADER BAR */}
        <div className="px-4 pt-4">
          <div className="flex w-full h-16 backdrop-blur-md bg-white/10 
            border border-black/10 rounded-xl shadow-md items-center">
            <h1 className="text-xl font-bold text-[#2D4F2B] ml-4">
              Master List
            </h1>
          </div>
        </div>

        {/* CONTENT */}
        <div className="h-[calc(100%-4rem)] w-full overflow-hidden px-6 py-6">

          <div
            className="
              w-full h-full
              rounded-2xl
              bg-white/30
              
              border border-white/20
              shadow-lg
              p-6
            "
          >
            <StatisticsCollection />
          </div>

        </div>

      </div>
    </div>
  );
};

export default MasterList;