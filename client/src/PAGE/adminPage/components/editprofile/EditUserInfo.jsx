import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../../api.js';
import axios from 'axios';
import CreateIcon from '@mui/icons-material/Create';
import { Link } from 'react-router-dom';

export default function EditUserInfo(props) {
    const { data } = props;
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [picture, setPicture] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdateProfile, setUpdateProfile] = useState(false);
    const [isPasswordMatch, setIsPasswordMatch] = useState(null);
    const [notice, setNotice] = useState("");
    const [isNotice, setIsNotice] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!props.data) return;
        setFirstName(data.first_name ?? "");
        setSurname(data.surname ?? "");
        setContactNo(data.email ?? "");
        setUsername(props.username ?? "");
        setPicture(data.profile_pic ?? "");
    }, [props.data, props.username]);

    const sendData = async (e) => {
        e.preventDefault();
        if (!contactNo) { setError("This field is required"); return; }
        if (!contactNo.endsWith("@gmail.com")) { setError("Email is not valid"); return; }

        if (password === confirmPassword) {
            try {
                const res = await axios.post(`${API_URL}/admin/edituserinfo`, { firstName, surname, contactNo, password }, { withCredentials: true });
                if (res.data.error) {
                    setIsNotice(true);
                    setNotice(res.data.error);
                    setUpdateProfile(false);
                } else {
                    setUpdateProfile(true);
                    setIsNotice(false);
                    setError("");
                    setPassword("");
                    setConfirmPassword("");
                }
            } catch (err) {
                setError("An error occurred during update.");
            }
        } else {
            setIsPasswordMatch(true);
        }
    };

    const userColorClass = 'bg-[#2D4F2B]'; // Fixed admin brand color

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-all duration-300">
                
                {/* Header Banner - Admin Dark Green */}
                <div className="h-32 bg-gradient-to-r from-[#2D4F2B] to-[#1e361d] p-8 flex items-end">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Admin Management</h2>
                </div>

                <div className="p-8 md:p-12 -mt-12">
                    <form className="space-y-8" onSubmit={sendData}>
                        
                        {/* Profile Picture Overlay */}
                        <div className="flex flex-col items-center sm:items-start mb-8">
                            <div className="relative group cursor-pointer" onClick={() => props.handleUploadProfile()}>
                                {picture ? (
                                    <img src={picture} alt="Profile" className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white dark:border-slate-900 shadow-2xl transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className={`w-32 h-32 rounded-[2.5rem] flex text-5xl font-black items-center justify-center text-white border-4 border-white dark:border-slate-900 shadow-2xl ${userColorClass} transition-transform group-hover:scale-105`}>
                                        {firstName.slice(0, 1).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 text-[#2D4F2B] w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-700 group-hover:rotate-12 transition-transform">
                                    <CreateIcon fontSize="small" />
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {(isUpdateProfile || isNotice || error) && (
                            <div className={`p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] border animate-pulse ${
                                isUpdateProfile ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400'
                            }`}>
                                {isUpdateProfile ? "Admin Settings Updated Successfully" : (notice || error)}
                            </div>
                        )}

                        {/* Grid Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                                <input className="w-full h-12 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-[#2D4F2B] outline-none transition-all" 
                                type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Surname</label>
                                <input className="w-full h-12 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-[#2D4F2B] outline-none transition-all" 
                                type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                <input className="w-full h-12 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-[#2D4F2B] outline-none transition-all" 
                                type="email" value={contactNo} onChange={(e) => setContactNo(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Username</label>
                                <input className="w-full h-12 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-sm font-bold text-slate-400 dark:text-slate-600 cursor-not-allowed outline-none" 
                                type="text" disabled value={username} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#2D4F2B] uppercase tracking-widest ml-1">Security Status</label>
                                <div className="h-12 flex items-center px-5 bg-[#2D4F2B]/5 dark:bg-[#2D4F2B]/10 rounded-2xl border border-[#2D4F2B]/10">
                                    <p className="text-[10px] font-black text-[#2D4F2B] dark:text-emerald-400 uppercase">Administrator Authorization Active</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                                <input className="w-full h-12 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-[#2D4F2B] outline-none transition-all" 
                                type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                                <input className="w-full h-12 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-[#2D4F2B] outline-none transition-all" 
                                type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-slate-100 dark:border-slate-800 gap-4">
                            <Link to="/admin/dashboard" className="text-[10px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-[0.2em] transition-colors">
                                Return to Dashboard
                            </Link>

                            <button
                                type="submit"
                                className="w-full sm:w-auto px-12 h-14 bg-[#2D4F2B] text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-[#2D4F2B]/20 dark:shadow-none hover:bg-[#1e361d] active:scale-95 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}