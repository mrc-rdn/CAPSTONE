import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HeroEnroll from "./Enroll";

export default function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const menuItems = ["Home", "Features", "About Us"];

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 750); // scroll threshold
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen bg-[#F1F3E0] flex flex-col">

      {/* 1️⃣ Scroll Navbar */}
      <nav
        className={`
          fixed top-0 left-0 w-full z-[9999] bg-[#2D4F2B]
          transition-all duration-500 ease-in-out backdrop-blur
          ${showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}
        `}
      >
        <div className="w-full h-18 mx-auto flex items-center justify-between px-5 py-3 text-white">
          {/* Logo */}
          <div className="flex items-center gap-4 font-bold ml-15">
            <img src="/images/logo2.gif" alt="Logo" className="w-12 h-12" />
            <span className="text-lg lg:text-xl">E-Kabuhayan</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex flex-1 justify-center gap-30 ">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className="text-white font-medium hover:text-[#FFB823]"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop Login */}
          <div className="hidden md:block mr-15">
            <Link
              to="/role"
              className="px-5 py-2 rounded-full "
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <div className="ml-auto md:hidden cursor-pointer" onClick={() => setIsOpenModal(true)}>
            <MenuIcon fontSize="large" />
          </div>
        </div>
      </nav>

      {/* 2️⃣ Top Navbar (laging visible) */}
      <nav className="top-0 left-0 w-full h-18 z-50 bg-[#2D4F2B]">
        <div className=" flex items-center px-5 py-3 text-white">
          {/* Logo */}
          <div className="flex items-center gap-4 font-bold ml-15">
            <img src="/images/logo2.gif" alt="Logo" className="w-12 h-12" />
            <span className="text-lg lg:text-xl">E-Kabuhayan</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex flex-1 justify-center gap-30 ">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className="text-white font-medium hover:text-[#FFB823] text-md"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop Login */}
          <div className="hidden md:block mr-15 ">
           <Link
              to="/role"
              className="
                
                inline-block px-5 py-2 m- rounded-2xl font-bold text-[#FFF1CA] 
                bg-[#2D4F2B] border-1 border-[#708A58]
                shadow-[0px_5px_0px_0px_#708A58]
                hover:translate-y-[5px]
                hover:shadow-none
                hover:bg-[#708A58]
                
                
                transition-all duration-150 ease-in-out
              "
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <div className="ml-auto md:hidden cursor-pointer" onClick={() => setIsOpenModal(true)}>
            <MenuIcon fontSize="large" />
          </div>
        </div>
      </nav>

      {/* 3️⃣ MOBILE MENU */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-[75%] z-[10001] bg-[#2D4F2B] text-white
          flex flex-col items-center justify-center gap-10
          transform transition-transform duration-300
          ${isOpenModal ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <button onClick={() => setIsOpenModal(false)} className="absolute top-5 right-5">
          <CloseIcon fontSize="large" />
        </button>

        {menuItems.map((item, idx) => (
          <a
            key={idx}
            href={`#${item.toLowerCase().replace(" ", "")}`}
            className="text-xl font-semibold hover:text-[#FFB823]"
            onClick={() => setIsOpenModal(false)}
          >
            {item}
          </a>
        ))}

        <Link
          to="/role"
          className="px-10 py-3 rounded-full border border-yellow-300 hover:bg-[#FFB823] hover:text-[#2D4F2B]"
          onClick={() => setIsOpenModal(false)}
        >
          Login
        </Link>
      </div>

      {/* 4️⃣ HERO SECTION */}
      <section id="home" className="relative z-10 flex items-center justify-end h-full px-6">
        <div className="relative w-full max-w-[1500px] h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/plmro.jpg"
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35"></div>

          <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-16 text-white max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-[white/80]">
              PLRMO Official Platform
            </span>

            <h1 className="mt-4 font-extrabold text-4xl md:text-6xl leading-tight">
              Unlock Your <span className="text-[#FFB823]">Professional</span> <br /> Potential
            </h1>

            <p className="mt-6 text-sm md:text-lg text-white/80 leading-relaxed max-w-xl">
              Level up with community-powered learning with PLRMO. Join in-person or virtual events around the world.
            </p>

            <div className="mt-8">
              <HeroEnroll />
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/80 ">
              <span>Free training programs</span>
              <span>Job Matching</span>
              <span>Certificates</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
