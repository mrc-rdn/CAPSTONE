import React, {useState} from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios'

export default function CAContent() {

  const [firstName , setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  async function fetchData(e){
    
    
    try{
      const response = await axios.post('http://localhost:3000/admin/registeraccount',
        { firstName: firstName, surname: surname, contactNo:contactNo , username: username , password: password, role: role },
        {withCredentials: true})
      
        
      console.log(response.data);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='grid place-items-center m-3 '>
      <div className='w-260 h-150 bg-green-500'>
        <div className='grid place-items-center m-10 '>
            <form action="" className=' flex  flex-wrap '>
                <label htmlFor="">First Name</label>
                <input 
                className='Email w-100 h-6 border-b-2 text-2xl focus:outline-none mb-5 '
                type="text" 
                name='first_name'
                placeholder='FirstName'
                onChange={(e)=>{setFirstName(e.target.value)}}/>

                <label htmlFor="">Surname</label>

                <input 
                className='Email w-100 h-6 border-b-2 text-2xl focus:outline-none mb-5 '
                type="text" 
                name='surname'
                placeholder='Surname'
                onChange={(e)=>{setSurname(e.target.value)}}/>

                <label htmlFor="">Contact No</label>

                <input 
                className='Email w-100 h-6 border-b-2 text-2xl focus:outline-none mb-5 '
                type="text" 
                name='surname'
                placeholder='Contact No'
                onChange={(e)=>{setContactNo(e.target.value)}}/>

                <label htmlFor="">Username</label>
                <input 
                className='Email w-100 h-6 border-b-2 text-2xl focus:outline-none mb-5 '
                type="text" 
                name="username" 
                placeholder='username'
                onChange={(e)=>{setUsername(e.target.value)}}/>

                <label htmlFor="">Password</label>
                <input 
                className='Email w-100 h-6 border-b-2 text-2xl focus:outline-none mb-5 '
                type="text" 
                name="Password"
                placeholder='Password' 
                onChange={(e)=>{setPassword(e.target.value)}}/>

                <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    onChange={(e)=>{setRole(e.target.value)}}
                >

                    <FormControlLabel value="TRAINER" control={<Radio />} label="Trainer" />
                    <FormControlLabel value="TRAINEE" control={<Radio />} label="Trainee" />
                    
                </RadioGroup>
                </FormControl>

                
                <button 
                className='w-100 h-10 bg-white font-bold mb-5'
                onClick={fetchData}>SUBMIT</button>
                
            </form>
        </div>
      </div>
    </div>
  )
}
