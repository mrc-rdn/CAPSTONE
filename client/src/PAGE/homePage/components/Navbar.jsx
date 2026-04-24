import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const menuItems = ["Home", "Features", "About Us"];

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 50); // scroll threshold
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 1️⃣ Scroll Navbar (Visible after scroll) */}
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

      {/* 2️⃣ Top Navbar (Always visible at top) */}
      <nav className="relative w-full h-18 z-50 bg-[#2D4F2B]">
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
    </>
  );
}
