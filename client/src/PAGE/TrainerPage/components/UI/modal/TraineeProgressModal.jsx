import React, {useState, useEffect} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Chapter from '../../course/Chapter.jsx';
import { API_URL } from '../../../../../api.js';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ExcelGenerator from '../ExcelGenerator.jsx';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function AddChapterModal(props) {
    const exit = false
    const [activeChapterId, setActiveChapterId] = useState(null);
    const [traineeDetails , setTraineeDetailes] = useState([])
    const [isQuiz, setQuiz] = useState(false);
    const [isVideo, setVideo] = useState(false);
    const [videoData, setVideoData] = useState([]);
    const [videoType, setVideoType]= useState("")
    const [quizData, setQuizData] = useState([]);
    const [questionLength, setQuestionLength] = useState()
    const [imageData, setImageData] = useState([])
    const [isData, setIsData] = useState(null)
    const [isImage, setIsImage] = useState(false)
    const [isOpenChapters, setIsOpenChapters] = useState(false)

    const [chapters, setChapters] = useState([])
    useEffect(()=>{
        const fetchChapter = async()=>{
            try {
                const result = await axios.get(`${API_URL}/trainer/course/${props.courseId}`, { withCredentials: true })
                 
                setChapters(result.data.data)
            } catch (error) {
                console.log('error')
            }
          
          
        }
        fetchChapter()
    },[])

    
    async function handleShowChapter(id){
        
        try {
            const [video, quiz, info, image] = await Promise.all([
                axios.post(`${API_URL}/trainer/chapter/mediaitems`, {courseId: props.courseId, chapterId: id  }, {withCredentials: true}),
                axios.post(`${API_URL}/trainer/chapter/quiz`, {chapterId: id  }, {withCredentials: true}),
                axios.post(`${API_URL}/trainer/course/traineeprogress`, {course_id: props.courseId}, {withCredentials: true}),
                axios.get(`${API_URL}/trainer/${props.courseId}/${id}/traineeimageprogress`, {withCredentials: true})
            ])
            
            setTraineeDetailes(info.data.data)
            setQuiz(quiz.data.success)
            
            
           console.log(video.data, quiz.data, info.data, image.data)
            if(video.data.success){
                setVideoType(video.data.data[0].item_type)

                if(video.data.data[0].item_type === 'IMAGE'){
                    
                    setImageData(image.data.data)
                    setIsData(true)
                    setVideo(false)
                    setIsImage(true)
                    
                }
                try {
                    const result = await axios.get(`${API_URL}/trainer/${props.courseId}/${id}/traineevideoprogress`, {withCredentials: true})
                    setVideoData(result.data.data)
                    setIsData(true)
                    setVideo(true)
                    setIsImage(false)
                } catch (error) {
                    console.error("Error fetching video progress:", videoErr);
                }

            }else if(quiz.data.success){

                try {
                    const result = await axios.get(`${API_URL}/trainer/${props.courseId}/${id}/traineequizprogress`, {withCredentials: true})
                    setQuizData(result.data.data)
                    setQuestionLength(result.data.quizLength)
                    setIsData(true)
                    setIsImage(false)
                    setVideo(false)
                } catch (error) {
                    console.error("Error fetching video progress:", videoErr);
                }
                
            }else{
                setIsData(false)
            }
            
        } catch (err) {
           console.log(err)
        }
       
    }
    

  return (
    <div className='w-full h-full bg-gray-500/40 fixed inset-0 flex justify-center items-center z-200 '>
      <div className='w-10/12 h-11/12 bg-white p-3 rounded relative overflow-scroll'>

        
        <button onClick={()=>{props.onExit(exit); props.onRefresh(props.chapter_Details.id);}}><CloseIcon /></button>
        <h1  className='text-2xl mt-3 mb-3 '>Trainee Progress</h1>
        <ExcelGenerator course_id={props.courseId}/>
        {isOpenChapters?null:<button className="p-2 bg-green-700 lg:hidden absolute right-2 top-26 z-50 text-white rounded "
            onClick={()=>{setIsOpenChapters(true)}}>
            Chapter
        </button>}
        <div className='w-full h-9/12 flex'>
        
        
            <div className='w-full h-full bg-white'>
                <div className='flex '>
                {isData?<table class="w-full bg-white shadow-md rounded-lg overflow-hidden border-1">
                    <thead class="bg-green-600 text-white">
                        <tr>
                        <th class="py-3 px-6 text-left">ID</th>
                        <th class="py-3 px-6 text-left">Name</th>
                        <th class="py-3 px-6 text-center">{isQuiz&&'Quiz'}{isVideo&&'Video'}{isImage&&'Image'} Completed</th>
                        {isQuiz&&<th class="py-3 px-6 text-center">Score</th>}
                        </tr>
                    </thead>
                    <tbody class="text-gray-700">
                    {videoType === 'VIDEO'&& !isQuiz&&(videoData.map((info, index)=>{
                        return(
                        <tr class="border-b hover:bg-gray-100 transition duration-300" key={index}>
                            <td class="py-4 px-6 border-x-1">{info.student_id}</td>
                            <td class="py-4 px-6 border-x-1">{info.surname.charAt(0).toUpperCase() + info.surname.slice(1)} {info.first_name.charAt(0).toUpperCase()+ info.first_name.slice(1)} </td>
                            <td class="py-4 px-6  text-center">{
                                info.is_completed 
                                ?<CheckCircleRoundedIcon fontSize='large' className='text-green-400'/>
                                :<ClearRoundedIcon fontSize='large' className='text-red-400' /> 
                            }</td>
                            {isQuiz&&<td class="py-4 px-6 text-center space-x-2 border-y-1"></td>}
                        </tr>)
                        }))}

                        {videoType === 'IMAGE'&& !isQuiz&&(imageData.map((info, index)=>{
                        return(
                        <tr class="border-b hover:bg-gray-100 transition duration-300" key={index}>
                            <td class="py-4 px-6 border-x-1">{info.student_id}</td>
                            <td class="py-4 px-6 border-x-1">{info.surname.charAt(0).toUpperCase() + info.surname.slice(1)} {info.first_name.charAt(0).toUpperCase()+ info.first_name.slice(1)}</td>
                            <td class="py-4 px-6  text-center">{
                                (info.is_completed)
                                ?<CheckCircleRoundedIcon fontSize='large' className='text-green-400'/>
                                :<ClearRoundedIcon fontSize='large' className='text-red-400' /> 
                            }</td>
                            
                        </tr>)
                        
                    }))}
                    {isQuiz&&(quizData.map((info, index)=>{
                        return(
                        <tr class="border-b hover:bg-gray-100 transition duration-300" key={index}>
                            <td class="py-4 px-6 border-x-1">{info.student_id}</td>
                            <td class="py-4 px-6 border-x-1">{info.surname.charAt(0).toUpperCase() + info.surname.slice(1)} {info.first_name.charAt(0).toUpperCase()+ info.first_name.slice(1)}</td>
                            <td class="py-4 px-6  text-center">{
                                (info.percentage !== null)
                                ?<CheckCircleRoundedIcon fontSize='large' className='text-green-400'/>
                                :<ClearRoundedIcon fontSize='large' className='text-red-400' /> 
                            }</td>
                            {isQuiz&&<td class="py-4 px-6 text-center space-x-2 border-y-1">{info.score}{(info.percentage !== null)?`/${questionLength}`:null}</td>}
                        </tr>)
                    }))} 
                    

                    </tbody>
                    </table>: <p>no record yet</p>  }
                </div>
                
            </div>
            <div className={isOpenChapters?`h-10/12 w-6/12 absolute right-0 z-100 `:'lg:w-100 lg:h-full lg:ml-auto lg:overflow-y-scroll hidden lg:block'}>
                <div className="h-10 w-full bg-white flex items-center sticky top-0">
                    <h1 className="text-large ml-3 font-bold ">Chapter</h1>
                    <button className=' p-3 lg:hidden mr-2 ml-auto'
                    onClick={()=>setIsOpenChapters(false)}
                    >
                    <CloseIcon  />
                </button>
                </div>
                
                <div className=''>
                    {chapters.map((item, index) => (
                    
                    <Chapter
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    chapter_no={item.order_index}
                    isActive={activeChapterId === item.id} 
                    handleActiveChapter={()=>setActiveChapterId(item.id)}
                    handleOpenChapter={handleShowChapter}
                    
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
