import React,{useState} from 'react'
import CreateQuizModal from '../UI/modal/CreateQuizModal.jsx';
import UploadImagesModal from '../UI/modal/UploadImagesModal.jsx';
import VideoUploadModal from '../UI/modal/VideoUploadModal.jsx'

export default function CourseAddContent(props) {
    const [isLessonUploaded, setIsLessonUploaded] = useState(false);
    const [isQuizUpload, setQuizUpload] = useState(false);
    const [isUploadVideo, setUploadvideo] = useState(false);
    const [isUploadImage, setUploadImage] = useState(false);
    const [isUplaodCertificate, setUplaodCertificate] = useState(false);

    function handleExitQuizModal(exit){
      setQuizUpload(exit)
      props.onRefresh()
    }
    function handleExitVideoUploadModal(exit){
      setUploadvideo(exit)
      props.onRefresh()
    }
    function handleExitImageUploadModal(exit){
      setUploadImage(exit)
      props.onRefresh()
    }
    
    async function handleUploadCertificate(){
      console.log(id,chapterDetails.id)
      try {
        const res = await axios.post(`${API_URL}/admin/chapter/addcertificate`, 
          {courseId:id, chapterId:chapterDetails.id}, 
          {withCredentials:true})
          console.log(res)
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className='w-full h-full relative'>
        {isQuizUpload? <CreateQuizModal onExit={handleExitQuizModal} chapterInfo={props.chapterInfo} />: null }  
        {isUploadVideo? <VideoUploadModal onExit={handleExitVideoUploadModal} chapterInfo={props.chapterInfo}  courseId={props.courseId} /> :null} 
        {isUploadImage? <UploadImagesModal onExit={handleExitImageUploadModal} chapterInfo={props.chapterInfo} courseId={props.courseId} /> : null} 

        {isLessonUploaded?null
        :<div className='h-full w-full grid place-items-center'>
        <button 
            className= {isQuizUpload? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
            onClick={(e)=>{ 
            e.preventDefault(); 
            setQuizUpload(true)
            setUploadvideo(false)
            setUploadImage(false)
            setUplaodCertificate(false)
            }}>
                Create Quiz
        </button>

        <button 
          className= {isUploadVideo? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
          onClick={(e)=>{ 
            e.preventDefault();
            setQuizUpload(false) 
            setUploadvideo(true)
            setUploadImage(false)
            setUplaodCertificate(false)
            }}>
                Upload Video
        </button>

        <button 
            className= {isUploadImage? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
            onClick={(e)=>{
            e.preventDefault();
              setQuizUpload(false)
              setUploadvideo(false)
              setUploadImage(true)
              setUplaodCertificate(false)
            }}>
                Upload Image
         </button>

         <button
              className= {isUplaodCertificate? 'w-50 h-10 text-2xl bg-green-500' : 'w-50 h-10 text-2xl bg-white'}
              onClick={(e)=>{
                e.preventDefault()
                setQuizUpload(false)
                setUploadvideo(false)
                setUploadImage(false)
                setUplaodCertificate(true)
                handleUploadCertificate()
              }}>
            Add Certificate
          </button>
    
    
                  
                  
        </div>}
    </div>
  )
}
