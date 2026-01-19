import React from 'react'

export default function About() {
  return (
    <div>
        {/* About */}
          <section id="aboutus" className="py-24 bg-[#F1F3E0]">
            <div className="max-w-[1200px] mx-auto px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Content */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D4F2B] mb-6">
                    About E-Kabuhayan
                  </h2>
                  <p className="text-gray-500 mb-4">
                    E-Kabuhayan is a community-based learning management system designed for Barangay San Isidro. Our mission is to provide accessible, quality training that empowers residents to develop practical skills and improve their livelihoods.
                  </p>
                  <p className="text-gray-500 mb-6">
                    Our platform connects trainees with skilled trainers who share their expertise and guide learners through comprehensive modules across various industries and skill sets.
                  </p>

                  <ul className="space-y-4">
                    {[
                      "Industry-relevant skills development for immediate application",
                      "Community-focused approach with local trainers and relevant content",
                    
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-primary mt-1 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <span className="text-gray-500">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* plrmo image */}
                <div>
                  <img
                    src="/images/plrmo-office.png"
                    alt="Team collaboration"
                    className="rounded-2xl shadow-2xl w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

            {/* Footer */}
            <footer className="bg-[#2D4F2B] text-green-100 py-8">
              <div className="max-w-5xl mx-auto px-4 lg:px-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                  
                  {/* e-kabuhayan info */}
                  <div className="space-y-2">
                    <div className="justify-center gap-2 text-sm font-semibold text-white">
                      <i className="fas fa-book-open"></i>
                     <h3 className="text-[#F1F3E0] font-semibold text-sm mb-1">E-Kabuhayan</h3>
                    </div>
                    <p className="text-[#F1F3E0]/90 text-sm">
                      Empowering communities through accessible, quality skills training and lifelong learning opportunities.
                    </p>
                  </div>

                  {/* links */}
                  <div>
                    <h3 className="text-[#F1F3E0] font-semibold text-sm mb-2">Quick Links</h3>
                    <ul className="space-y-1 text-[#F1F3E0]/90 text-sm">
                      {["Home", "Features", "Success Stories", "FAQs", "About Us"].map((link, idx) => (
                        <li key={idx}>
                          <a
                            href={`#${link.toLowerCase().replace(" ", "")}`}
                            className="hover:text-white transition-colors"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* courses */}
                  <div>
                    <h3 className="text-[#F1F3E0] font-semibold text-sm mb-2">Programs</h3>
                    <ul className="space-y-1 text-[#F1F3E0]/90 text-sm">
                      {["Food Processing", "Pastry Making", "Dressmaking", "Electrical Work", "Handicrafts"].map((program, idx) => (
                        <li key={idx}>
                          <a href="#" className="hover:text-white transition-colors">{program}</a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* contact */}
                  <div>
                    <h3 className="text-[#F1F3E0] font-semibold text-sm mb-2">Contact</h3>
                    <ul className="space-y-1 text-[#F1F3E0]/90 text-sm">
                      <li className="flex items-center gap-2">
                        <i className="fas fa-phone"></i>
                        <span>(123) 456-7890</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fas fa-envelope"></i>
                        <span>ekabuhayanlms@gmail.com</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Barangay San Isidro, Parañaque City</span>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* copyright */}
                <div className="text-center font-semibold text-[#F1F3E0] text-sm">
                  &copy; 2025 E-Kabuhayan LMS. All rights reserved. Powered by PLRMO.
                </div>

              </div>
            </footer>
      
    </div>
  )
}