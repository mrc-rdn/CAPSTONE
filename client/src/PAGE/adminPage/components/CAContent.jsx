import React, {useState} from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios'
import { API_URL } from '../../../api.js';

export default function CAContent() {

  const [firstName , setFirstName] = useState("");
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
  let shades = ['200','300','400','500','600','700','800']
  let colors = ['red','yellow','green','orange', 'blue', 'purple', 'pink']
  let setColor = ""
  let setShade = ""
  function random (){
      
    let random = Math.round(Math.random() * 6)
    setColor = colors[random]
    setShade = shades[random]
    //setcolor({color:colors[random], shade:shades[random]})
  }

  async function fetchData(e){
    e.preventDefault();
    random()
    if(password === confirmPassword){
      try{
        const response = await axios.post(`${API_URL}/admin/registeraccount`,
          { firstName: firstName, surname: surname, contactNo:contactNo , username: username , password: password, role: role, color:setColor, shade:setShade },
          {withCredentials: true})
          
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

    }else{
      setIsPasswordMatch(true)
      setPassword("")
      setConfirmPassword("")
    }
    
  }
  return (
    <div className='grid place-items-center m-3 '>
      <div className='w-260 h-150 bg-white rounded-lg'>
        <div className='grid place-items-center m-10 '>
          {isAccountCreated?<p>Account Created</p>:null}
          <form action="" className=' flex  flex-wrap  '>
            <div className='flex flex-col w-6/12 p-2'>

            
              <label htmlFor="">First Name</label>
              <input 
              className=' w-full h-8 text-lg bg-green-600 rounded p-1 m-1'
              type="text" 
              name='first_name'
              placeholder='FirstName'
              required
              onChange={(e)=>{setFirstName(e.target.value)}}
              value={firstName}/>
            </div>
            <div className='flex flex-col w-6/12 p-2'>
              <label htmlFor="">Surname</label>

              <input 
              className='  w-full h-8 text-lg bg-green-600 rounded p-1 m-1'
              type="text" 
              name='surname'
              placeholder='Surname'
              required
              onChange={(e)=>{setSurname(e.target.value)}}
              value={surname}/>
            </div>
              
            <div className='flex flex-col w-full p-2'>
              <label htmlFor="">Contact No</label>

              <input 
              className=' w-full h-8 text-lg bg-green-600 rounded p-1 m-1'
              type="text" 
              name='surname'
              placeholder='Contact No'
              required
              onChange={(e)=>{setContactNo(e.target.value)}}
              value={contactNo}/>
            </div>
              
            <div className='flex flex-col w-full p-2'>
              <label htmlFor="">Username</label>
              <input 
              className=' w-full h-8 text-lg bg-green-600 rounded p-1 m-1'
              type="text" 
              name="username" 
              placeholder='username'
              required
              onChange={(e)=>{setUsername(e.target.value)}}
              value={username}/>

            </div>
              
              <div className='flex flex-col w-6/12 p-2'>
                <label htmlFor="">Password {isPasswordMatch?<span className='text-red-500'>*</span>:null}</label>
                <input 
                className=' w-full h-8 text-lg bg-green-600 rounded p-1 m-1'
                type="text" 
                name="Password"
                placeholder='Password' 
                required
                onChange={(e)=>{setPassword(e.target.value)}}
                value={password}/>
              </div>
            
            <div className='flex flex-col w-6/12 p-2'>
                  <label htmlFor="">Confirm Password {isPasswordMatch?<span className='text-red-500'>*</span>:null}</label>
                  <input 
                  className=' w-full h-8 text-lg bg-green-600 rounded p-1 m-1'
                  type="text" 
                  name="Password"
                  placeholder='Confirm Password'
                  required
                  onChange={(e)=>{setConfirmPassword(e.target.value)}}
                  value={confirmPassword}/>
              </div>
              
            <div className=' w-full  text-2xl border-4 border-green-600 rounded-lg p-2 mt-4'>

            
              <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
              <RadioGroup
              className=''
                  aria-labelledby="demo-radio-buttons-group-label "
                  defaultValue="female"
                  name="radio-buttons-group"
                  required
                  value={role}
                  onChange={(e)=>{setRole(e.target.value)}}
              >

                  <FormControlLabel  value="TRAINER" control={<Radio />} label="Trainer" />
                  <FormControlLabel value="TRAINEE" control={<Radio />} label="Trainee" />
                  
              </RadioGroup>
              </FormControl>
            </div>
              <div className='w-full flex justify-center'>
                <button 
                className={isMouseOver?'m-3 w-50 h-10 text-2xl text-green-500 bg-white border-2  rounded':'m-3 w-50 h-10 text-2xl text-white bg-green-500 rounded' }
                onMouseOver={()=> setMouseOver(true)}
                onMouseOut={()=> setMouseOver(false)}
                onClick={fetchData}>SUBMIT</button>
              </div>
                
                
          </form>
        </div>
      </div>
    </div>
  )
}
