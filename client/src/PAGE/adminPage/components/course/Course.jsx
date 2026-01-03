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
        setIscourseDelete(true)
        setOpenModal(false)
      } catch (error) {
        setChapterAdded(false)
        console.log(error)
      }
    }

      
  return (
    <div className=''>
      {openModal && (
        <div className='w-full h-full bg-gray-500/40 fixed inset-0 flex items-center justify-center'>
          <div className='w-2/12 h-4/12 bg-white p-3 rounded flex items-center justify-center flex-col '>

            

            <h1 className='text-2xl mt-3 mb-3'>Delete Course</h1>
            
            <button 
              className={
                isMouseOver
                  ? 'm-3 w-10/12 h-3/12 text-2xl text-white bg-green-500 rounded'
                  : 'm-3 w-10/12 h-3/12 text-2xl text-green-500 bg-white border-2 rounded'
              }
              onMouseOver={() => setMouseOver(true)}
              onMouseOut={() => setMouseOver(false)}
              onClick={() =>{props.handleRefresh(), setOpenModal(false)}}>
              NO
            </button>
            <button
              className={
                isMouseOver1
                  ? 'm-3 w-10/12 h-3/12 text-2xl text-white bg-red-500 rounded'
                  : 'm-3 w-10/12 h-3/12 text-2xl text-red-500 bg-white border-2 rounded'
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
      <div className=' shadow-[4px_4px_0px_0px_rgba(128,128,128,1)] w-65 h-50 bg-green-700 m-4 rounded-xl p-3 '>
        
        <p className='text-3xl font-bold text-white'>{props.title}</p>
        <p className='text-gray-200 m-1'>{props.description}</p>
        <div className='flex justify-between '>
          <p className='text-white w-27 h-10 flex items-center justify-center border rounded-xl mb-3 mt-3'>{enrolled.length} Student</p>
          <button
            className='text-white w-27 h-10 flex items-center justify-center border rounded-xl mb-3 mt-3'
            onClick={() => setOpenModal(true)}
          >
            Delete
          </button>
        </div>
        
        <Link to={`/admin/course/${props.id}/${slugify(props.title)}`}>
          <button 
          className='w-full h-10 bg-white rounded-lg '
          >
            ENTER SUBJECT
          </button>
        </Link>
      </div>
    </div>
  )
}
