import React,{useState, useEffect} from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Header from "./components/course/Header.jsx"
import CourseChapters from './components/course/CourseChapters.jsx'
import { API_URL } from '../../api.js'
import QuizList from './components/UI/QuizList.jsx'
import MediaPlayer from './components/UI/MediaPlayer.jsx'
import ImagePlayer from './components/Ui/ImagePlayer.jsx'
import Certificate from './components/Ui/Certificate.jsx'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';




export default function CourseOverview() {
    const { id, courseTitle } = useParams();
   
    const [refresh, setRefresh] = useState(0)
    const [chapterInfo, setChapterInfo] = useState({chapterId: "", chapterIndex: ""})
    const [chapterId, setChapterId] = useState("")

    const [isLesson, setIsLessonUploaded] = useState(false)
    const [isVideo, setIsVideo] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isCertificate, setIsCertificate] = useState(false)
    const [quizData, setQuizData] = useState([])
    const [videoData, setVideoData] = useState([])
    const [certificateData, setCertificateData] = useState([])

    const [lock, setunlock] = useState(false)
    const [chapterIndex, setChapterIndex] = useState()

    const [isOpenChapters, setIsOpenChapters] = useState(false)

    function handleRefresh(){
       setRefresh(prev => prev + 1)
       
    }
   

    const handleChaptersInfo = async(chaptersId, chapterIndex, lock)=>{
        setChapterId(chaptersId)
        setunlock(lock)
        setChapterIndex(chapterIndex)
       try {
          const [video, quiz, certificate, progress] = await Promise.all([
          axios.post(`${API_URL}/trainee/course/chapter/mediaitems`, {courseId: id, chapterId: chaptersId  }, {withCredentials: true}),
          axios.post(`${API_URL}/trainee/course/chapter/quiz`, {chapterId: chaptersId  }, {withCredentials: true}),
          axios.get(`${API_URL}/trainee/course/${id}/${chaptersId}/getcertificate`, {withCredentials:true}),
         
        ])
       
          
          if(quiz.data.success){
            setIsQuiz(true) 
            setIsVideo(false)
            setIsLessonUploaded(false)
            setIsCertificate(false)
            setQuizData(quiz.data.data)
            
          } else if(video.data.success){
            setIsVideo(true)
            setIsQuiz(false) 
            setIsLessonUploaded(false)
            setIsCertificate(false)
            setVideoData(video.data.data[0])
            
          }else if (certificate.data.success){
            setIsVideo(false)
            setIsQuiz(false) 
            setIsCertificate(true)
            setIsLessonUploaded(false)
            setCertificateData(certificate.data.data)
          }else{
            setIsQuiz(false)
            setIsVideo(false)
            setIsCertificate(false)
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
      console.log('hello')
      setIsOpenChapters(false)
    }
  return (
    <div className='w-screen h-screen'>
        <div className='h-13 lg:h-1/12'>
          <Header courseTitle={courseTitle}   />
        </div>
        
        <div className=' md:h-11/12 w-full h-full flex '>
          <div className='w-full h-full '>
            {isQuiz?<QuizList quizData={quizData} courseId={id} /> : null }
            {isVideo&&videoData.item_type === "VIDEO"? <MediaPlayer videoURL={videoData.source_url} videoId={videoData.id} videoData={videoData}  />:null}
            {isVideo&&videoData.item_type === "IMAGE"? <ImagePlayer videoData={videoData} courseId={id} chapterId={chapterId} />:null}
            {isCertificate? <Certificate courseId={id} certificateData={certificateData} />: null}

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
