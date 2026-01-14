import React,{useState, useEffect} from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Header from "./components/course/Header.jsx"
import CourseChapters from './components/course/CourseChapters.jsx'
import { API_URL } from '../../api.js'
import QuizList from './components/Ui/QuizList.jsx'
import MediaPlayer from './components/Ui/MediaPlayer.jsx'
import ImagePlayer from './components/Ui/ImagePlayer.jsx'
import Certificate from './components/Ui/Certificate.jsx'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AnnouncementModal from './components/Ui/AnnouncementModal.jsx'
import TextPresenter from './components/Ui/TextPresenter.jsx'
import LockIcon from '@mui/icons-material/Lock';


export default function CourseOverview() {
    const { id, courseTitle } = useParams();
   
    const [refresh, setRefresh] = useState(0)
    const [chapterInfo, setChapterInfo] = useState({chapterId: "", chapterIndex: ""})
    const [chapterId, setChapterId] = useState("")

    const [isLesson, setIsLessonUploaded] = useState(false)
    const [isVideo, setIsVideo] = useState(false);
    const [isAnnouncementModal, setIsAnnouncementModal] = useState(false);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isCertificate, setIsCertificate] = useState(false)
    const [isText, setIstext] = useState(false)
    const [quizData, setQuizData] = useState([])
    const [videoData, setVideoData] = useState([])
    const [certificateData, setCertificateData] = useState([])
    const [textData, setTextData] = useState([])
    
    const [notif, setNotif] = useState(0)

    const [isOpenChapters, setIsOpenChapters] = useState(false)

    const [progresstrack, setProgressTrack] = useState({})
    const [chapterIndex, setChapterIndex] = useState(0)
    function handleRefresh(){
       setRefresh(prev => prev + 1)
       
    }
    useEffect(()=>{
      const handleprogressloader = async ()=>{
        const result = await axios.get(`${API_URL}/trainee/chapterprogress/${id}/loader`, {withCredentials: true})
      }
      handleprogressloader()
    },[])
   

    const handleChaptersInfo = async(chaptersId, chapterIndex)=>{
        setChapterId(chaptersId)
        setChapterIndex(chapterIndex)
       try {
          const [video, quiz, certificate, text, progress] = await Promise.all([
          axios.post(`${API_URL}/trainee/course/chapter/mediaitems`, {courseId: id, chapterId: chaptersId  }, {withCredentials: true}),
          axios.post(`${API_URL}/trainee/course/chapter/quiz`, {chapterId: chaptersId  }, {withCredentials: true}),
          axios.get(`${API_URL}/trainee/course/${id}/${chaptersId}/getcertificate`, {withCredentials:true}),
          axios.get(`${API_URL}/trainee/texteditor/${id}/${chaptersId}`, {withCredentials:true}), 
          axios.get(`${API_URL}/trainee/chapterprogress/${id}/unlocktracker`, {withCredentials:true}),
          
         
        ])
          
          
          let progresslock = progress.data.data.find(item => item.chapter_id === chaptersId)
          
          setProgressTrack(progresslock)
          if(quiz.data.success){
            setIsQuiz(true) 
            setIsVideo(false)
            setIsLessonUploaded(false)
            setIsCertificate(false)
            setIstext(false)
            setQuizData(quiz.data.data)
            
          } else if(video.data.success){
            setIsVideo(true)
            setIsQuiz(false) 
            setIsLessonUploaded(false)
            setIsCertificate(false)
            setIstext(false)
            setVideoData(video.data.data[0])
            
          }else if (certificate.data.success){
            setIsVideo(false)
            setIsQuiz(false) 
            setIsCertificate(true)
            setIsLessonUploaded(false)
            setIstext(false)
            setCertificateData(certificate.data.data)
          }else if(text.data.success){
            setIsVideo(false)
            setIsQuiz(false) 
            setIsCertificate(false)
            setIsLessonUploaded(false)
            setIstext(true)
            setTextData(text.data.data)
          }else{
            setIsQuiz(false)
            setIsVideo(false)
            setIsCertificate(false)
            setIstext(false)
            setIsLessonUploaded(true)
          }
          
        } catch{
          console.log(error)
        }
      setChapterInfo({chapterId: chaptersId, chapterIndex: chapterIndex})
    }

    const handleOpenChapters = ()=>{
      setIsOpenChapters(true)
    }
    const handleExitChapters = ()=>{
      setIsOpenChapters(false)
    }

    const handleOpenAnnouncementModal = (notif)=>{
      setIsAnnouncementModal(true)
      setNotif(notif)
    }
    const handleExitAnnouncementModal =()=>{
      setRefresh(prev => prev + 1)
      setIsAnnouncementModal(false)
      
    }
   
  return (
    <div className='w-screen h-screen'>
        <div className='h-13 lg:h-1/12'>
          <Header courseTitle={courseTitle} handleOpenAnnouncementModal={handleOpenAnnouncementModal} courseId={id} refresh={refresh} />
        </div>
        
        <div className=' md:h-11/12 w-full h-full flex '>
          <div className='w-full h-full relative '>
            {isQuiz?<QuizList quizData={quizData} courseId={id} /> : null }
            {isVideo&&videoData.item_type === "VIDEO"? <MediaPlayer videoURL={videoData.source_url} videoId={videoData.id} videoData={videoData}  />:null}
            {isVideo&&videoData.item_type === "IMAGE"? <ImagePlayer videoData={videoData} courseId={id} chapterId={chapterId} />:null}
            {isCertificate? <Certificate courseId={id} certificateData={certificateData} />: null}
            {isText?<TextPresenter data={textData} />:null}
            {isAnnouncementModal?<AnnouncementModal courseId={id} onExit={handleExitAnnouncementModal} notif={notif}  /> : null}
            {progresstrack.is_unlocked ?null:<div className="absolute inset-0 bg-gray-400/70 z-10 grid place-items-center"><div className='grid place-items-center'>
              <LockIcon sx={{fontSize:70}} /> <p className='text-2xl font-semibold'>Lock</p>
              </div></div>}
            {isLesson?<div className='w-full h-full flex justify-center items-center'> <p> No Content </p> </div> : null}
            
          </div>
          
          {isOpenChapters?null:<button className="p-1 bg-green-700 lg:hidden fixed right-0 top-20 z-50 "
          onClick={handleOpenChapters}>
            <ArrowBackIosNewIcon sx={{fontSize: 15}} />
          </button>}
          
          <div className={isOpenChapters?`  w-10/12 h-full absolute right-0 z-100 `:`hidden lg:block lg:w-4/12 h-full`}>
            <CourseChapters  courseId={id} refresh={refresh} handleChaptersInfo={handleChaptersInfo} handleExitChapters={handleExitChapters} />
          </div>

         
            
        </div>
       
    </div>

  )
}
