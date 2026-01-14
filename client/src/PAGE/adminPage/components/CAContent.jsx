
import React, { useState } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios'
import { API_URL } from '../../../api.js';

export default function CAContent() {

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("TRAINER");
  const [isAccountCreated, setAccountCreated] = useState(false)
  const [isMouseOver, setMouseOver] = useState(false)
  const [isPasswordMatch, setIsPasswordMatch] = useState(null)
  //const [color, setcolor] = useState({color:null, shade:null})
  let shades = ['200', '300', '400', '500', '600', '700', '800']
  let colors = ['red', 'yellow', 'green', 'orange', 'blue', 'purple', 'pink']
  let setColor = ""
  let setShade = ""
  function random() {

    let random = Math.round(Math.random() * 6)
    setColor = colors[random]
    setShade = shades[random]
    //setcolor({color:colors[random], shade:shades[random]})
  }

  async function fetchData(e) {
    e.preventDefault();
    random()
    if (password === confirmPassword) {
      try {
        const response = await axios.post(`${API_URL}/admin/registeraccount`,
          { firstName: firstName, surname: surname, contactNo: contactNo, username: username, password: password, role: role, color: setColor, shade: setShade },
          { withCredentials: true })

        setAccountCreated(response.data.success)
        setFirstName("")
        setSurname("")
        setUsername("")
        setContactNo("")
        setPassword("")
        setConfirmPassword("")
        setIsPasswordMatch(false)

      } catch (error) {
        setAccountCreated(false)
        console.log(error)
      }

    } else {
      setIsPasswordMatch(true)
      setPassword("")
      setConfirmPassword("")
    }

  }
  return (
    <div className="grid place-items-center p-4">
      <div
        className="
      w-full max-w-6xl
      rounded-2xl
      bg-white/20
      backdrop-blur-xl
      border border-white/20
      shadow-xl
      p-6
    "
      >
        {isAccountCreated && (
          <p className="mb-4 text-center text-green-600 font-semibold">
            Account Created
          </p>
        )}

        <form className="flex flex-wrap">

          {/* First Name */}
          <div className="flex flex-col w-full sm:w-1/2 p-2">
            <label className="text-sm font-medium text-[#2D4F2B]">First Name</label>
            <input
              className="
            w-full h-10
            rounded-md px-3
            bg-white/70
            border border-white/30
            focus:outline-none focus:ring-2 focus:ring-[#2D4F2B]
          "
              type="text"
              placeholder="First Name"
              required
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </div>

          {/* Surname */}
          <div className="flex flex-col w-full sm:w-1/2 p-2">
            <label className="text-sm font-medium text-[#2D4F2B]">Surname</label>
            <input
              className="
            w-full h-10
            rounded-md px-3
            bg-white/70
            border border-white/30
            focus:outline-none focus:ring-2 focus:ring-[#2D4F2B]
          "
              type="text"
              placeholder="Surname"
              required
              onChange={(e) => setSurname(e.target.value)}
              value={surname}
            />
          </div>

          {/* Contact */}
          <div className="flex flex-col w-full p-2">
            <label className="text-sm font-medium text-[#2D4F2B]">Contact No</label>
            <input
              className="
            w-full h-10
            rounded-md px-3
            bg-white/70
            border border-white/30
            focus:outline-none focus:ring-2 focus:ring-[#2D4F2B]
          "
              type="text"
              placeholder="Contact No"
              required
              onChange={(e) => setContactNo(e.target.value)}
              value={contactNo}
            />
          </div>

          {/* Username */}
          <div className="flex flex-col w-full p-2">
            <label className="text-sm font-medium text-[#2D4F2B]">Username</label>
            <input
              className="
            w-full h-10
            rounded-md px-3
            bg-white/70
            border border-white/30
            focus:outline-none focus:ring-2 focus:ring-[#2D4F2B]
          "
              placeholder="Username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col w-full sm:w-1/2 p-2">
            <label className="text-sm font-medium text-[#2D4F2B]">
              Password {isPasswordMatch && <span className="text-red-500">*</span>}
            </label>
            <input
              className="
            w-full h-10
            rounded-md px-3
            bg-white/70
            border border-white/30
            focus:outline-none focus:ring-2 focus:ring-[#2D4F2B]
          "
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col w-full sm:w-1/2 p-2">
            <label className="text-sm font-medium text-[#2D4F2B]">
              Confirm Password {isPasswordMatch && <span className="text-red-500">*</span>}
            </label>
            <input
              className="
            w-full h-10
            rounded-md px-3
            bg-white/70
            border border-white/30
            focus:outline-none focus:ring-2 focus:ring-[#2D4F2B]
          "
              type="password"
              placeholder="Confirm Password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>

          {/* Role */}
          <div className="w-full p-4 mt-4 rounded-xl bg-white/30 border border-white/20">
            <FormControl>
              <FormLabel className="text-[#2D4F2B] font-medium">Role</FormLabel>
              <RadioGroup
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <FormControlLabel value="TRAINER" control={<Radio sx={{
                  color: "#2D4F2B",
                  "&.Mui-checked": {
                    color: "#2D4F2B",
                  },
                }} />} label="Trainer" />
                <FormControlLabel value="TRAINEE" control={<Radio sx={{
                  color: "#2D4F2B",
                  "&.Mui-checked": {
                    color: "#2D4F2B",
                  },
                }} />} label="Trainee" />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Submit */}
          <div className="w-full flex justify-center mt-6">
            <button
              className="
            w-52 h-11
            rounded-xl
            font-semibold
            bg-[#2D4F2B]
            text-white
            hover:bg-[#708A58]
            transition
          "
              onClick={fetchData}
            >
              SUBMIT
            </button>
          </div>

        </form>
      </div>
    </div>

  )
}