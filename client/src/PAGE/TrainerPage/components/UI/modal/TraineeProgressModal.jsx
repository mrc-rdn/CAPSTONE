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
            const [video, quiz, text, certificate] = await Promise.all([
                axios.post(`${API_URL}/trainer/chapter/mediaitems`, {courseId: props.courseId, chapterId: id  }, {withCredentials: true}),
                axios.post(`${API_URL}/trainer/chapter/quiz`, {chapterId: id  }, {withCredentials: true}),
                axios.get(`${API_URL}/trainer/texteditor/${props.courseId}/${id}`, {withCredentials: true}),
                axios.get(`${API_URL}/trainer/${props.courseId}/${id}/getcertificate`, {withCredentials:true}),
            ])
            console.log(video.data, quiz.data, text.data, certificate.data)

            if(video.data.success){
                
                if(video.data.data[0].item_type === "VIDEO"){
                    const result = await axios.get(`${API_URL}/trainer/traineeprogress/${props.courseId}/${id}`, {withCredentials:true})
                    setIsVideo(true)
                    setIsData(true)
                    setIsImage(false)
                    setIsQuiz(false)
                    setIsText(false)
                    setIsCertificate(false)
                    setVideoData(result.data.data)

                    
                }else if(video.data.data[0].item_type === "IMAGE"){
                    const result = await axios.get(`${API_URL}/trainer/traineeprogress/${props.courseId}/${id}`, {withCredentials:true})
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
                  const result1 = await axios.get(`${API_URL}/trainer/traineeprogress/${props.courseId}/${id}`, {withCredentials:true})
                  const result = await axios.get(`${API_URL}/trainer/${props.courseId}/${id}/traineequizprogress`, {withCredentials:true})

                const filtered = result.data.data.filter(item => 
                  result1.data.data.some(trainee => trainee.user_id === item.student_id)
                );

                
                    setIsVideo(false)
                    setIsData(true)
                    setIsImage(false)
                    setIsQuiz(true)
                    setIsText(false)
                    setIsCertificate(false)
                    setQuizData(filtered)
                    setQuestionLength(result.data.quizLength)
                    console.log(result.data)
                
            }else if (text.data.success){
                const result = await axios.get(`${API_URL}/trainer/traineeprogress/${props.courseId}/${id}`, {withCredentials:true})
                    setIsVideo(false)
                    setIsData(true)
                    setIsImage(false)
                    setIsQuiz(false)
                    setIsText(true)
                    setIsCertificate(false)
                    setTextData(result.data.data)
                    console.log(result.data.data)
            
            }else if (certificate.data.success){
                const result = await axios.get(`${API_URL}/trainer/traineeprogress/${props.courseId}/${id}`, {withCredentials:true})
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
  <div className="w-full h-full bg-black/50 fixed inset-0 flex justify-center items-center z-50">
    <div className="w-11/12 h-[90vh] bg-white rounded-xl shadow-xl flex flex-col">

      {/* ===== HEADER (MATCHES OTHER MODALS) ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#6F8A6A]/40">
        <h1 className="text-xl font-semibold text-[#2D4F2B]">
          Trainee Progress
        </h1>
        <button
          onClick={() => {
            props.onExit(exit);
            props.onRefresh(props.chapter_Details.id);
          }}
          className="w-9 h-9 flex items-center justify-center text-[#2D4F2B]"
        >
          <CloseIcon />
        </button>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex flex-1 gap-4 overflow-hidden p-6">

        {/* ===== TABLE SECTION ===== */}
        <div className="flex-1 overflow-y-auto">

          {/* Table Header + Excel */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">
              Trainee Records
            </h2>
            <ExcelGenerator course_id={props.courseId} />
          </div>

          {isData ? (
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow">

              {/* TABLE TOP HEADER */}
              <thead className="bg-[#2D4F2B] text-white">
                <tr>
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-center">
                    {isQuiz && "Quiz Completed"}
                    {isVideo && "Video Completed"}
                    {isImage && "Image Completed"}
                    {isText && "Text Completed"}
                    {isCertificate && "Certificate"}
                  </th>
                  {isQuiz && (
                    <th className="py-3 px-6 text-center">Score</th>
                  )}
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="text-gray-700">
                {isVideo && videoData.map((info, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-6">{info.user_id}</td>
                    <td className="py-3 px-6">
                      {info.first_name.charAt(0).toUpperCase() + info.first_name.slice(1)}{" "}
                       {info.surname.charAt(0).toUpperCase() + info.surname.slice(1)}
                      
                     
                    </td>
                    <td className="py-3 px-6 text-center">
                      {info.is_done
                        ? <CheckCircleRoundedIcon fontSize="large" className="text-green-500" />
                        : <ClearRoundedIcon fontSize="large" className="text-red-500" />}
                    </td>
                    {isQuiz && <td />}
                  </tr>
                ))}

                {isImage && !isQuiz && imageData.map((info, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-6">{info.user_id}</td>
                    <td className="py-3 px-6">
                      {info.first_name.charAt(0).toUpperCase() + info.first_name.slice(1)}{" "}
                      {info.surname.charAt(0).toUpperCase() + info.surname.slice(1)}
                      
                    </td>
                    <td className="py-3 px-6 text-center">
                      {info.is_done
                        ? <CheckCircleRoundedIcon fontSize="large" className="text-green-500" />
                        : <ClearRoundedIcon fontSize="large" className="text-red-500" />}
                    </td>
                  </tr>
                ))}

                {isQuiz && quizData.map((info, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-6">{info.student_id}</td>
                    <td className="py-3 px-6">
                      {info.first_name.charAt(0).toUpperCase() + info.first_name.slice(1)}{" "}
                      {info.surname.charAt(0).toUpperCase() + info.surname.slice(1)}
                      
                    </td>
                    <td className="py-3 px-6 text-center">
                      {info.percentage !== null
                        ? <CheckCircleRoundedIcon fontSize="large" className="text-green-500" />
                        : <ClearRoundedIcon fontSize="large" className="text-red-500" />}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {info.score}{info.percentage !== null ? `/${questionLength}` : null}
                    </td>
                  </tr>
                ))}

                {isText && textData.map((info, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-6">{info.user_id}</td>
                    <td className="py-3 px-6">{info.first_name} {info.surname}</td>
                    <td className="py-3 px-6 text-center">
                      {info.is_done
                        ? <CheckCircleRoundedIcon fontSize="large" className="text-green-500" />
                        : <ClearRoundedIcon fontSize="large" className="text-red-500" />}
                    </td>
                  </tr>
                ))}

                {isCertificate && certificateData.map((info, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-6">{info.user_id}</td>
                    <td className="py-3 px-6">{info.first_name} {info.surname}</td>
                    <td className="py-3 px-6 text-center">
                      {info.is_done
                        ? <CheckCircleRoundedIcon fontSize="large" className="text-green-500" />
                        : <ClearRoundedIcon fontSize="large" className="text-red-500" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No record yet
            </p>
          )}
        </div>

        {/* ===== COURSE OUTLINE ===== */}
        <div className="w-80 bg-gray-100 border-l border-gray-300 p-4 overflow-y-auto">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-800">
              Course Outline
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            {chapters.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveChapterId(item.id);
                  handleShowChapter(item.id);
                }}
                className={`rounded-xl p-4 cursor-pointer transition
                  ${activeChapterId === item.id
                    ? "bg-[#2D4F2B] text-white shadow-md"
                    : "bg-white hover:bg-gray-200 text-gray-800"}
                `}
              >
                <p className={`text-xs font-semibold mb-1
                  ${activeChapterId === item.id ? "text-green-100" : "text-gray-500"}
                `}>
                  Section {item.order_index}
                </p>

                <p className="text-base font-semibold">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
);
}