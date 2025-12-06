import React from 'react'
import Navbar from './Navbar'

export default function content() {
  return (
    <div>
      <div className="relative min-h-screen">
        <img
          src="/images/plrmo-office.png"
          alt="Background"
          className="absolute w-full h-full object-cover z-0"
        />

        <nav className="relative z-[100] grid items-center px-12 py-3 bg-transparent h-[60px] grid-cols-[1fr_auto_1fr] md:px-6">
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
          <div className="flex gap-8 justify-center justify-self-center md:flex-wrap md:gap-4">
            {["Home", "Features", "FAQs", "About Us"].map((item, idx) => (
              <a
                key={idx}
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className="text-white font-semibold text-[15px] relative py-2 transition-all duration-300 hover:text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full md:text-sm"
                style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* RIGHT: LOGIN BUTTON */}
          <div className="justify-self-end">
            <Navbar />
          </div>
        </nav>

        {/* Hero Section */}
        <section
          className="relative z-10 flex items-center justify-center min-h-[calc(100vh-60px)] px-8 py-16"
          id="home"
        >
          <div className="text-center max-w-[800px] bg-white/95 p-12 rounded-3xl shadow-2xl">
            <h1 className="text-[3.5rem] font-extrabold text-gray-800 mb-6 leading-tight md:text-[2.5rem] sm:text-[2rem]">
              Unlock Your
              <br />
              Professional Potential
            </h1>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              Level up with community-powered learning with PLRMO. Join in-person or virtual events around the world, and access endless tools to become a go-to-market leader.
            </p>
            <a
              href="#features"
              className="inline-flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:bg-primary-dark hover:-translate-y-1 hover:shadow-2xl"
            >
              Enroll Now <span>→</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
