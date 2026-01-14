import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api.js";

export default function TrainerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/trainer/login`,
        {
          username: email,
          password: password,
        },
        { withCredentials: true }
      );

      if (res.data.redirectTo) {
        navigate(res.data.redirectTo);
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error(err);
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* BLURRED BACKGROUND */}
      <img
        src="/images/plmro.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-md"
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* CENTER CONTENT */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">

        {/* CARD */}
        <div
          className="
            relative
            w-full max-w-[500px]
            h-[550px]
            rounded-2xl
            overflow-hidden
            shadow-2xl
          "
        >
          {/* CARD OVERLAY */}
          <div className="absolute inset-0 bg-black/40" />

          {/* CONTENT */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-10">

            {/* LOGO */}
            <img
              src="/images/logo2.gif"
              alt="Logo"
              className="h-24 mb-4"
            />

            <h1 className="text-3xl font-bold text-[#FFF1CA] mb-2">
              Welcome back!
            </h1>

            <p className="text-[#FFF1CA] mb-13">
              Trainer Login
            </p>

            {error && (
              <p className="text-red-300 text-sm mb-4 text-center absolute top-55">
                {error}
              </p>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">

              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full h-12 px-4
                  rounded-xl
                  border border-gray-300
                  focus:outline-none
                  focus:ring-2 focus:ring-yellow-400
                "
                
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full h-12 px-4
                  rounded-xl
                  border border-gray-300
                  focus:outline-none
                  focus:ring-2 focus:ring-yellow-400
                "
                
              />
            <button className="" onClick={()=>{navigate('/trainer/ForgetPassword')}}>Forget Password</button>  
              <button
                type="submit"
                className="
                  w-full h-12
                  bg-[#FFF1CA]
                  rounded-xl
                  font-semibold
                  text-[#2D4F2B]
                  hover:bg-[#ffe7a3]
                  transition
                "
              >
                LOG IN
              </button>
            </form>

            <button className="mt-6 text-[#FFB823]/80 font-bold">
              <Link to="/">BACK</Link>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}