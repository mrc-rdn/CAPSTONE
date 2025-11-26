import React, {useState, useEffect} from 'react'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddChapterModal from './AddChapterModal';
import AddTraineeModal from './AddTraineeModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios'
import Chapter from './chapter';
import VideoUploadModal from './VideoUploadModal';
import MediaPlayer from './MediaPlayer';
import CreateQuiz from './CreateQuizModal';
import QuizList from './QuizList';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditChapterModal from './EditChapterModal';
import DeleteContent from './DeleteContent';
import UploadImages from './uploadImagesModal';
import ImagePlayer from './ImagePlayer';
import { API_URL } from '../../../api';



export default function SelectedCourse(props) {
    const exit = false; 
    const [course, setCourse] = useState(props.data_course)
    const {id, title, description } = course
    const [isChapterModal, setChapterModal] = useState(false);
    const [isEnrollModal, setEnrollModal] = useState(false);
    const [isQiuzModal, setQiuzModal] =  useState(false);
    
    
    const [isQuizUpload, setQuizUpload] = useState(false);
    const [isUploadVideo, setUploadvideo] = useState(false);
    const [isUploadImage, setUploadImage] = useState(false)

    const [isVideo, setVideo] = useState(false);
    const [videoData, setVideoData] = useState("")
    const [videoId, setVideoId] = useState("")
    const [isQuiz, setQuiz] = useState(false)
    const [isLessonUploaded, setLessonUpload] = useState(false)
    const [quizData, setQuizData] = useState([]);
    const [chapterDetails , setChapterDetails] = useState({id: null, chapter_index: null})
    

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
      setQuizUpload(exit)
    }
    function handleExitChapterEditModal(exit){
      setEditChapterModal(exit)
    }
    function handleExitVideoUploadModal(exit){
      setUploadvideo(exit)
    }
    function handleExitImageUploadModal(exit){
      setUploadImage(exit)
    }
    
    
    
    async function handleShowChapter(id, chapter_index){
      
      setChapterDetails({id: id, index_chapter: chapter_index})
      try {
        const [video, quiz] = await Promise.all([
          axios.post(`${API_URL}/admin/chapter/chapteritems`, {courseId: course.id, chapterId: id  }, {withCredentials: true}),
          axios.post(`${API_URL}/admin/chapter/quiz`, {chapterId: id  }, {withCredentials: true})

        ])
          if(video.data.success){
            console.log(video.data.data)
            setVideo(video.data.success)
            setVideoData(video.data.data[0])
            setQuiz(false)
            setLessonUpload(false)
            setVideoId(video.data.data[0].id)
            console.log(video)
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


    const [chapter, setChapter] = useState([]);
    const [chapterLength, setChapterLength] = useState([])
    const [refresh, setRefresh]= useState(0);
    useEffect(()=>{
      async function fetchData(){
       // console.log(course)
        try {
          
          const [response, chapterItems] = await Promise.all([
            axios.post(`${API_URL}/admin/course/chapter`, {course_Id: course.id}, {withCredentials: true}),
            axios.post(`${API_URL}/admin/chapter/chapterfirstitem`, {courseId: course.id}, {withCredentials: true})

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
      
    }, [refresh])
    const [activeChapterId, setActiveChapterId] = useState(null);
    function handleRefresh(index){
      setRefresh(prev => prev + 1)
      setActiveChapterId(index === 1)
      console.log(index)
    }

    const handleDragEnd = async (result) => {
      const { source, destination } = result;

      if (!destination) return; // dropped outside

      // Copy chapter array
      const items = Array.from(chapter);

      // Remove the dragged item
      const [reorderedItem] = items.splice(source.index, 1);

      // Insert it at new position
      items.splice(destination.index, 0, reorderedItem);

      // Update local state
      setChapter(items);

      // Prepare data for backend
      const orderedChapters = items.map((item, index) => ({
        id: item.id,
        order_index: index + 1, // or whatever your indexing is
      }));

      try {
        await axios.put(`${API_URL}/admin/chapter/reorder`, { orderedChapters });
        console.log('Chapter order saved!');
      } catch (err) {
        console.error('Failed to save chapter order', err);
      }
    };


    const [isEditChapter, setEditChapter] = useState(false)
    function handleEditChapter (){
      setEditChapter(!isEditChapter)
    }

    const [isEditChapterModal, setEditChapterModal] = useState(false)
    const [EditChapterData, setEditChapterData] = useState({chapterId:null, chapter_index:null, chapter_title:null, chapter_description:null})
    function handleShowEditChapterModal(chapterId, chapter_index, chapter_title, chapter_description ){
      setEditChapterModal(true)
      setEditChapterData({chapterId:chapterId, chapter_index: chapter_index, chapter_title:chapter_title, chapter_description: chapter_description})
    }
    

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
          <button
            className='h-full ml-auto m-3 hover:border-b-5 ransition-colors duration-50 ease-in-out p-3'>
              Trainee Progress
          </button>
          <button
            onClick={handleOpenChapterModal}
            className='h-full m-3 hover:border-b-5 ransition-colors duration-50 ease-in-out p-3'>
              + Add Chapter
          </button>

          <button
            onClick={handleOpenEnrollModal}
            className='h-full m-3 hover:border-b-5 ransition-colors duration-50 ease-in-out p-3'>
            + Add Trainee
          </button>
        </div>
        

        {/* {this section the main content & the upload section} */}
        <div className='flex h-11/12 w-full flex '>
        {/* video & quiz upload and video and quiz  */}
          <div className='w-10/12 h-full relative'>
            {isEditChapter
            ? (isLessonUploaded ? null : <DeleteContent isQuiz={isQuiz} isVideo={isVideo} quizData={quizData} videoData={videoData} onRefresh={handleRefresh}/>)
            : null}

            {isQuiz?<QuizList quizData={quizData} /> : null }
            {isVideo&&videoData.item_type === "VIDEO"? <MediaPlayer videoURL={videoData.source_url} videoId={videoId} videoData={videoData} />:null}
            {isVideo&&videoData.item_type === "IMAGE"? <ImagePlayer videoData={videoData}/>:null}
            

            {isLessonUploaded?<div className='h-full w-full grid place-items-center'>
              <button 
                className= {isQuizUpload? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
                onClick={
                  (e)=>{ 
                    e.preventDefault(); 
                    setQuizUpload(true)
                    setUploadvideo(false)
                    setUploadImage(false)}}>
                      Create Quiz
              </button>

              <button 
                className= {isUploadVideo? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
                onClick={(e)=>{ 
                  e.preventDefault(); 
                  setQuizUpload(false) 
                  setUploadvideo(true)
                  setUploadImage(false)}}>
                    Upload Video
              </button>

              <button 
                  className= {isUploadImage? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
                  onClick={(e)=>{
                    e.preventDefault()
                    setQuizUpload(false)
                    setUploadvideo(false)
                    setUploadImage(true)
                    
                  }}>
                Upload Image
              </button>


              
              
            </div>:null}
          </div>
            
          {/* chapter section navigation */}

          <div className="ml-auto h-full w-4/12 bg-white overflow-y-scroll relative">
            
            <div className="h-10 w-full bg-white flex items-center sticky top-0">
              <h1 className="text-large ml-3 font-bold ">Course content</h1>
              <button
              onClick={handleEditChapter}
              className='m-3 ml-auto'
              ><MoreHorizIcon  />
              </button>
            </div>
            
            {isEditChapter?<div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="chapterList">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {chapter.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={String(item.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? "bg-green-300" : ""}`}
                          >
                            <Chapter
                              id={item.id}
                              title={item.title}
                              chapter_no={item.order_index}
                              description={item.description}
                              handleOpenChapter={handleShowChapter}
                              handleActiveChapter={()=>setActiveChapterId(item.id)}
                              handleShowEditChapterModal={handleShowEditChapterModal}
                              onRefresh={handleRefresh}
                              isEditChapter={isEditChapter}
                              isVideo={isVideo}
                              isQuiz={isQuiz}
                              isActive={activeChapterId === item.id } 
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            </div>
            :<div>
              {chapter.map((item, index) => (
              
                <Chapter
                 key={item.id}
                  id={item.id}
                  title={item.title}
                  chapter_no={item.order_index}
                  description={item.description}
                  handleOpenChapter={handleShowChapter }
                  handleActiveChapter={()=>setActiveChapterId(item.id)}
                  isEditChapter={isEditChapter}
                  isActive={activeChapterId === item.id} 
                />
              ))
              }
            </div>}
            
          </div>
        </div>


          {isChapterModal?<AddChapterModal onExit={handleExitChapterModal} onRefresh={handleRefresh} course_id={id} chapter_no={chapterLength} chapter_Details={chapterDetails}/>: null}
          {isEnrollModal?<AddTraineeModal onExit={handleExitEnrollModal} courseId={id} />:null}
          {isQuizUpload? <CreateQuiz onExit={handleExitQuizModal} chapterId={chapterDetails.id} />: null }  
          {isUploadVideo? <VideoUploadModal onExit={handleExitVideoUploadModal} onRefresh={handleRefresh} course_id={id} chapter_details={chapterDetails}/> :null} 
          {isUploadImage? <UploadImages onExit={handleExitImageUploadModal} onRefresh={handleRefresh} course_id={id} chapter_details={chapterDetails} /> : null}       
          {isEditChapterModal? <EditChapterModal onExit={handleExitChapterEditModal} onRefresh={handleRefresh} chapter_Details={chapterDetails} chapterData={EditChapterData} courseId={id} isVideo={isVideo} isQuiz={isQuiz} />: null}

      </div>
    </div>
    
  )
}
