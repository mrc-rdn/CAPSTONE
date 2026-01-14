import React,{useState, useEffect} from "react";
import Navbar from "./components/Navbar.jsx";
import HeroEnroll, { EmpowerEnroll } from "./components/Enroll.jsx";
import AccessTimeFilled from '@mui/icons-material/AccessTimeFilled';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Features from './components/Features.jsx'
import SuccessStories from './components/SuccessStories.jsx'
import FAQ from './components/FAQ.jsx'
import About from "./components/About.jsx";
import ChatBotModal from "./components/ChatBotModal.jsx";



export default function LandingPage() {


  const image = [
    "/images/program-course-1.jpg",
    "/images/program-course-2.jpg",
    "/images/program-course-3.jpg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev === image.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? image.length - 1 : prev - 1));
  };
      const [showNav, setShowNav] = useState(false);
      const [isOpenModal, setIsOpenModal] = useState(false)
  
  
     useEffect(() => {
      const handleScroll = () => {
        setShowNav(window.scrollY > 500); // adjust value
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
  
  return (
    <div>
      <Navbar />
      
    <ChatBotModal />
        {/* Empowering lives */}
      <section className="py-24 bg-[#F1F3E0]" id="empowering">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-2xl md:text-[2.75rem] font-extrabold text-[#2D4F2B] mb-6 leading-tight md:text-[2rem]">
              Empowering Lives Through <span className="text-primary">Community Learning</span>
            </h1>
            <p className="text-sm md:text-lg text-[#2D4F2B] mb-8 leading-relaxed">
              E-Kabuhayan LMS provides accessible, quality training for Barangay San Isidro residents to develop skills and improve livelihoods.
            </p>
        
            {/* enroll and learn button */}
              <EmpowerEnroll />
           </div>

           {/* previous */}
          <div className="relative flex items-center justify-center gap-4 ">
            <button onClick={prevImage} 
            className="">
              <ArrowBackIosIcon />
            </button>
           {/* images */}
            <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={image[currentImageIndex]}
                alt="Program"
                className="w-full h-[200px] object-cover block md:h-[250px]"
              />
            </div>
            {/* next */}
            <button onClick={nextImage} 
            className="">
              <ArrowForwardIosIcon />
            </button>
          </div>
        </div>
      </section>
      <Features />  
      <SuccessStories />   
      <FAQ />
      <About />


    </div>
  );
}