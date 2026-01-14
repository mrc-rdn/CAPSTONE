import React from 'react'


export default function SuccessStories() {
  return (
    <div>
      {/* Success stories */}
          <section id="success" className="py-24 bg-[#2D4F2B]">
          <div className="max-w-[1200px] mx-auto px-8">
          
          {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#F1F3E0] mb-4">
                Introducing Our Graduates
              </h2>
              <p className="text-[#FCF9EA] text-sm md:text-xl">
                Explore student profiles and discover the passion, achievements, and future goals of our graduating class. <br />
                Get inspired by their journeys and aspirations.
              </p>
            </div>

          {/* Graduates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Graduate 1 */}
            <div className="bg-[#F1F3E0] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
              <img
                src="/images/img1.jpg"
                alt="Maria Santos"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h4 className="font-semibold text-xl mb-1 text-[#2D4F2B]">Maria Santos</h4>
                <p className="text-[#FFB823] mb-2 text-[#FFB823] font-bold">Electrical</p>
                <p className="text-[#2D4F2B] italic">"Now running my own electrical business!"</p>
              </div>
            </div>

            {/* Graduate 2 */}
            <div className="bg-[#F1F3E0] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
              <img
                src="/images/img2.jpg"
                alt="Juan Dela Cruz"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h4 className="font-semibold text-xl mb-1 text-[#2D4F2B]">Juan Dela Cruz</h4>
                <p className=" text-[#FFB823] mb-2 text-[#FFB823] font-bold">Pastry Making</p>
                <p className="text-[#2D4F2B] italic">"Landed a job as a baker!"</p>
              </div>
            </div>

            {/* Graduate 3 */}
            <div className="bg-[#F1F3E0] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
              <img
                src="/images/img3.jpg"
                alt="Ana Reyes"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h4 className="font-semibold text-xl mb-1 text-[#2D4F2B]">Ana Reyes</h4>
                <p className="text-[#FFB823] mb-2 text-[#FFB823] font-bold">Food Processing</p>
                <p className="text-[#2D4F2B] italic">"Opened my own shop!"</p>
              </div>
            </div>

            {/* Graduate 4 */}
            <div className="bg-[#F1F3E0] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
              <img
                src="/images/img4.jpg"
                alt="Pedro Garcia"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h4 className="font-semibold text-xl mb-1 text-[#2D4F2B]">Pedro Garcia</h4>
                <p className="text-[#FFB823] mb-2 text-[#FFB823] font-bold">Hairdressing</p>
                <p className="text-[#2D4F2B] italic">"Got certified!"</p>
              </div>
            </div>

            {/* Graduate 5 */}
            <div className="bg-[#F1F3E0] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
              <img
                src="/images/img5.jpg"
                alt="Rosa Martinez"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h4 className="font-semibold text-xl mb-1 text-[#2D4F2B]">Rosa Martinez</h4>
                <p className="text-[#FFB823] mb-2 text-[#FFB823] font-bold">Beverage</p>
                <p className="text-[#2D4F2B] italic">"Selling coffee!"</p>
              </div>
            </div>

            {/* Graduate 6 */}
            <div className="bg-[#F1F3E0] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
              <img
                src="/images/img6.jpg"
                alt="Carlos Ramos"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h4 className="font-semibold text-xl mb-1 text-[#2D4F2B]">Carlos Ramos</h4>
                <p className="text-[#FFB823] mb-2 text-[#FFB823] font-bold">Mechanic</p>
                <p className="text-[#2D4F2B] italic">"Fixing cars for clients!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}