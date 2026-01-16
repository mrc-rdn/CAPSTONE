import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../api";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if(confirmPassword === password){
        await axios.post(
      `${API_URL}/reset-password/${token}`,
      { password }
    );
    alert("Password changed successfully");
    navigate('/role')
    }else{
      setConfirmPassword("")
    }
    
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* BACKGROUND */}
      <img
        src="/images/plmro.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-md"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="relative w-full max-w-[420px] h-[420px] rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-10">

            <img
              src="/images/logo2.gif"
              alt="Logo"
              className="h-20 mb-4"
            />


      <h2 className="text-2xl font-bold text-[#FFF1CA] mb-2">Reset Password</h2>
      <input
        type="Password"
       className="
                w-full h-12 px-4
                rounded-xl
                bg-white/80
                text-gray-800
                placeholder-gray-500
                outline-none
                focus:ring-2 focus:ring-yellow-400
                mb-5
              "
        placeholder="New Password"
        onChange={e => setPassword(e.target.value)}
      />
      <input
        type="password"
       className="
                w-full h-12 px-4
                rounded-xl
                bg-white/80
                text-gray-800
                placeholder-gray-500
                outline-none
                focus:ring-2 focus:ring-yellow-400
              "
        placeholder="Confirm Password"
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <button
        onClick={submit}
        className="
                w-full h-12 mt-6
                bg-[#FFF1CA]
                rounded-xl
                font-semibold
                text-[#2D4F2B]
                hover:bg-[#ffe7a3]
                transition
              "
      >
        Reset Password
      </button>
       </div>
        </div>
      </div>
    </div>
  );
}