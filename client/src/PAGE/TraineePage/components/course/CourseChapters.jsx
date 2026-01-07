import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chapter from './Chapter.jsx'
import { API_URL } from '../../../../api.js';
import CloseIcon from '@mui/icons-material/Close';


export default function CourseChapters(props) {
  const [isEditChapter, setEditChapter] = useState(false);
  const [isEditChapterModal, setIsEditChapterModal ] = useState(false)
  const [EditChapterData, setEditChapterData] = useState({chapterId:"", chapter_index: "", chapter_title:"", chapter_description: ""})
  const [fetchChapters, setFetchChapters] = useState([]);
  const [activeChapterId, setActiveChapterId] = useState(null);

  
  
  const [refresh, setRefresh]= useState(0);

  const [lock , setUnlock] = useState(false)

  
  useEffect(() => {
    const fetchingChapters = async () => {
      try {
        const [chapterInfo, chapterItems, progress] = await Promise.all([
          axios.get(`${API_URL}/trainee/course/${props.courseId}`, { withCredentials: true }),// this to fetch all the chapters
          axios.get(`${API_URL}/trainee/course/1/${props.courseId}`, { withCredentials: true }),
          
          
        ]);
     
        const chapterId = chapterItems.data.chapterInfo[0].id
        const chapterIndex = chapterItems.data.chapterInfo[0].order_index
        props.handleChaptersInfo(chapterId, chapterIndex, lock) 
        const fetchedChapters = chapterInfo.data.data;
        
        setFetchChapters(fetchedChapters);

        if (fetchedChapters && fetchedChapters.length > 0) {
          const firstChapter = fetchedChapters.reduce((prev, curr) =>
            curr.order_index < prev.order_index ? curr : prev
          );
          setActiveChapterId(firstChapter.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchingChapters();
  }, [props.refresh, refresh]);


  // Functions
 

  async function handleShowChapter(id, chapter_index) {

    
    
    try {
     const [videoProgress, quizProgress] = await Promise.all([
          axios.post(`${API_URL}/trainee/course/traineevideoprogress`,{course_id:props.courseId, chapter_id: id, chapterIndex:chapter_index}, { withCredentials: true }),
          axios.post(`${API_URL}/trainee/course/traineequizprogress`,{course_id:props.courseId, chapter_id: id, chapterIndex:chapter_index}, { withCredentials: true }),
        
        ]);
        
        const videoProgressData = videoProgress.data.data
        const quizProgressData = quizProgress.data.data
        
        props.handleChaptersInfo(id, chapter_index )

    } catch (error) {
      console.log(error);
    }
    
    
    
  }

  const handleActiveChapter = (chapterId) => {
    setActiveChapterId(chapterId);
  };
  
  

 
    
console.log( )
  return (
    
      <div className="ml-auto h-full w-full bg-white overflow-y-scroll relative shadow-lg">
            
            <div className="h-10 w-full bg-white flex items-center sticky top-0">
              <h1 className="text-xs  ml-3 font-bold lg:text-sm  ">Course content</h1>  
               
              <button className='ml-auto p-3 lg:hidden'
                onClick={()=>props.handleExitChapters()}
              >
                <CloseIcon  />
              </button>
            </div>
            
            <div>
              {fetchChapters.map((item, index) => (
              
                <Chapter
                 key={item.id}
                  id={item.id}
                  title={item.title}
                  chapter_no={item.order_index}
                  description={item.description}
                  handleOpenChapter={handleShowChapter }
                  handleActiveChapter={handleActiveChapter}
                  isEditChapter={isEditChapter}
                  isActive={activeChapterId === item.id} 
                />
              
              ))
              }
            </div>
            
        </div>
        
   
  )
}
