import React,{useState, useEffect} from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Header from "./components/course/Header.jsx"
import CourseChapters from './components/course/CourseChapters.jsx'
import { API_URL } from '../../api.js'
import QuizList from './components/UI/QuizList.jsx'
import MediaPlayer from './components/UI/MediaPlayer.jsx'
import ImagePlayer from './components/UI/ImagePlayer.jsx'




export default function CourseOverview() {
    const { id, courseTitle } = useParams();
    const [isChapterModal, setIsChapterModal] = useState(false);
    const [isAddTraineeModal, setIsAddTraineeModal] = useState(false);
    const [isTraineeProgressModal, setIsTraineeProgressModal] = useState(false)
    const [chapterLength, setChapterLength] = useState(0);
    const [refresh, setRefresh] = useState(0)
    const [chapterInfo, setChapterInfo] = useState({chapterId: "", chapterIndex: ""})
    const [chapterData, setChapterData] = useState([])

    const [isLesson, setIsLessonUploaded] = useState(false)
    const [isVideo, setIsVideo] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [isQuiz, setIsQuiz] = useState(false);
    const [quizData, setQuizData] = useState([])
    const [videoData, setVideoData] = useState([])

   
    function handleRefresh(){
       setRefresh(prev => prev + 1)
       console.log('hello')
    }
   

    const handleChaptersInfo = async(chaptersId, chapterIndex)=>{
    
       try {
          const [video, quiz] = await Promise.all([
          axios.post(`${API_URL}/trainee/chapter/mediaitems`, {courseId: id, chapterId: chaptersId  }, {withCredentials: true}),
          axios.post(`${API_URL}/trainee/chapter/quiz`, {chapterId: chaptersId  }, {withCredentials: true})

        ])
       
          
          if(quiz.data.success){
            setIsQuiz(true) 
            setIsVideo(false)
            setIsLessonUploaded(false)
            setQuizData(quiz.data.data)
            
          } else if(video.data.success){
            setIsVideo(true)
            setIsQuiz(false) 
            setIsLessonUploaded(false)
            setVideoData(video.data.data[0])
            
          }else{
            setIsQuiz(false)
            setIsVideo(false)
            setIsLessonUploaded(true)
          }
          
        } catch{
          console.log(error)
        }
      setChapterInfo({chapterId: chaptersId, chapterIndex: chapterIndex})
    }
console.log(id)

    
  return (
    <div className='w-screen h-screen'>
        <div className='h-1/12'>
          <Header courseTitle={courseTitle}   />
        </div>
        
        <div className='h-11/12 w-full flex'>
            {isQuiz?<QuizList quizData={quizData} courseId={id} /> : null }
            {isVideo&&videoData.item_type === "VIDEO"? <MediaPlayer videoURL={videoData.source_url} videoId={videoData.id} videoData={videoData}  />:null}
            {isVideo&&videoData.item_type === "IMAGE"? <ImagePlayer videoData={videoData} />:null}

            {isLesson? <p>there is no content</p>: null}

            <CourseChapters  courseId={id} refresh={refresh} handleChaptersInfo={handleChaptersInfo} />
        </div>
       
    </div>

  )
}
