import React, {useState, useEffect} from 'react'
import AddChapterModal from './AddChapterModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios'
import Chapter from './chapter';
import VideoUpload from './VideoUpload';
import ChapterItemsContent from './ChapterItemsContent';

export default function SelectedCourse(props) {
    const exit = false; 
    const [course, setCourse] = useState(props.data_course)
    const {id, title, description } = course
    const [isModal, setModal] = useState(false);
    const [chapter, setChapter] = useState([]);
    const [chapterLength, setChapterLength] = useState([])
    const [chapterDetails , setChapterDetails] = useState({id: null, chapter_index: null})
    const [videoData, setVideoData] = useState("")
  
    const [isVideo, setVideo] = useState(false);
    const [isquiz, setQuiz] = useState(false)
    const [isUploadVideo, setUploadvideo] = useState(false)
    

    function handleOpenModal(){
      setModal(true)
    }
    function handleExitModal(exit){
      setModal(exit)
    }
    async function handleShowChapter(id, chapter_index){
      setChapterDetails({id: id, index_chapter: chapter_index})
      try {
        const response = await axios.post('http://localhost:3000/admin/chapter/chapteritems', {courseId: course.id, chapterId: id  }, {withCredentials: true})
        console.log(response)
        setVideo(response.data.success)
        setVideoData(response.data.data[0].source_url)
      } catch (error) {
        console.log(error)
      }

    }

    useEffect(()=>{
      async function fetchData(){
       // console.log(course)
        try {
          
          const [response, chapterItems] = await Promise.all([
            axios.post('http://localhost:3000/admin/course/chapter', {course_Id: course.id}, {withCredentials: true}),
            axios.post('http://localhost:3000/admin/chapter/chapterfirstitem', {courseId: course.id}, {withCredentials: true})

          ]) 
          setChapter(response.data.data)
          setChapterLength(response.data.chapterLength)
          setVideo(chapterItems.data.success)
          setVideoData(chapterItems.data.data[0].source_url)
          console.log(chapterItems.data.data[0].source_url)
        } catch (error) {
          console.log(error)
        }
      }
      
      fetchData()
      console.log()
    }, [])

    

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
            onClick={handleOpenModal}
            className='ml-auto m-5'>
              + Add Chapter
          </button>
        </div>

        <div className='flex h-full w-full '>
          {isVideo? <ChapterItemsContent videoURL={videoData} />:
          <div className='h-full w-full grid place-items-center'>
            <button 
              className= {isquiz? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
              onClick={
                (e)=>{ 
                  e.preventDefault(); 
                  setQuiz(true) ,
                  setUploadvideo(false)}}>
                    Create Quiz
            </button>

            <button 
               className= {isUploadVideo? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
              onClick={(e)=>{ 
                e.preventDefault(); 
                setQuiz(false) ,
                setUploadvideo(true)}}>
                  Upload Video
            </button>


            {isquiz? <h1>QUIZ BUILDER</h1>:null}
            {isUploadVideo? <VideoUpload course_id={id} chapter_details={chapterDetails}/> :null}
            
          </div>}
          
          <div className='ml-auto h-full w-90 bg-white'>
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
            {isModal?<AddChapterModal onExit={handleExitModal} course_id={id} chapter_no={chapterLength} />: null}
            
          
            
            
        </div>
       
       
      
    </div>
    
  )
}
