import React from 'react'
import Navbar from './tests/Navbar'

export default function content() {
  return (
    <div>
      <div className="relative min-h-screen">
        <img
          src="/images/plrmo-office.png"
          alt="Background"
          className="absolute w-full h-full object-cover z-0"
        />

        <nav className="relative z-[100]
                        grid items-center
                        px-12 py-3
                        h-[64px]
                        grid-cols-[auto_1fr_auto]
                        bg-white/80 backdrop-blur-md
                        rounded-full
                        mx-8 mt-4
                        shadow-md">
          {/* LEFT: LOGO */}
          <div
            className="flex items-center gap-2.5 text-xl font-bold text-white justify-self-start"
            style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
          >
            <img
              src="/images/logo2.gif"
              alt="Logo"
              className="w-9 h-9 object-contain"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))" }}
            />
            <span>E-Kabuhayan</span>
          </div>

          {/* CENTER: NAV LINKS */}
                    <div className="flex gap-8 justify-center">
            {["Home", "Features", "FAQs", "About Us"].map((item, idx) => (
              <a
                key={idx}
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className="
                  text-gray-700
                  font-medium
                  text-sm
                  transition-colors
                  hover:text-green-700
                "
              >
                {item}
              </a>
            ))}
          </div>


          {/* RIGHT: LOGIN BUTTON */}
                    <div className="justify-self-end">
            <div className="
              px-5 py-2
              rounded-full
              bg-green-700 text-white
              text-sm font-semibold
              hover:bg-green-800
              transition
            ">
              <Navbar />
            </div>
          </div>

        </nav>

        {/* Hero Section */}
        <section
          className="relative z-10 flex items-center justify-center min-h-[calc(100vh-60px)] px-8 py-16"
          id="home"
        >
          
        </section>
      </div>
    </div>
  )
}