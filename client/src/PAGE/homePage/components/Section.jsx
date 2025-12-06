import React from 'react'

export default function Section() {
  return (
    <div>
      <section className="py-24 bg-white" id="empowering">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-[2.75rem] font-extrabold text-gray-800 mb-6 leading-tight md:text-[2rem]">
              Empowering Lives Through <span className="text-primary">Community Learning</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              E-Kabuhayan LMS provides accessible, quality training for Barangay San Isidro residents to develop skills and improve livelihoods.
            </p>
            <div className="flex gap-4 flex-wrap md:flex-col">
              <a
                href="./login-page.html"
                className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-lg font-semibold transition-all hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg md:w-full md:justify-center"
              >
                Enroll Now <span>→</span>
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 bg-transparent text-primary px-7 py-3.5 rounded-lg font-semibold transition-all border-2 border-primary hover:bg-primary hover:text-white md:w-full md:justify-center"
              >
                Learn More <span>→</span>
              </a>
            </div>
          </div>
          <div className="relative flex items-center justify-center gap-4">
            <button
              onClick={() => console.log("prev clicked")}
              className="bg-white border-0 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer text-2xl text-primary shadow-md transition-all flex-shrink-0 hover:bg-primary hover:text-white hover:scale-110"
              aria-label="Previous image"
            >
              ⟨
            </button>
            <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl">
              <img
                id="program-img"
                src="/images/program-course-1.jpg"
                alt="Program"
                className="w-full h-[400px] object-cover block md:h-[250px]"
              />
            </div>
            <button
              onClick={() => console.log("next clicked")}
              className="bg-white border-0 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer text-2xl text-primary shadow-md transition-all flex-shrink-0 hover:bg-primary hover:text-white hover:scale-110"
              aria-label="Next image"
            >
              ⟩
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
