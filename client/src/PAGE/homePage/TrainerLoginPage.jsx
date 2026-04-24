import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api.js";

export default function TrainerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `${API_URL}/trainer/login`,
        { username: email, password: password },
        { withCredentials: true }
      );
      if (res.data.redirectTo) {
        navigate(res.data.redirectTo);
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-white">
      
      {/* LEFT SIDE: Brand & Hero (Matching the Set) */}
      <div className={`hidden lg:flex flex-col justify-between w-1/2 bg-[#2D4F2B] relative overflow-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Background School Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/plmro.jpg" 
            alt="School Campus" 
            className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${isLoaded ? 'scale-100 opacity-30' : 'scale-110 opacity-0'}`}
          />
          <div className="absolute inset-0 bg-[#2D4F2B]/50" />
        </div>

        {/* Top Branding */}
        <div className={`relative z-10 p-10 flex justify-between items-center transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex items-center gap-2">
            <img src="/images/logo2.gif" alt="Logo" className="h-10 w-auto" />
            <span className="tracking-widest font-bold text-[#FFF1CA] uppercase text-xl">E-Kabuhayan</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 px-16 flex flex-col items-center flex-grow justify-center">
          <h1 className={`text-4xl font-bold text-[#FFF1CA] leading-tight mb-12 self-start transition-all duration-700 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            Empowering the next generation of skilled professionals.
          </h1>
          
          <div className={`relative w-full max-w-sm h-[45vh] overflow-hidden rounded-2xl shadow-2xl border-4 border-[#FFF1CA]/20 transition-all duration-1000 delay-700 ${isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop" 
              alt="Trainer leading a session" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 p-10 flex gap-4 text-xs text-[#FFF1CA]/60">
          <Link to="#" className="hover:text-[#FFF1CA]">Terms of service</Link>
          <span>|</span>
          <Link to="#" className="hover:text-[#FFF1CA]">Privacy policy</Link>
        </div>
      </div>

      {/* RIGHT SIDE: Trainer Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-12 relative overflow-y-auto">
        
        <div className={`max-w-md w-full transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <h2 className="text-4xl font-extrabold text-[#2D4F2B] mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-500 mb-10 font-medium">Please enter your trainer credentials.</p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 animate-pulse">
              <p className="text-red-700 text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            
            {/* Username/Email Input */}
            <div className="relative flex flex-row items-center w-full">
              <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                required
                placeholder=" "
                type="text"
                className="peer rounded-xl text-[#2D4F2B] pl-4 h-[50px] w-full border-2 border-solid border-gray-200 bg-gray-50 outline-0 focus:border-[#2D4F2B] focus:bg-white transition-all duration-200"
              />
              <label className="absolute left-4 text-gray-400 font-bold pointer-events-none duration-300 transform -translate-y-0 scale-100 peer-focus:-translate-y-10 peer-focus:scale-90 peer-focus:text-[#2D4F2B] peer-[:not(:placeholder-shown)]:-translate-y-10 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:text-[#2D4F2B]">
                Username
              </label>
            </div>

            {/* Password Input */}
            <div className="relative flex flex-row items-center w-full">
              <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                required
                placeholder=" "
                type="password"
                className="peer rounded-xl text-[#2D4F2B] pl-4 h-[50px] w-full border-2 border-solid border-gray-200 bg-gray-50 outline-0 focus:border-[#2D4F2B] focus:bg-white transition-all duration-200"
              />
              <label className="absolute left-4 text-gray-400 font-bold pointer-events-none duration-300 transform -translate-y-0 scale-100 peer-focus:-translate-y-10 peer-focus:scale-90 peer-focus:text-[#2D4F2B] peer-[:not(:placeholder-shown)]:-translate-y-10 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:text-[#2D4F2B]">
                Password
              </label>
            </div>

            <div className="flex justify-end">
              <button 
                type="button"
                onClick={() => navigate('/trainer/ForgetPassword')}
                className="text-sm font-bold text-[#2D4F2B] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-[#FFF1CA] bg-[#2D4F2B] hover:bg-[#1e361d] shadow-lg transition-all active:scale-[0.98]"
            >
              LOG IN AS TRAINER
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link to="/role" className="text-sm font-bold text-[#FFB823] hover:underline">
               ← BACK TO ROLE SELECTION
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}