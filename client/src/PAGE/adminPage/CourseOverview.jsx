import React,{useState, useEffect} from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Header from "./components/course/Header.jsx"
import CourseChapters from './components/course/CourseChapters.jsx'
import { API_URL } from '../../api.js'
import AddChapterModal from './components/UI/modal/AddChapterModal.jsx'
import CourseAddContent from "./components/course/CourseAddContent.jsx"
import QuizList from './components/UI/QuizList.jsx'
import MediaPlayer from './components/UI/MediaPlayer.jsx'
import ImagePlayer from './components/UI/ImagePlayer.jsx'
import AddTraineeModal from './components/UI/modal/AddTraineeModal.jsx'
import TraineeProgressModal from "./components/UI/modal/TraineeProgressModal.jsx"
import Certificate from "./components/UI/Certificate.jsx"
import DeleteContent from './components/UI/DeleteContent.jsx'
import AnnouncementModal from './components/UI/modal/AnnouncementModal.jsx'
import TextPresenter from './components/UI/TextPresenter.jsx'



export default function CourseOverview() {
    const { id, courseTitle } = useParams();
    const [isChapterModal, setIsChapterModal] = useState(false);
    const [isAddTraineeModal, setIsAddTraineeModal] = useState(false);
    const [isTraineeProgressModal, setIsTraineeProgressModal] = useState(false)
    const [chapterLength, setChapterLength] = useState(0);
    const [refresh, setRefresh] = useState(0)
    const [chapterInfo, setChapterInfo] = useState({chapterId: "", chapterIndex: ""})

    const [isLesson, setIsLessonUploaded] = useState(false)
    const [isVideo, setIsVideo] = useState(false);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isCertificate, setIsCertificate] = useState(false)
    const [isText, setIstext] = useState(false)
    const [quizData, setQuizData] = useState([])
    const [videoData, setVideoData] = useState([])
    const [certificateData, setCertificateData] = useState([])
    const [textData, setTextData] = useState([])
    const [isEditChapter, setIsEditChapterModal] = useState(false)
    const [isAnnounceModalOpen, setIsAnnouncementModalOpen ] = useState(false)
    

    const handleOpenChapterAddModal = async()=>{
      setIsChapterModal(true) 
    }
    const handleExitChapterModal = (exit) => {
      setIsChapterModal(exit)
      setRefresh(prev => prev + 1)
    }
    const handleOpenAddTraineeModal = () =>{
      setIsAddTraineeModal(true)
    }

    const handleExitaddTraineeModal = () =>{
      setIsAddTraineeModal(false)
    }

    const handleOpenTraineeProgress = () =>{
      setIsTraineeProgressModal(true)
    }
    const handleExitTraineeProgressModal = () =>{
      setIsTraineeProgressModal(false)
    }
    const handleOpenAnnouncementModal = () =>{
      setIsAnnouncementModalOpen(true)
    }
    const handleExitAnnouncementModal = () =>{
      setIsAnnouncementModalOpen(false)
    }

    function handleRefresh(){
      setRefresh(prev => prev + 1)
       
    }
   // this to open the delete content this function is pass by course chapter component
    const handleEditChapter = (isEditChapter)=>{
      setIsEditChapterModal(!isEditChapter)
    }

    const handleChaptersInfo = async(chaptersId, chapterIndex , isEditChapter)=>{
      setIsEditChapterModal(isEditChapter)
       try {
          const [video, quiz, certificate, text] = await Promise.all([
          axios.post(`${API_URL}/admin/chapter/mediaitems`, {courseId: id, chapterId: chaptersId  }, {withCredentials: true}),
          axios.post(`${API_URL}/admin/chapter/quiz`, {chapterId: chaptersId  }, {withCredentials: true}),
          axios.get(`${API_URL}/admin/${id}/${chaptersId}/getcertificate`, {withCredentials:true}),
          axios.get(`${API_URL}/admin/texteditor/${id}/${chaptersId}`, {withCredentials:true})


        ])
        
          
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

    

    
  return (
    <div className='w-screen h-screen'>
        <div className='h-1/12'>
          <Header courseTitle={courseTitle} handleOpenAnnouncementModal={handleOpenAnnouncementModal}  handleOpenChapterAddModal={handleOpenChapterAddModal} handleOpenAddTraineeModal={handleOpenAddTraineeModal} handleOpenTrianeeProgressModal={handleOpenTraineeProgress} />
        </div>
        
        <div className='h-11/12 w-full flex'>
          <div className='relative w-full'>
            
            {isQuiz?<QuizList quizData={quizData} /> : null }
            {isVideo&&videoData.item_type === "VIDEO"? <MediaPlayer videoURL={videoData.source_url} videoId={videoData.id} videoData={videoData}  />:null}
            {isVideo&&videoData.item_type === "IMAGE"? <ImagePlayer videoData={videoData} />:null}
            {isCertificate? <Certificate courseId={id} certificateData={certificateData} />: null}
            {isText? <TextPresenter data={textData} />:null}
            {isEditChapter
            ? (isLesson ? null : <DeleteContent isQuiz={isQuiz} isVideo={isVideo} isCertificate={isCertificate} isText={isText} videoData={videoData}  quizData={quizData} certificateData={certificateData} textData={textData}  onRefresh={handleRefresh}/>)
            : null}

            {/* {isLesson? <CourseAddContent onRefresh={handleRefresh} chapterInfo={chapterInfo} courseId={id} />: null} */}
          </div>
          <div className='ml-auto h-full w-4/12 bg-white'>
            <CourseChapters  courseId={id} refresh={refresh} handleChaptersInfo={handleChaptersInfo} handleEditChapter={handleEditChapter} />
          </div>
            
        </div>
        {isTraineeProgressModal?<TraineeProgressModal   onExit={handleExitTraineeProgressModal} courseId={id}  /> :null}
        {isAddTraineeModal?<AddTraineeModal onExit={handleExitaddTraineeModal}  courseId={id}/>: null}
        {isChapterModal?<AddChapterModal onExit={handleExitChapterModal} courseId={id} chapterlength1={chapterLength}/>: null}
        {isAnnounceModalOpen?<AnnouncementModal onExit={handleExitAnnouncementModal} courseId={id} certificate={certificateData} />:null}
    </div>

  )
}