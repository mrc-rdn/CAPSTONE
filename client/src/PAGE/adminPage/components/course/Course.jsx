import React ,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { API_URL } from '../../../../api.js';
import CloseIcon from '@mui/icons-material/Close';

export default function Course(props) {
    const open = true
    const [enrolled, setenrolled] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [isMouseOver, setMouseOver] = useState(false)
    const [isMouseOver1, setMouseOver1] = useState(false)
    const [isCourseDelete, setIscourseDelete] = useState(false)

    function slugify(text) {
          return text.toLowerCase().replace(/\s+/g, '-');
      } 
    useEffect(()=>{
      const fetchData = async()=>{
        
          const res = await axios.get(`${API_URL}/admin/${props.id}/enrolled`,{withCredentials:true})
          setenrolled(res.data.data)
        
      }   
      fetchData() 
    },[])

    const handleSubmit = async(e)=>{
      e.preventDefault()
      try {
        const  result = await axios.delete(`${API_URL}/admin/coursedelete/${props.id}`, 
          {withCredentials:true})
          props.handleRefresh()
        setIscourseDelete(true)
        setOpenModal(false)
      } catch (error) {
        setChapterAdded(false)
        console.log(error)
      }
    }

      
  return (
   <div>
  {openModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[380px] max-w-[90%] h-[260px] bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center">

        <h1 className="text-xl font-semibold text-[#2D4F2B] mb-6">
          Delete Course
        </h1>

        <button
          className={
            isMouseOver
              ? "w-full h-11 mb-3 text-white bg-green-600 rounded-xl font-medium transition"
              : "w-full h-11 mb-3 text-green-700 bg-white/60 border border-green-500/40 rounded-xl font-medium transition"
          }
          onMouseOver={() => setMouseOver(true)}
          onMouseOut={() => setMouseOver(false)}
          onClick={() => { props.handleRefresh(); setOpenModal(false); }}
        >
          NO
        </button>

        <button
          className={
            isMouseOver1
              ? "w-full h-11 text-white bg-red-600 rounded-xl font-medium transition"
              : "w-full h-11 text-red-600 bg-white/60 border border-red-500/40 rounded-xl font-medium transition"
          }
          onMouseOver={() => setMouseOver1(true)}
          onMouseOut={() => setMouseOver1(false)}
          onClick={handleSubmit}
        >
          DELETE COURSE
        </button>

      </div>
    </div>
  )}

  <div className="w-65 h-50 m-4 p-4 rounded-2xl bg-white/25 backdrop-blur-md border border-white/30 shadow-lg flex flex-col justify-between">

    <div>
      <p className="text-2xl font-bold text-[#2D4F2B]">
        {props.title}
      </p>

      <p className="text-sm text-[#5F7A61] mt-1">
        {props.description}
      </p>
    </div>

    <div className="flex justify-between mt-4">
      <p className="w-28 h-9 flex items-center justify-center rounded-xl bg-white/40 text-[#2D4F2B] text-sm font-medium">
        {enrolled.length} Student
      </p>

      <button
        className="w-28 h-9 flex items-center justify-center rounded-xl bg-white/40 text-red-600 text-sm font-medium hover:bg-red-500 hover:text-white transition"
        onClick={() => setOpenModal(true)}
      >
        Delete
      </button>
    </div>

    <Link to={`/admin/course/${props.id}/${slugify(props.title)}`}>
      <button className="w-full h-10 mt-4 rounded-xl bg-white/70 text-[#2D4F2B] font-semibold hover:bg-green-600 hover:text-white transition">
        ENTER SUBJECT
      </button>
    </Link>
  </div>
</div>

  )
}