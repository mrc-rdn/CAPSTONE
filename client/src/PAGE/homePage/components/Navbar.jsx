import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HeroEnroll from './Enroll'



export default function Navbar() {

    const [showNav, setShowNav] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false)


   useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 750); // adjust value
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return(
    <div className="relative h-screen bg-black flex flex-col">

      <img
        id="home"
        src="/images/plrmo-office.png"
        alt="Background"
        className="absolute w-full h-full object-cover z-0"
      />
      {/* navbar for scroll bar */}
      <nav className={`
          fixed top-0 left-0 w-full z-50
          transition-all duration-500 ease-in-out
          ${showNav
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"}
          bg-green-700/80 backdrop-blur
        `}>
        {/* LEFT: LOGO */}
        <div
          className="flex items-center font-bold text-white px-5 py-3"
          style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
        >
          <img
            src="/images/logo2.gif"
            alt="Logo"
            className="w-11 h-11 lg:ml-15 lg:w-10 lg:h-10 "
            style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))" }}
          />
          <span className="text-lg ml-2 lg:text-2xl">E-Kabuhayan</span>
          {isOpenModal ? null
            : <div
              className="ml-auto mr-2 md:hidden"
              onClick={() => { setIsOpenModal(true) }}>
              <MenuIcon />
            </div>}

          <div className="absolute w-full left-0 top-0 md:top-5 lg:top-4 ">
            {isOpenModal ? <div
              className="w-50 h-screen flex gap-10 items-center flex-col absolute right-0 bg-green-700/90
              md:w-full md:h-8 md:justify-center  md:flex-row md:relative md:bg-transparent  ">

              <button
                onClick={() => { setIsOpenModal(false) }}
                className="md:hidden ml-auto m-3">
                <CloseIcon />
              </button>

              {["Home", "Features", "FAQs", "About Us"].map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.toLowerCase().replace(" ", "")}`}
                  className=" lg:text-lg
                    text-white font-semibold text-[15px] relative transition-all duration-300 hover:text-primary after:content-[''] hover:text-yellow-400
                    after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all 
                    hover:after:w-full md:text-sm"
                  style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
                >
                  {item}
                </a>
              ))}
              <button
                className=" md:hidden
                w-25 h-9  bg-transparent rounded-full text-lg font-normal border border-yellow-300 border-solid">
                <Link to="/role">Login</Link>
              </button>
            </div>
              : null}
            <div
              className="hidden md:block w-full text-center">

              {["Home", "Features", "FAQs", "About Us"].map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.toLowerCase().replace(" ", "")}`}
                  className=" lg:text-lg lg:m-7 md:m-5 
                    text-white font-semibold duration-300 hover:text-yellow-400
                    hover:after:w-full "
                  style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
                >
                  {item}
                </a>
              ))}

            </div>
            <div className="hidden md:absolute md:right-0 md:top-0 md:block">
              <button className="w-25 h-9 text-white bg-transparent rounded text-lg font-normal border border-green-600 border-solid mr-20"><Link to="/role">Login</Link></button>
            </div>
          </div>

        </div>
      </nav>

      {/* nav in over top */}
      <nav className="z-50 w-full">
        {/* LEFT: LOGO */}
        <div
          className="flex items-center font-bold text-white px-5 py-3 bg-green-700/80"
          style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
        >
          <img
            src="/images/logo2.gif"
            alt="Logo"
            className="w-11 h-11 lg:ml-15 lg:w-10 lg:h-10 "
            style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))" }}
          />
          <span className="text-lg ml-2 lg:text-2xl">E-Kabuhayan</span>
          {isOpenModal ? null
            : <div
              className="ml-auto mr-2 md:hidden"
              onClick={() => { setIsOpenModal(true) }}>
              <MenuIcon />
            </div>}

          <div className="absolute w-full left-0 top-0 md:top-5 lg:top-4 ">
            {isOpenModal ? <div
              className="w-50 h-screen flex gap-10 items-center flex-col absolute right-0 bg-green-700/90
              md:w-full md:h-8 md:justify-center  md:flex-row md:relative md:bg-transparent  ">

              <button
                onClick={() => { setIsOpenModal(false) }}
                className="md:hidden ml-auto m-3">
                <CloseIcon />
              </button>

              {["Home", "Features", "FAQs", "About Us"].map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.toLowerCase().replace(" ", "")}`}
                  className=" lg:text-lg
                    text-white font-semibold text-[15px] relative transition-all duration-300 hover:text-primary after:content-[''] hover:text-yellow-400
                    after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all 
                    hover:after:w-full md:text-sm"
                  style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
                >
                  {item}
                </a>
              ))}
              <button
                className=" md:hidden
                w-25 h-9  bg-transparent rounded-full text-lg font-normal border border-yellow-300 border-solid">
                <Link to="/role">Login</Link>
              </button>
            </div>
              : null}
            <div
              className="hidden md:block w-full text-center">

              {["Home", "Features", "FAQs", "About Us"].map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.toLowerCase().replace(" ", "")}`}
                  className=" lg:text-lg lg:m-7 md:m-5 
                    text-white font-semibold 
                    duration-300 hover:text-yellow-400 hover:after:w-full "
                  style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
                >
                  {item}
                </a>
              ))}

            </div>
            <div className="hidden md:absolute md:right-0 md:top-0 md:block">
              <button 
              className="w-25 h-9 text-white bg-transparent rounded-xl text-lg font-normal border-2  border-solid mr-20
              transition-all hover:bg-primary-dark hover:-translate-y-1 hover:shadow-2xl">
                <Link to="/role">Login</Link>
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* hero section */}
      <section
        className="
          absolute top-30 left-1/2 -translate-x-1/2
          w-11/12 
        
          md:static md:translate-x-0
          md:w-6/12
          md:mx-auto md:my-auto
        "
      >
        <div
          className="
            relative
            bg-gradient-to-br from-white via-white to-gray-100
            backdrop-blur-md
            border border-white/50
            rounded-3xl
            shadow-[0_20px_50px_rgba(0,0,0,0.12)]
            p-6 md:p-12
            text-left
          "
        >
          {/* subtle decorative glow */}


          {/* small context label */}
          <span className="text-xs font-semibold tracking-widest text-green-700 uppercase">
            PLRMO Official Platform
          </span>

          <h1
            className="
              mt-3
              font-extrabold
              text-gray-900
              text-3xl md:text-5xl
              leading-tight
            "
          >
            Unlock Your{" "}
            <span className="text-green-700">Professional</span>
            <br />
            Potential
          </h1>

          {/* accent line */}
          <div className="w-12 h-1 bg-green-600 rounded-full my-6"></div>

          <p
            className="
              text-gray-600
              text-sm md:text-lg
              leading-relaxed
              mb-8
              max-w-xl
            "
          >
            Level up with community-powered learning with PLRMO. Join in-person
            or virtual events around the world.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <HeroEnroll />
          </div>
          <div className='md:flex md-flex-row sm:flex-row'>
            <p className="mt-4 text-xs text-gray-500 ">
              &nbsp;•&nbsp; ✔ Free training programs
            </p>
            <p className="mt-4 text-xs text-gray-500">
              &nbsp;•&nbsp; ✔ Job Matching
            </p>
            <p className="mt-4 text-xs text-gray-500">
              &nbsp;•&nbsp; ✔ Certificates
            </p>
          </div>




        </div>

      </section>

    </div>

    
        
          
    
  )
}
