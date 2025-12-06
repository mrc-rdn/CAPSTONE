import React, {useState, useEffect} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Chapter from '../course/Chapter.jsx';
import { API_URL } from '../../../../api.js';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ExcelGenerator from './ExcelGenerator.jsx';

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

    const [chapters, setChapters] = useState([])
    useEffect(()=>{
        const fetchChapter = async()=>{
            try {
                const result = await axios.get(`${API_URL}/admin/course/${props.courseId}`, { withCredentials: true })
                 
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
                axios.post(`${API_URL}/admin/chapter/mediaitems`, {courseId: props.courseId, chapterId: id  }, {withCredentials: true}),
                axios.post(`${API_URL}/admin/chapter/quiz`, {chapterId: id  }, {withCredentials: true}),
                axios.post(`${API_URL}/admin/course/traineeprogress`, {course_id: props.courseId}, {withCredentials: true}),
                axios.post(`${API_URL}/admin/course/traineeimageprogress`, {course_id: props.courseId, chapter_id: id  }, {withCredentials: true})
            ])
            console.log(quiz.data.success, video.data.success, info.data.data, image.data.data)
            setTraineeDetailes(info.data.data)
            setQuiz(quiz.data.success)
            setVideo(video.data.success)
            
           console.log(video, quiz, info, image)
            if(video.data.success){
                setVideoType(video.data.data[0].item_type)
                if(video.data.data[0].item_type === 'IMAGE'){
                    setImageData(image.data.data)
                    
                }
                try {
                    const result = await axios.post(`${API_URL}/admin/course/traineevideoprogress`, {chapter_id: id, course_id: props.courseId,  }, {withCredentials: true})
                    setVideoData(result.data.data)
                } catch (error) {
                    console.error("Error fetching video progress:", videoErr);
                }
            }
            if(quiz.data.success){
                try {
                    const result = await axios.post(`${API_URL}/admin/course/traineequizprogress`, {chapter_id: id, course_id: props.courseId,  }, {withCredentials: true})
                    setQuizData(result.data.data)
                    setQuestionLength(result.data.quizLength)
                } catch (error) {
                    console.error("Error fetching video progress:", videoErr);
                }
            }
            
        } catch (err) {
           console.log(err)
        }
       
    }
    

  return (
    <div className='w-full h-full bg-gray-500/40 fixed inset-0 grid place-items-center z-200'>
      <div className='w-10/12 h-11/12 bg-white p-3 rounded overflow-y-scroll'>


        <button onClick={()=>{props.onExit(exit); props.onRefresh(props.chapter_Details.id);}}><CloseIcon /></button>
        <h1  className='text-2xl mt-3 mb-3 '>Trainee Progress</h1>
        <ExcelGenerator course_id={props.course_id}/>
        <div className='w-full h-10/12 flex'>
        
        
            <div className='w-full h-full bg-white'>
                <div className='flex '>
                    <table class="w-full bg-white shadow-md rounded-lg overflow-hidden border-1">
                    <thead class="bg-green-600 text-white">
                        <tr>
                        <th class="py-3 px-6 text-left">ID</th>
                        <th class="py-3 px-6 text-left">Name</th>
                        <th class="py-3 px-6 text-center">{isQuiz&&'Quiz'}{isVideo&&'Video'} Completed</th>
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
                            <td class="py-4 px-6 border-x-1">{info.first_name} {info.surname}</td>
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
                            <td class="py-4 px-6 border-x-1">{info.first_name} {info.surname}</td>
                            <td class="py-4 px-6  text-center">{
                                (info.percentage !== null)
                                ?<CheckCircleRoundedIcon fontSize='large' className='text-green-400'/>
                                :<ClearRoundedIcon fontSize='large' className='text-red-400' /> 
                            }</td>
                            {isQuiz&&<td class="py-4 px-6 text-center space-x-2 border-y-1">{info.score}{(info.percentage !== null)?`/${questionLength}`:null}</td>}
                        </tr>)
                    }))} 
                    

                    </tbody>
                    </table>  
                </div>
            </div>
            <div className='w-100 h-full ml-auto'>
                <div className="h-10 w-full bg-white flex items-center sticky top-0">
                    <h1 className="text-large ml-3 font-bold ">Chapter</h1>
                </div>
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
  )
}
