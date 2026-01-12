import React from 'react'
import Header from './components/Header.jsx'
import Navbar from './components/Navbar.jsx'
import { useEffect, useState } from "react";
import StatisticsCollection from "./components/statistics/StatisticsCollection.jsx";
import { API_URL } from '../../api.js';
import CourseTraineeProgress from './components/statistics/CourseTraineeProgress.jsx'
const MasterList = () => {

  return (
    <div className="flex w-screen h-screen overflow-hidden">
            <Navbar />
            <div className='w-10/12 bg-gray-200 overflow-y-scroll'>
                <div>
                  
                </div>
                <Header title="MasterList"   />
                <StatisticsCollection  />
                
            </div>
        </div>
    
  );
};

export default MasterList;


