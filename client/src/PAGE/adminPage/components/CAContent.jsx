import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';
import { API_URL } from '../../../api.js';

export default function CAContent() {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("TRAINER");
  const [isPasswordMatch, setIsPasswordMatch] = useState(null);
  const [notice, setNotice] = useState("");
  const [isNotice, setIsNotice] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  let shades = ['200', '300', '400', '500', '600', '700', '800'];
  let colors = ['red', 'yellow', 'green', 'orange', 'blue', 'purple', 'pink'];
  let setColor = "";
  let setShade = "";

  function random() {
    let randIdx = Math.round(Math.random() * 6);
    setColor = colors[randIdx];
    setShade = shades[randIdx];
  }

  async function fetchData(e) {
    e.preventDefault();
    random();
    if (password === confirmPassword) {
      try {
        const response = await axios.post(`${API_URL}/admin/registeraccount`,
          { firstName, surname, contactNo, username, password, role, color: setColor, shade: setShade },
          { withCredentials: true });

        if (response.data.error === "Email already exists. Try logging in.") {
          setContactNo("");
          setNotice('Email already exists.');
          setIsCreated(false);
          setIsNotice(true);
        } else if (response.data.error === "Username already exists. Try logging in.") {
          setUsername("");
          setNotice("Username already exists.");
          setIsNotice(true);
          setIsCreated(false);
        } else {
          setFirstName("");
          setContactNo("");
          setSurname("");
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setIsPasswordMatch(false);
          setIsCreated(true);
          setIsNotice(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsPasswordMatch(true);
      setPassword("");
      setConfirmPassword("");
    }
  }

  // Input Class Helper to match Trainer Design
  const inputClass = "w-full h-11 rounded-xl px-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 text-slate-700 dark:text-slate-200 placeholder:text-slate-400";
  const labelClass = "text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1.5";

  return (
    <div className="w-full">
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 relative overflow-hidden">
        
        {/* Status Messages */}
        {isCreated && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
            Account Created Successfully
          </div>
        )}
        {isNotice && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wider">
            {notice}
          </div>
        )}

        <form onSubmit={fetchData} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="flex flex-col">
            <label className={labelClass}>First Name</label>
            <input className={inputClass} type="text" placeholder="John" required onChange={(e) => setFirstName(e.target.value)} value={firstName} />
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Surname</label>
            <input className={inputClass} type="text" placeholder="Doe" required onChange={(e) => setSurname(e.target.value)} value={surname} />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className={labelClass}>Email Address</label>
            <input className={inputClass} type="email" placeholder="email@example.com" required onChange={(e) => setContactNo(e.target.value)} value={contactNo} />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className={labelClass}>Username</label>
            <input className={inputClass} type="text" placeholder="johndoe123" required onChange={(e) => setUsername(e.target.value)} value={username} />
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>
              Password {isPasswordMatch && <span className="text-red-500">*</span>}
            </label>
            <input className={inputClass} type="password" placeholder="••••••••" required onChange={(e) => setPassword(e.target.value)} value={password} />
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>
              Confirm Password {isPasswordMatch && <span className="text-red-500">*</span>}
            </label>
            <input className={inputClass} type="password" placeholder="••••••••" required onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
          </div>

          {/* Role Selection - Styled to match Trainer UI card look */}
          <div className="md:col-span-2 p-5 mt-2 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50">
            <FormControl>
              <FormLabel className="!text-[11px] !font-black !text-emerald-600 dark:!text-emerald-500 !uppercase !tracking-widest !mb-3">Assign System Role</FormLabel>
              <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)}>
                <FormControlLabel value="TRAINER" control={<Radio sx={{ color: "#10b981", '&.Mui-checked': { color: "#059669" }}} />} 
                  label={<span className="text-sm font-bold text-slate-600 dark:text-slate-300">Trainer</span>} 
                />
                <FormControlLabel value="TRAINEE" control={<Radio sx={{ color: "#10b981", '&.Mui-checked': { color: "#059669" }}} />} 
                  label={<span className="text-sm font-bold text-slate-600 dark:text-slate-300">Trainee</span>} 
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Submit Button - Emerald Theme */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-10 h-12 rounded-xl font-black text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none transition-all duration-300 active:scale-95"
            >
              Register Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}