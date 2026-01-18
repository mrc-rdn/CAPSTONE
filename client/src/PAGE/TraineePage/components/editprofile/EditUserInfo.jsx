import React, { useState, useEffect } from 'react'
import { API_URL } from '../../../../api.js'
import axios from 'axios';
import CreateIcon from '@mui/icons-material/Create';

import { Link } from 'react-router-dom'

export default function EditUserInfo(props) {
    let data = props.data
    const [firstName, setFirstName] = useState('')
    const [surname, setSurname] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [picture, setPicture] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isMouseOver, setMouseOver] = useState(false)
    const [isMouseOver1, setMouseOver1] = useState(false)
    const [isUpdateProfile, setUpdateProfile] = useState(false)
    const [isPasswordMatch, setIsPasswordMatch] = useState(null)


    useEffect(() => {
        if (!props.data) return
        setFirstName(data.first_name ?? "")
        setSurname(data.surname ?? "")
        setContactNo(data.email ?? "")
        setUsername(props.username ?? "")
        setPicture(data.profile_pic ?? "")
    }, [props.data, props.username])

    const sendData = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            const res = await axios.post(`${API_URL}/trainee/edituserinfo`, { firstName, surname, contactNo, password }, { withCredentials: true })

            setIsPasswordMatch(false)
            return setUpdateProfile(res.data.success)

        } else {
            setIsPasswordMatch(true)
            setPassword("")
            setConfirmPassword("")
        }

    }
    const colorMap = {
        red: { 200: 'bg-red-200', 300: 'bg-red-300', 400: 'bg-red-400', 500: 'bg-red-500', 600: 'bg-red-600', 700: 'bg-red-700', 800: 'bg-red-800' },
        yellow: { 200: 'bg-yellow-200', 300: 'bg-yellow-300', 400: 'bg-yellow-400', 500: 'bg-yellow-500', 600: 'bg-yellow-600', 700: 'bg-yellow-700', 800: 'bg-yellow-800' },
        green: { 200: 'bg-green-200', 300: 'bg-green-300', 400: 'bg-green-400', 500: 'bg-green-500', 600: 'bg-green-600', 700: 'bg-green-700', 800: 'bg-green-800' },
        orange: { 200: 'bg-orange-200', 300: 'bg-orange-300', 400: 'bg-orange-400', 500: 'bg-orange-500', 600: 'bg-orange-600', 700: 'bg-orange-700', 800: 'bg-orange-800' },
        blue: { 200: 'bg-blue-200', 300: 'bg-blue-300', 400: 'bg-blue-400', 500: 'bg-blue-500', 600: 'bg-blue-600', 700: 'bg-blue-700', 800: 'bg-blue-800' },
        purple: { 200: 'bg-purple-200', 300: 'bg-purple-300', 400: 'bg-purple-400', 500: 'bg-purple-500', 600: 'bg-purple-600', 700: 'bg-purple-700', 800: 'bg-purple-800' },
        pink: { 200: 'bg-pink-200', 300: 'bg-pink-300', 400: 'bg-pink-400', 500: 'bg-pink-500', 600: 'bg-pink-600', 700: 'bg-pink-700', 800: 'bg-pink-800' },
    }


    const userColorClass = colorMap[data.color]?.[data.shades] || 'bg-gray-500';


    return (
        <div className="w-full text-[#2D4F2B]">

            <p className="text-xl font-semibold mb-4">Edit Profile</p>

            <div
                className="flex items-center flex-col mb-6 relative cursor-pointer"
                onClick={() => props.handleUploadProfile()}
            >

                {picture
                    ? (
                        <img
                            src={picture}
                            alt=""
                            className="w-28 h-28 rounded-full mb-3 object-cover border-4 border-white/40 shadow-md"
                        />
                    )
                    : (
                        <div
                            className={`w-28 h-28 rounded-full flex text-4xl font-semibold items-center justify-center mb-3 shadow-md ${userColorClass}`}
                        >
                            <p>{firstName.slice(0, 1)}</p>
                        </div>
                    )
                }

                <div className="absolute bottom-4 right-[42%] bg-white/70 backdrop-blur-md p-2 rounded-full shadow">
                    <CreateIcon fontSize="small" />
                </div>

                <p className="mt-2 font-medium">{firstName}</p>
            </div>

            {isUpdateProfile
                ? (
                    <p className="text-green-700 font-semibold text-center">
                        Successful Updating Profile
                    </p>
                )
                : null}

                    <form className="flex flex-wrap gap-4">

                        {/* First & Surname */}
                        <div className="flex flex-col md:flex-row w-full gap-4">
                            <div className="flex flex-col w-full md:w-1/2">
                                <label className="text-sm font-medium mb-1">First Name</label>
                                <input
                                    className="w-full h-10 text-sm bg-white/30 backdrop-blur-md border border-white/40 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    type="text"
                                    name="first_name"
                                    placeholder="First Name"
                                    onChange={(e) => { setFirstName(e.target.value) }}
                                    value={firstName}
                                />
                            </div>

                            <div className="flex flex-col w-full md:w-1/2">
                                <label className="text-sm font-medium mb-1">Surname</label>
                                <input
                                    className="w-full h-10 text-sm bg-white/30 backdrop-blur-md border border-white/40 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    type="text"
                                    name="surname"
                                    placeholder="Surname"
                                    onChange={(e) => { setSurname(e.target.value) }}
                                    value={surname}
                                />
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium mb-1">Email</label>
                            <input
                                className="w-full h-10 text-sm bg-white/30 backdrop-blur-md border border-white/40 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                                type="text"
                                placeholder="Email"
                                onChange={(e) => { setContactNo(e.target.value) }}
                                value={contactNo}
                            />
                        </div>

                        {/* Username */}
                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium mb-1">Username</label>
                            <input
                                className="w-full h-10 text-sm bg-white/20 border border-white/30 rounded-lg px-3 text-gray-500 cursor-not-allowed"
                                type="text"
                                disabled
                                value={username}
                            />
                        </div>

                        {/* Passwords */}
                        <div className="flex flex-col md:flex-row w-full gap-4">
                            <div className="flex flex-col w-full md:w-1/2">
                                <label className="text-sm font-medium mb-1">
                                    Password {isPasswordMatch && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    className="w-full h-10 text-sm bg-white/30 backdrop-blur-md border border-white/40 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    value={password}
                                />
                            </div>

                            <div className="flex flex-col w-full md:w-1/2">
                                <label className="text-sm font-medium mb-1">
                                    Confirm Password {isPasswordMatch && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    className="w-full h-10 text-sm bg-white/30 backdrop-blur-md border border-white/40 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                                    value={confirmPassword}
                                />
                            </div>
                        </div>

                        {isPasswordMatch && (
                            <p className="text-red-500 text-sm">
                                Please make sure your passwords match
                            </p>
                        )}

                        {/* Buttons */}
                        <div className="w-full flex flex-col sm:flex-row justify-center gap-4 mt-4">

                            <Link to="/trainee/dashboard">
                                <button
                                    className="px-6 h-10 rounded-lg border border-[#2D4F2B] text-[#2D4F2B] bg-white/40 backdrop-blur-md hover:bg-[#2D4F2B] hover:text-white transition"
                                >
                                    Back To Home
                                </button>
                            </Link>

                            <button
                                className="px-6 h-10 rounded-lg bg-[#2D4F2B] text-white font-semibold hover:bg-[#2D4F2B] transition"
                                onClick={sendData}
                            >
                                Save Changes
                            </button>

                        </div>

                    </form>
                
            
        </div>

    )
}