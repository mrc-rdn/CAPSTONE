import React from "react";
import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header.jsx";
import StatisticsCollection from "./components/statistics/StatisticsCollection.jsx";

const MasterList = () => {
  return (
    <div className="flex w-screen h-screen relative overflow-hidden">

      <Navbar />

      <div className="w-full flex flex-col relative">
        <div className="absolute inset-0 bg-white/5 -z-0"></div>

        {/* HEADER BAR */}
        <Header title="Master List" />

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