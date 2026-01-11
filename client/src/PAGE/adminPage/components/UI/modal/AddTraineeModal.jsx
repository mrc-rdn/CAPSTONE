import React, {useState, useEffect} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'
import { API_URL } from '../../../../../api';

export default function AddTraineeModal(props) {
    const exit = false
    const [studentId, setStudentId] = useState("")
    const [isEnrolled, setEnrolled] = useState(false)
    const [trainee, setTrainee] = useState([])
    const [progress, setProgress] = useState([])

    useEffect(()=>{
      const fetch = async() =>{
        try {
          const [trainee, progress] = await Promise.all([axios.get(`${API_URL}/admin/${props.courseId}/trainee`, {withCredentials:true}),
           axios.post(`${API_URL}/admin/${props.courseId}/excelrender`,{},{withCredentials:true})])
           setProgress(progress.data.data)
          setTrainee(trainee.data.data)
        } catch (error) {
          
        }
        
      }
      fetch()
    },[])

    async function handleEnroll(e){
      e.preventDefault()
      
      try {
        const response = await axios.post(`${API_URL}/trainer/course/enroll`,{courseId: props.courseId, studentId: studentId}, {withCredentials: true});
        setEnrolled(true)
        setStudentId("")
      } catch (error) {
        console.log(`error handling the request ${error}`)
      }
    }

  function getCompletionPercentagePerUser(data) {
    const users = {};

    data.forEach(item => {
      const userId = item.user_id;

      if (!users[userId]) {
        users[userId] = {
          user_id: userId,
          first_name: item.first_name,
          surname: item.surname,
          total: 0,
          done: 0
        };
      }

      users[userId].total += 1;

      if (item.is_done) {
        users[userId].done += 1;
      }
    });

    // Step 2: compute percentage
    return Object.values(users).map(user => ({
      ...user,
      percentage: Math.round((user.done / user.total) * 100)
    }));
  }
  let result = getCompletionPercentagePerUser(progress);


console.log(result)
  return (
    <div className='w-full h-full bg-gray-500/80 fixed inset-0 grid place-items-center z-200'>
      <div className='w-10/12 h-10/12 bg-white p-3 rounded-lg p-5'>
        <button onClick={()=>{props.onExit(exit)}}><CloseIcon /></button> 
        <h1 className='text-2xl mt-3'>Add Trainee</h1> 
        <div className='w-full h-8/12 overflow-y-scroll gird place-items-center'>
        
          <table className="w-11/12 bg-white shadow-md rounded-lg overflow-hidden border-1 m-2 ">
            <thead className="bg-green-600 text-white">
                <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-center">Status </th>
                <th className="py-3 px-6 text-center">Percentage </th>
              
                </tr>
            </thead>
            <tbody class="text-gray-700">
            {(result.map((info, index)=>{
                return(
                <tr class="border-b hover:bg-gray-100 transition duration-300 " key={index}>
                    <td className="py-4 px-6 border-x-1">{info.user_id}</td>
                    <td className="py-4 px-6 border-x-1">{info.surname.charAt(0).toUpperCase() + info.surname.slice(1)} {info.first_name.charAt(0).toUpperCase()+ info.first_name.slice(1)} </td>
                    <td className="py-4 px-6 border-x-1">{ info.percentage === 100?'Completed': 'On Going'} </td>
                    <td className="py-4 px-6 border-x-1">{ info.percentage} %</td>
                    
                </tr>)
                }))}
            </tbody>
          </table >
        </div>
        
        <div className='flex flex-col'>
          <div>
            {isEnrolled?<p>success enrollment</p>:null}
          </div>
          <div className='flex flex-col h-2/12'>
            <div className='w-6/12 h-full flex flex-col mt-3'>
              <label>Student Id</label>
              
            </div>
            <form action="" onSubmit={handleEnroll}>
            <div className=' h-full w-6/12 flex-row flex p-1 m-1'>
              <input 
              className='w-full h-10 text-xl bg-green-500 rounded p-1 m-1'
              type="text"
              required
              placeholder='Student Id'
              onChange={(e)=> setStudentId(e.target.value)}
              value={studentId}/>

              <button type='submit'
              className=' w-50 h-10 text-2xl text-white bg-green-500 rounded p-1 m-1'>
                Enroll
              </button>
            </div>
            </form>
            
          </div>
        </div> 
      </div> 
    </div>
  )
}
