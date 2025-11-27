import React, {useState, useEffect} from 'react'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios'
import Chapter from './Chapter.jsx';

import MediaPlayer from './MediaPlayer.jsx';
import QuizList from './QuizList.jsx';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import ImagePlayer from './ImagePlayer.jsx';
import { API_URL } from '../../../api.js';
import Certificate from './Certificate.jsx';


export default function SelectedCourse(props) {
    const exit = false; 
    const [course, setCourse] = useState(props.data_course)
    const {id, title, description } = course
    const [isVideo, setVideo] = useState(false);
    const [videoData, setVideoData] = useState("")
    const [videoId, setVideoId] = useState("")
    const [isQuiz, setQuiz] = useState(false)
    const [isLessonUploaded, setLessonUpload] = useState(false)
    const [quizData, setQuizData] = useState([]);
    const [chapterDetails , setChapterDetails] = useState({id: null, chapter_index: null})
    const [isCertificate, setIsCertificate] = useState(false)
    
    
    
    async function handleShowChapter(id, chapter_index){
      setRefresh(prev => prev + 1)
      setChapterDetails({id: id, index_chapter: chapter_index})
      try {
        const [video, quiz, certificate] = await Promise.all([
          axios.post(`${API_URL}/trainee/chapter/videoitems`, {courseId: course.id, chapterId: id  }, {withCredentials: true}),
          axios.post(`${API_URL}/trainee/chapter/quiz`, {chapterId: id  }, {withCredentials: true}),
          axios.post(`${API_URL}/trainee/chapter/getcertificate`, {courseId: course.id, chapterId: id  }, {withCredentials: true})

        ])
       // reset state
        setVideo(false);
        setQuiz(false);
        setIsCertificate(false);
        setLessonUpload(false);

        // VIDEO EXISTS
        if (video.data.success && video.data.data.length > 0) {
          setVideo(true);
          setVideoData(video.data.data[0]);
          setVideoId(video.data.data[0].id);
          return; // stop here
        }

        // QUIZ EXISTS
        if (quiz.data.success && quiz.data.data.length > 0) {
          setQuiz(true);
          setQuizData(quiz.data.data);
          return;
        }

        // CERTIFICATE EXISTS
        if (certificate.data.success) {
          setIsCertificate(true);
          return;
        }

        // NOTHING EXISTS
        setLessonUpload(true);

      } catch (error) {
        console.log('Error loading chapter contents:', error);
        setVideo(false);
        setQuiz(false);
        setIsCertificate(false);
        setLessonUpload(true);
      }

    }


    const [chapter, setChapter] = useState([]);
    const [chapterLength, setChapterLength] = useState([])
    const [refresh, setRefresh]= useState(0);
    useEffect(()=>{
      async function fetchData(){
       // console.log(course)
        try {
          
          const [response, chapterItems] = await Promise.all([
            axios.post(`${API_URL}/trainee/course/chapter`, {course_Id: course.id}, {withCredentials: true}),
            axios.post(`${API_URL}/trainee/chapter/chapterfirstitem`, {courseId: course.id}, {withCredentials: true})

          ]) ;
          
          setChapter(response.data.data)
          setChapterLength(response.data.chapterLength)
          setVideo(chapterItems.data.success)
          setVideoData(chapterItems.data.data[0])
          
          if(chapterItems.data.success)setLessonUpload(false), setQuiz(false);
          
        } catch (error) {
          console.log(error)
          setLessonUpload(true)
        }
      }
      
      fetchData()
      
    }, [])

    const [activeChapterId, setActiveChapterId] = useState(null);
    
  
    

  return (
    
    <div className={`w-full h-full bg-white absolute `}>
      <div className='flex w-full h-full bg-gray-200 flex flex-col'>
        {/* {HEADER} */}
        <div className='flex w-full h-1/12 bg-green-700 items-center text-white'>
          <button 
            onClick={()=>{props.handleBack(exit)}}
            className='ml-5 text-large' >
            <ArrowBackIcon/> Back to Course
          </button>
          <h1 className="text-xl font-medium ml-20">{title}</h1>
          

        </div>
        

        {/* {this section the main content & the upload section} */}
        <div className='flex h-11/12 w-full flex '>
        {/* video & quiz upload and video and quiz  */}
          <div className='w-10/12 h-full relative'>
            

            {isQuiz?<QuizList quizData={quizData} chapterDetails={chapterDetails} courseDetails={course} refresh={refresh} /> : null }
            {isVideo&&videoData.item_type === "VIDEO"? <MediaPlayer videoURL={videoData.source_url} videoId={videoId} videoData={videoData} />:null}
            {isVideo&&videoData.item_type === "IMAGE"? <ImagePlayer videoData={videoData} videoType={videoData.item_type} videoId={videoId}/>:null}
            {isCertificate?<Certificate />:null }

            {isLessonUploaded?<p>There is no content yet</p>:null}
          </div>
            
          {/* chapter section navigation */}

          <div className="ml-auto h-full w-4/12 bg-white overflow-y-scroll relative">
            
            <div className="h-10 w-full bg-white flex items-center sticky top-0">
              <h1 className="text-large ml-3 font-bold ">Course content</h1>
            
            </div>
            
            
            
            <div>
              {chapter.map((item, index) => (
              
                <Chapter
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  chapter_no={item.order_index}
                  description={item.description}
                  handleOpenChapter={handleShowChapter}
                  handleActiveChapter={()=>setActiveChapterId(item.id)}
                  isActive={activeChapterId === item.id} 
                />
              ))
              }
            </div>
            
          </div>
        </div>


          
          

      </div>
    </div>
    
  )
}
