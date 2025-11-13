import React, {useState, useEffect} from 'react'
import AddChapterModal from './AddChapterModal';
import AddTraineeModal from './AddTraineeModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios'
import Chapter from './chapter';
import VideoUpload from './VideoUpload';
import VideoPlayer from './VideoPlayer';
import CreateQuiz from './CreateQuizModal';
import QuizList from './QuizList';

export default function SelectedCourse(props) {
    const exit = false; 
    const [course, setCourse] = useState(props.data_course)
    const {id, title, description } = course
    const [isChapterModal, setChapterModal] = useState(false);
    const [isEnrollModal, setEnrollModal] = useState(false);
    const [isQiuzModal, setQiuzModal] =  useState(false)
    const [chapter, setChapter] = useState([]);
    const [chapterLength, setChapterLength] = useState([])
    const [chapterDetails , setChapterDetails] = useState({id: null, chapter_index: null})

    const [videoData, setVideoData] = useState("")
    const [refresh, setRefresh]= useState(0);
  
    const [isLessonUploaded, setLessonUpload] = useState(false)
    const [isQuiz, setQuiz] = useState(false)
    const [quizData, setQuizData] = useState([]);
    const [isVideo, setVideo] = useState(false);
    const [isQuizUpload, setQuizUpload] = useState(false)
    const [isUploadVideo, setUploadvideo] = useState(false)
    

    function handleOpenChapterModal(){
      setChapterModal(true)
    }
    
    function handleExitChapterModal(exit){
      setChapterModal(exit)
      
    }
    function handleOpenEnrollModal(){
      setEnrollModal(true)
    }
    function handleExitEnrollModal(exit){
      setEnrollModal(exit)
    }

    function handleExitQuizModal(exit){
      setQiuzModal(exit)
    }
    async function handleShowChapter(id, chapter_index){
      setChapterDetails({id: id, index_chapter: chapter_index})
      try {
        const [video, quiz] = await Promise.all([
          axios.post('http://localhost:3000/admin/chapter/chapteritems', {courseId: course.id, chapterId: id  }, {withCredentials: true}),
          axios.post('http://localhost:3000/admin/chapter/quiz', {chapterId: id  }, {withCredentials: true})

        ])
          if(video.data.success){
            console.log(video.data.data.length)
            setVideo(video.data.success)
            setVideoData(video.data.data[0].source_url)
            setQuiz(false)
            setLessonUpload(false)
            
          }else{
            console.log(quiz.data.data.length)
            setVideo(false)
            setQuiz(quiz.data.success)
            setQuizData(quiz.data.data)
            setLessonUpload(false)
          }
        //if(video.data)
        
      } catch (error) {
        console.log('there is error or your not yet uploaded any videos or quiz',error)
        setVideo(false)
        setQuiz(false)
        setLessonUpload(true)
      }

    }

    useEffect(()=>{
      async function fetchData(){
       // console.log(course)
        try {
          
          const [response, chapterItems] = await Promise.all([
            axios.post('http://localhost:3000/admin/course/chapter', {course_Id: course.id}, {withCredentials: true}),
            axios.post('http://localhost:3000/admin/chapter/chapterfirstitem', {courseId: course.id}, {withCredentials: true})

          ]) ;
          
          setChapter(response.data.data)
          setChapterLength(response.data.chapterLength)
          setVideo(chapterItems.data.success)
          setVideoData(chapterItems.data.data[0].source_url)
          
        } catch (error) {
          console.log(error)
        }
      }
      
      fetchData()
      console.log()
    }, [refresh])

    function handleRefresh(){
      setRefresh(prev => prev + 1)
    }

  return (
    
    <div className='w-full h-full bg-white absolute '>
      <div className='flex w-full h-full bg-gray-200 flex flex-col'>
        <div className='flex w-full h-15 bg-green-700 items-center text-white'>
          <button 
            onClick={()=>{props.handleBack(exit)}}
            className='ml-5 text-large' >
            <ArrowBackIcon/> Back to Course
          </button>
          <h1 className="text-xl font-medium ml-20">{title}</h1>

          <button
            onClick={handleOpenChapterModal}
            className='ml-auto m-5'>
              + Add Chapter
          </button>

          <button
            onClick={handleOpenEnrollModal}
            className='m-5'>
            + Add Trainee
          </button>
        </div>

        <div className='flex h-full w-full flex '>
          {isQuiz?<QuizList quizData={quizData} /> : null }
          {isVideo? <VideoPlayer videoURL={videoData} />:null}

          {isLessonUploaded?<div className='h-full w-full grid place-items-center'>
            <button 
              className= {isQuizUpload? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
              onClick={
                (e)=>{ 
                  e.preventDefault(); 
                  setQuizUpload(true),
                  setQiuzModal(true)
                  setUploadvideo(false)}}>
                    Create Quiz
            </button>

            <button 
              className= {isUploadVideo? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
              onClick={(e)=>{ 
                e.preventDefault(); 
                setQuizUpload(false) ,
                setUploadvideo(true)}}>
                  Upload Video
            </button>


            {isUploadVideo? <VideoUpload course_id={id} chapter_details={chapterDetails}/> :null}
            
          </div>:null}
          
          <div className='ml-auto h-full w-100 bg-white'>
            <div className='h-10 bg-white flex items-center'>
              <h1 className='text-large ml-3 font-bold'>Course content</h1>
            </div>
            {chapter.map((chapter)=>{
              return(<Chapter 
                id={chapter.id}
                key={chapter.id}
                title={chapter.title} 
                chapter_no={chapter.order_index}
                description={chapter.description} 
                handleOpenChapter={handleShowChapter} />)
              })
            }
          </div>
        </div>
            {isChapterModal?<AddChapterModal onExit={handleExitChapterModal} onRefresh={handleRefresh} course_id={id} chapter_no={chapterLength} />: null}
            {isEnrollModal?<AddTraineeModal onExit={handleExitEnrollModal}/>:null}
            {isQiuzModal? <CreateQuiz onExit={handleExitQuizModal} chapterId={chapterDetails.id} />: null }
          
            
            
      </div>
    </div>
    
  )
}
