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
  const [role, setRole] = useState("");
  const [isAccountCreated, setAccountCreated] = useState(false)
  const [isMouseOver, setMouseOver] = useState(false)

  async function fetchData(e){
    
    e.preventDefault();
    try{
      const response = await axios.post(`${API_URL}/admin/registeraccount`,
        { firstName: firstName, surname: surname, contactNo:contactNo , username: username , password: password, role: role },
        {withCredentials: true})
        
      setAccountCreated(response.data.success)
      
    } catch (error) {
      setAccountCreated(false)
      console.log(error)
    }
  }
  return (
    <div className='grid place-items-center m-3 '>
      <div className='w-260 h-150 bg-white'>
        <div className='grid place-items-center m-10 '>
          {isAccountCreated?<p>Account Created</p>:<form action="" className=' flex  flex-wrap '>
                <label htmlFor="">First Name</label>
                <input 
                className=' w-full h-10 text-2xl bg-green-500 rounded p-1'
                type="text" 
                name='first_name'
                placeholder='FirstName'
                onChange={(e)=>{setFirstName(e.target.value)}}/>

                <label htmlFor="">Surname</label>

                <input 
                className=' w-full h-10 text-2xl bg-green-500 rounded p-1 '
                type="text" 
                name='surname'
                placeholder='Surname'
                onChange={(e)=>{setSurname(e.target.value)}}/>

                <label htmlFor="">Contact No</label>

                <input 
                className=' w-full h-10 text-2xl bg-green-500 rounded p-1 '
                type="text" 
                name='surname'
                placeholder='Contact No'
                onChange={(e)=>{setContactNo(e.target.value)}}/>

                <label htmlFor="">Username</label>
                <input 
                className=' w-full h-10 text-2xl bg-green-500 rounded p-1'
                type="text" 
                name="username" 
                placeholder='username'
                onChange={(e)=>{setUsername(e.target.value)}}/>

                <label htmlFor="">Password</label>
                <input 
                className=' w-full h-10 text-2xl bg-green-500 rounded p-1'
                type="text" 
                name="Password"
                placeholder='Password' 
                onChange={(e)=>{setPassword(e.target.value)}}/>
              <div className=' w-full  text-2xl border-4 border-green-500 rounded-lg p-2 mt-4'>

              
                <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label "
                    defaultValue="female"
                    name="radio-buttons-group"
                    onChange={(e)=>{setRole(e.target.value)}}
                >

                    <FormControlLabel value="TRAINER" control={<Radio />} label="Trainer" />
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
                
                
            </form>}
        </div>
      </div>
    </div>
  )
}
