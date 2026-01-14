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
          const [trainee, progress] = await Promise.all([axios.get(`${API_URL}/trainer/${props.courseId}/trainee`, {withCredentials:true}),
           axios.post(`${API_URL}/trainer/${props.courseId}/excelrender`,{},{withCredentials:true})])
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



  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-11/12 max-w-5xl rounded-xl bg-white shadow-lg">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#6F8A6A]/40">
        <h1 className="text-xl font-semibold text-[#2D4F2B]">
          Add Trainee
        </h1>

        <button
          onClick={() => props.onExit(exit)}
          className="
            w-9 h-9
            flex items-center justify-center
            rounded-lg
            text-[#2D4F2B]
            transition
          "
        >
          <CloseIcon />
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="px-6 py-4">
        <div className="max-h-80 overflow-y-auto rounded-lg border border-[#6F8A6A]/40 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[#2D4F2B] text-[#F1F3E0]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Progress</th>
              </tr>
            </thead>

            <tbody className="text-[#2D4F2B]">
              {result.map((info, index) => (
                <tr
                  key={index}
                  className="border-b border-[#6F8A6A]/30 hover:bg-[#708A58]/20 transition"
                >
                  <td className="px-4 py-3">{info.user_id}</td>

                  <td className="px-4 py-3">
                    {info.surname.charAt(0).toUpperCase() + info.surname.slice(1)}{" "}
                    {info.first_name.charAt(0).toUpperCase() + info.first_name.slice(1)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {info.percentage === 100 ? (
                      <span className="text-[#2D4F2B] font-medium">
                        Completed
                      </span>
                    ) : (
                      <span className="text-[#6F8A6A]">
                        On Going
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {info.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== ENROLLMENT SECTION ===== */}
        <div className="px-6 pb-6">
          {isEnrolled && (
            <p className="mb-3 text-sm font-medium text-[#2D4F2B]">
              ✔ Trainee successfully enrolled
            </p>
          )}

          <form onSubmit={handleEnroll}>
            <div className="flex items-end gap-3 w-full md:w-7/12">

              {/* Student ID input */}
              <div className="flex flex-col flex-1">
                <label className="mb-1 text-sm text-[#2D4F2B]">
                  Student ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="
                    h-10 px-3
                    rounded-lg
                    border border-[#6F8A6A]
                    bg-white
                    text-[#2D4F2B]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#FFB823]
                  "
                />
              </div>

              {/* Enroll button */}
                <button
                  type="submit"
                  className="
                    h-11 px-8
                    rounded-xl
                    font-semibold
                    bg-[#2D4F2B]
                    text-white
                    hover:bg-[#708A58]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#FFB823]
                    transition
                    whitespace-nowrap
                  "
                >
                  ENROLL
                </button>
                
            </div>
          </form>
        </div>


    </div>
  </div>
);
}