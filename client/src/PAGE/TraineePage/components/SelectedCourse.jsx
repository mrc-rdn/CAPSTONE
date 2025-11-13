import React, {useState, useEffect} from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios'
import Chapter from './chapter';
import ChapterItemsContent from './ChapterItemsContent';

export default function SelectedCourse(props) {
    const exit = false; 
    const [course, setCourse] = useState(props.data_course)
    const {id, title, description } = course
    const [chapter, setChapter] = useState([]);
    const [chapterLength, setChapterLength] = useState([])
    const [chapterDetails , setChapterDetails] = useState({id: null, chapter_index: null})
    const [videoData, setVideoData] = useState("")
    
  
    const [isVideo, setVideo] = useState(false);

    function handleShowChapter(){
      
    }

    
   
    useEffect(()=>{
      async function fetchData(){
      
        try {
          const result = await axios.post('http://localhost:3000/trainee/course/chapter', {course_Id: id }, {withCredentials: true})
          
          setChapter(result.data.data)
        } catch (error) {
          
        }
      }
      
      fetchData()
      
    }, [])
    console.log(chapter)


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

          

          
        </div>

        <div className='flex h-full w-full flex '>
          {isVideo? <ChapterItemsContent videoURL={videoData} />:<p>no module uploaded yet</p>}
          
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
              
      </div>
    </div>
    
  )
}
