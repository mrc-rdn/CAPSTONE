import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RoleChoicePage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/${selectedRole}/login`);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-white">
      
      {/* LEFT SIDE: Brand & Framed Hero Image */}
      <div className={`hidden lg:flex flex-col justify-between w-1/2 bg-[#2D4F2B] relative overflow-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* 1. SCHOOL BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <img 
            src="./public/images/plmro.jpg" 
            alt="School Campus" 
            className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${isLoaded ? 'scale-100 opacity-40' : 'scale-110 opacity-0'}`}
          />
          <div className="absolute inset-0 bg-[#2D4F2B]/50" />
        </div>

        {/* 2. TOP NAV */}
        <div className={`relative z-10 p-10 flex justify-between items-center transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex items-center gap-2">
            <img src="../public/images/logo2.gif" alt="Logo" className="h-10 w-auto" />
            <span className="tracking-widest font-bold text-[#FFF1CA] uppercase text-xl">E-Kabuhayan</span>
          </div>
          <button className="border border-[#FFF1CA]/50 text-[#FFF1CA] px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#FFF1CA] hover:text-[#2D4F2B] transition-all">
            Contact us
          </button>
        </div>

        {/* 3. HERO CONTENT */}
        <div className="relative z-10 px-16 flex flex-col items-center flex-grow justify-center">
          <h1 className={`text-4xl font-bold text-[#FFF1CA] leading-tight mb-12 self-start transition-all duration-700 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            Empowering the next generation of skilled professionals.
          </h1>
          
          <div className={`relative w-full max-w-sm h-[45vh] overflow-hidden rounded-2xl shadow-2xl transition-all duration-1000 delay-700 ${isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
            <img 
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop" 
              alt="Students/Instructors" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4. FOOTER */}
        <div className="relative z-10 p-10 flex gap-4 text-xs text-[#FFF1CA]/60 mt-auto">
          <Link to="#" className="hover:text-[#FFF1CA]">Terms of service</Link>
          <span>|</span>
          <Link to="#" className="hover:text-[#FFF1CA]">Privacy policy</Link>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Logic */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8 relative">
        
        {/* Language Selector */}
        <div className={`absolute top-8 right-8 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
             <span>🌐 English</span>
             <span className="text-[10px]">▼</span>
          </button>
        </div>

        <div className={`max-w-md w-full transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <h2 className="text-3xl font-bold text-[#2D4F2B] mb-2">
            Welcome! Your account is ready
          </h2>
          <p className="text-gray-500 mb-8 font-medium">Let's continue to set up your profile.</p>

          <p className="font-bold text-gray-700 mb-4">
            Are you here to train (trainer) or learn (trainee)?
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* TRAINEE OPTION */}
            <button
              onClick={() => setSelectedRole("trainee")}
              className={`flex flex-col items-start p-6 border-2 rounded-2xl transition-all duration-200 ${
                selectedRole === 'trainee' 
                ? 'border-[#2D4F2B] bg-[#2D4F2B]/5 ring-1 ring-[#2D4F2B]' 
                : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border mb-3 flex items-center justify-center ${
                selectedRole === 'trainee' ? 'bg-[#2D4F2B] border-[#2D4F2B]' : 'border-gray-300'
              }`}>
                {selectedRole === 'trainee' && <span className="text-[#FFF1CA] text-xs">✓</span>}
              </div>
              <span className={`font-bold ${selectedRole === 'trainee' ? 'text-[#2D4F2B]' : 'text-gray-500'}`}>Trainee</span>
            </button>

            {/* TRAINER OPTION */}
            <button
              onClick={() => setSelectedRole("trainer")}
              className={`flex flex-col items-start p-6 border-2 rounded-2xl transition-all duration-200 ${
                selectedRole === 'trainer' 
                ? 'border-[#2D4F2B] bg-[#2D4F2B]/5 ring-1 ring-[#2D4F2B]' 
                : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border mb-3 flex items-center justify-center ${
                selectedRole === 'trainer' ? 'bg-[#2D4F2B] border-[#2D4F2B]' : 'border-gray-300'
              }`}>
                {selectedRole === 'trainer' && <span className="text-[#FFF1CA] text-xs">✓</span>}
              </div>
              <span className={`font-bold ${selectedRole === 'trainer' ? 'text-[#2D4F2B]' : 'text-gray-500'}`}>Trainer</span>
            </button>
          </div>

          <button
            disabled={!selectedRole}
            onClick={handleContinue}
            className={`w-full py-4 rounded-xl font-bold text-[#FFF1CA] transition-all shadow-lg ${
              selectedRole 
              ? 'bg-[#2D4F2B] hover:bg-[#1e361d] cursor-pointer' 
              : 'bg-gray-300 cursor-not-allowed shadow-none'
            }`}
          >
            CONTINUE
          </button>

          <div className="mt-8 text-center">
            <button className="text-[#FFB823] font-bold hover:underline">
              <Link to="/">BACK TO HOME</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}