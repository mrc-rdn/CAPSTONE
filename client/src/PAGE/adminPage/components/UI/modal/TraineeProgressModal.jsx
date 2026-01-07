import React, {useState, useEffect} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Chapter from '../../course/Chapter.jsx';
import { API_URL } from '../../../../../api.js';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ExcelGenerator from '../ExcelGenerator.jsx';

export default function AddChapterModal(props) {
    const exit = false
    const [activeChapterId, setActiveChapterId] = useState(null);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [isCertificate, setIsCertificate] = useState(false);
    const [isText, setIsText] = useState(false);
    const [isData, setIsData] = useState(null);

    const [videoData, setVideoData] = useState([]);
    const [imageData, setImageData] = useState([])
    const [quizData, setQuizData] = useState([]);
    const [questionLength, setQuestionLength] = useState()
    const [textData, setTextData] = useState([])
    const [certificateData, setCertificateData] = useState([])
    

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
            const [video, quiz, text, certificate] = await Promise.all([
                axios.post(`${API_URL}/admin/chapter/mediaitems`, {courseId: props.courseId, chapterId: id  }, {withCredentials: true}),
                axios.post(`${API_URL}/admin/chapter/quiz`, {chapterId: id  }, {withCredentials: true}),
                axios.get(`${API_URL}/admin/texteditor/${props.courseId}/${id}`, {withCredentials: true}),
                axios.get(`${API_URL}/admin/${props.courseId}/${id}/getcertificate`, {withCredentials:true}),
            ])
            console.log(video.data, quiz.data, text.data, certificate.data)

            if(video.data.success){
                
                if(video.data.data[0].item_type === "VIDEO"){
                    const result = await axios.get(`${API_URL}/admin/traineeprogress/${props.courseId}/${id}`, {withCredentials:true})
                    setIsVideo(true)
                    setIsData(true)
                    setIsImage(false)
                    setIsQuiz(false)
                    setIsText(false)
                    setIsCertificate(false)
                    setVideoData(result.data.data)

                    
                }else if(video.data.data[0].item_type === "IMAGE"){
                    const result = await axios.get(`${API_URL}/admin/traineeprogress/${props.courseId}/${id}`, {withCredentials:true})
                    setIsVideo(false)
                    setIsData(true)
                    setIsImage(true)
                    setIsQuiz(false)
                    setIsText(false)
                    setIsCertificate(false)
                    setImageData(result.data.data)
                }

            }else if(quiz.data.success){
                //admin/:courseId/:chapterId
                 const result = await axios.get(`${API_URL}/admin/${props.courseId}/${id}/traineequizprogress`, {withCredentials:true})
                    setIsVideo(false)
                    setIsData(true)
                    setIsImage(false)
                    setIsQuiz(true)
                    setIsText(false)
                    setIsCertificate(false)
                    setQuizData(result.data.data)
                    setQuestionLength(result.data.quizLength)
                    console.log(result.data)
                
            }else if (text.data.success){
                const result = await axios.get(`${API_URL}/admin/traineeprogress/${props.courseId}/${id}`, {withCredentials:true})
                    setIsVideo(false)
                    setIsData(true)
                    setIsImage(false)
                    setIsQuiz(false)
                    setIsText(true)
                    setIsCertificate(false)
                    setTextData(result.data.data)
                    console.log(result.data.data)
            
            }else if (certificate.data.success){
                const result = await axios.get(`${API_URL}/admin/traineeprogress/${props.courseId}/${id}`, {withCredentials:true})
                    setIsVideo(false)
                    setIsData(true)
                    setIsImage(false)
                    setIsQuiz(false)
                    setIsText(false)
                    setIsCertificate(true)
                    setCertificateData(result.data.data)
            }else{
                setIsVideo(false)
                setIsData(false)
                setIsImage(false)
                setIsQuiz(false)
                setIsText(false)
                setIsCertificate(false)
            }

            
          
        } catch (err) {
           console.log(err)
        }
       
    }
    

  return (
    <div className='w-full h-full bg-gray-500/40 fixed inset-0 flex justify-center items-center z-200'>
      <div className='w-10/12 h-11/12 bg-white p-3 rounded'>


        <button onClick={()=>{props.onExit(exit); props.onRefresh(props.chapter_Details.id);}}><CloseIcon /></button>
        <h1  className='text-2xl mt-3 mb-3 '>Trainee Progress</h1>
        <ExcelGenerator course_id={props.courseId}/>
        <div className='w-full h-9/12 flex'>
        
        
            <div className='w-full h-full bg-white'>
                <div className='flex '>
                {isData?<table class="w-full bg-white shadow-md rounded-lg overflow-hidden border-1">
                    <thead class="bg-green-600 text-white">
                        <tr>
                        <th class="py-3 px-6 text-left">ID</th>
                        <th class="py-3 px-6 text-left">Name</th>
                        <th class="py-3 px-6 text-center">{isQuiz&&'Quiz Completed'}{isVideo&&'Video Completed'}{isImage&&'Image Completed'} {isText&&'Text Completed'}{isCertificate&&'Certificate'} </th>
                        {isQuiz&&<th class="py-3 px-6 text-center">Score</th>}
                        </tr>
                    </thead>
                    <tbody class="text-gray-700">
                    {isVideo &&(videoData.map((info, index)=>{
                        return(
                        <tr class="border-b hover:bg-gray-100 transition duration-300" key={index}>
                            <td class="py-4 px-6 border-x-1">{info.user_id}</td>
                            <td class="py-4 px-6 border-x-1">{info.surname.charAt(0).toUpperCase() + info.surname.slice(1)} {info.first_name.charAt(0).toUpperCase()+ info.first_name.slice(1)} </td>
                            <td class="py-4 px-6  text-center">{
                                info.is_done
                                ?<CheckCircleRoundedIcon fontSize='large' className='text-green-400'/>
                                :<ClearRoundedIcon fontSize='large' className='text-red-400' /> 
                            }</td>
                            {isQuiz&&<td class="py-4 px-6 text-center space-x-2 border-y-1"></td>}
                        </tr>)
                        }))}

                        {isImage && !isQuiz&&(imageData.map((info, index)=>{
                        return(
                        <tr class="border-b hover:bg-gray-100 transition duration-300" key={index}>
                            <td class="py-4 px-6 border-x-1">{info.user_id}</td>
                            <td class="py-4 px-6 border-x-1">{info.surname.charAt(0).toUpperCase() + info.surname.slice(1)} {info.first_name.charAt(0).toUpperCase()+ info.first_name.slice(1)}</td>
                            <td class="py-4 px-6  text-center">{
                                (info.is_done)
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
                    {isText&&(textData.map((info, index)=>{
                        return(
                        <tr class="border-b hover:bg-gray-100 transition duration-300" key={index}>
                            <td class="py-4 px-6 border-x-1">{info.user_id}</td>
                            <td class="py-4 px-6 border-x-1">{info.first_name} {info.surname}</td>
                            <td class="py-4 px-6  text-center">{
                                (info.is_done)
                                ?<CheckCircleRoundedIcon fontSize='large' className='text-green-400'/>
                                :<ClearRoundedIcon fontSize='large' className='text-red-400' /> 
                            }</td>
                            
                        </tr>)
                        
                        }))}
                    {isCertificate&&(certificateData.map((info, index)=>{
                        return(
                        <tr class="border-b hover:bg-gray-100 transition duration-300" key={index}>
                            <td class="py-4 px-6 border-x-1">{info.user_id}</td>
                            <td class="py-4 px-6 border-x-1">{info.first_name} {info.surname}</td>
                            <td class="py-4 px-6  text-center">{
                                (info.is_done)
                                ?<CheckCircleRoundedIcon fontSize='large' className='text-green-400'/>
                                :<ClearRoundedIcon fontSize='large' className='text-red-400' /> 
                            }</td>
                            
                        </tr>)
                        
                        }))}
                    

                    </tbody>
                    </table >
                    
                        
            
                    :<p>no record yet</p> }
                </div>
            </div>
            <div className='w-100 h-full ml-auto overflow-y-scroll'>
                <div className="h-10 w-full bg-white flex items-center sticky top-0">
                    <h1 className="text-large ml-3 font-bold ">Chapter</h1>
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
