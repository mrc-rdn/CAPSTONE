import React ,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { API_URL } from '../../../../api.js';
import PeopleIcon from '@mui/icons-material/People';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useTheme } from '../../../../ThemeContext';

export default function Course(props) {
    const { isDarkMode } = useTheme();
    const [enrolled, setenrolled] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [isMouseOver, setMouseOver] = useState(false)
    const [isMouseOver1, setMouseOver1] = useState(false)

    function slugify(text) {
          return text.toLowerCase().replace(/\s+/g, '-');
      } 

    useEffect(()=>{
console.log(props.image)
      const fetchData = async()=>{
          try {
            const res = await axios.get(`${API_URL}/trainer/${props.id}/enrolled`,{withCredentials:true})
            setenrolled(res.data.data)
          } catch (error) {
            console.log(error)
          }
      }   
      fetchData() 
    },[props.id])

    const handleSubmit = async(e)=>{
      e.preventDefault()
      try {
        await axios.delete(`${API_URL}/trainer/coursedelete/${props.id}`, {withCredentials:true})
        setOpenModal(false)
        if(props.handleRefresh) props.handleRefresh();
      } catch (error) {
        console.log(error)
      }
    }

  return (
   <div className="relative">
      {openModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 dark:bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-black text-[#2D4F2B] dark:text-emerald-400 mb-2">Delete Course?</h2>
              <p className="text-[#2D4F2B]/60 dark:text-slate-400 mb-8 font-medium">This action cannot be undone. All data will be permanently removed.</p>
              
              <div className="flex flex-col gap-3">
                <button
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  onClick={handleSubmit}
                >
                  YES, DELETE IT
                </button>
                <button
                  className="w-full py-4 bg-[#2D4F2B]/5 dark:bg-slate-800 text-[#2D4F2B] dark:text-slate-100 rounded-2xl font-black hover:bg-[#2D4F2B]/10 dark:hover:bg-slate-700 transition-all"
                  onClick={() => setOpenModal(false)}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="group w-72 h-80 flex flex-col rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        {/* Course Card Top */}
        <div className="relative h-32 bg-[#2D4F2B] dark:bg-emerald-800 overflow-hidden">
          {props.image? <img src={props.image} alt="Course Image" className="w-full h-full object-cover" />
             :<div><div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#FFB823,transparent)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircleOutlineIcon sx={{ fontSize: 60, color: 'white', opacity: 0.3 }} />
            </div></div> }
            {/* <div className="absolute top-4 right-4">
                <button 
                    onClick={(e) => { e.preventDefault(); setOpenModal(true); }}
                    className="w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                    ×
                </button>
            </div> */}
        </div>

        {/* Course Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-black text-[#2D4F2B] dark:text-emerald-400 line-clamp-1 mb-1 uppercase tracking-tight">
              {props.title}
            </h3>
            <p className="text-sm text-[#2D4F2B]/60 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed mb-4">
              {props.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFB823]/10 dark:bg-amber-950/20 border border-[#FFB823]/20 dark:border-amber-900/30">
                <PeopleIcon sx={{ fontSize: 18, color: isDarkMode ? '#10b981' : '#2D4F2B' }} className="dark:text-emerald-400" />
                <span className="text-xs font-black text-[#2D4F2B] dark:text-emerald-400 uppercase">
                    {enrolled.length} Trainees
                </span>
            </div>
          </div>

          <Link to={`/trainer/course/${props.id}/${slugify(props.title)}`} className="w-full">
            <button className="w-full h-12 rounded-2xl bg-[#2D4F2B] dark:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-[#1e3a1c] dark:hover:bg-emerald-700 hover:shadow-lg hover:shadow-[#2D4F2B]/20 dark:hover:shadow-none transition-all active:scale-95">
              Enter Subject
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
