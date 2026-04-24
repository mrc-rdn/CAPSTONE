import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Header from "./components/course/Header.jsx"
import CourseChapters from './components/course/CourseChapters.jsx'
import { API_URL } from '../../api.js'
import AddChapterModal from './components/UI/modal/AddChapterModal.jsx'
import CourseAddContent from "./components/course/CourseAddContent.jsx"
import QuizList from './components/UI/QuizList.jsx'
import MediaPlayer from './components/UI/MediaPlayer.jsx'
import ImagePlayer from './components/UI/ImagePlayer.jsx'
import AddTraineeModal from './components/UI/modal/AddTraineeModal.jsx'
import TraineeProgressModal from "./components/UI/modal/TraineeProgressModal.jsx"
import Certificate from "./components/UI/Certificate.jsx"
import DeleteContent from './components/UI/DeleteContent.jsx'
import AnnouncementModal from './components/UI/modal/AnnouncementModal.jsx'
import TextPresenter from './components/UI/TextPresenter.jsx'
import Navbar from './components/Navbar.jsx'

export default function CourseOverview() {
    const { id, courseTitle } = useParams();
    const [isChapterModal, setIsChapterModal] = useState(false);
    const [isAddTraineeModal, setIsAddTraineeModal] = useState(false);
    const [isTraineeProgressModal, setIsTraineeProgressModal] = useState(false)
    const [refresh, setRefresh] = useState(0)
    const [chapterInfo, setChapterInfo] = useState({ chapterId: "", chapterIndex: "" })

    const [isLesson, setIsLessonUploaded] = useState(false)
    const [isVideo, setIsVideo] = useState(false);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isCertificate, setIsCertificate] = useState(false)
    const [isText, setIstext] = useState(false)
    const [quizData, setQuizData] = useState([])
    const [videoData, setVideoData] = useState([])
    const [certificateData, setCertificateData] = useState([])
    const [textData, setTextData] = useState([])
    const [isEditChapter, setIsEditChapterModal] = useState(false)
    const [isAnnounceModalOpen, setIsAnnouncementModalOpen] = useState(false)

    // Handlers
    const handleOpenChapterAddModal = () => setIsChapterModal(true);
    const handleExitChapterModal = (exit) => { setIsChapterModal(exit); setRefresh(prev => prev + 1); };
    const handleOpenAddTraineeModal = () => setIsAddTraineeModal(true);
    const handleExitaddTraineeModal = () => setIsAddTraineeModal(false);
    const handleOpenTraineeProgress = () => setIsTraineeProgressModal(true);
    const handleExitTraineeProgressModal = () => setIsTraineeProgressModal(false);
    const handleOpenAnnouncementModal = () => setIsAnnouncementModalOpen(true);
    const handleExitAnnouncementModal = () => setIsAnnouncementModalOpen(false);
    const handleRefresh = () => setRefresh(prev => prev + 1);
    const handleEditChapter = (isEdit) => setIsEditChapterModal(!isEdit);

    const handleChaptersInfo = async (chaptersId, chapterIndex, isEdit) => {
        setIsEditChapterModal(isEdit)
        try {
            // Updated to /admin endpoints
            const [video, quiz, certificate, text] = await Promise.all([
                axios.post(`${API_URL}/admin/chapter/mediaitems`, { courseId: id, chapterId: chaptersId }, { withCredentials: true }),
                axios.post(`${API_URL}/admin/chapter/quiz`, { chapterId: chaptersId }, { withCredentials: true }),
                axios.get(`${API_URL}/admin/${id}/${chaptersId}/getcertificate`, { withCredentials: true }),
                axios.get(`${API_URL}/admin/texteditor/${id}/${chaptersId}`, { withCredentials: true })
            ])

            if (quiz.data.success) {
                setIsQuiz(true); setIsVideo(false); setIsLessonUploaded(false); setIsCertificate(false); setIstext(false);
                setQuizData(quiz.data.data)
            } else if (video.data.success) {
                setIsVideo(true); setIsQuiz(false); setIsLessonUploaded(false); setIsCertificate(false); setIstext(false);
                setVideoData(video.data.data[0])
            } else if (certificate.data.success) {
                setIsVideo(false); setIsQuiz(false); setIsCertificate(true); setIsLessonUploaded(false); setIstext(false);
                setCertificateData(certificate.data.data)
            } else if (text.data.success) {
                setIsVideo(false); setIsQuiz(false); setIsCertificate(false); setIsLessonUploaded(false); setIstext(true);
                setTextData(text.data.data)
            } else {
                setIsQuiz(false); setIsVideo(false); setIsCertificate(false); setIstext(false); setIsLessonUploaded(true);
            }
        } catch (error) { console.error(error) }
        setChapterInfo({ chapterId: chaptersId, chapterIndex: chapterIndex })
    }

    return (
        <div className='flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500'>

            

            <div className='flex-1 flex flex-col relative overflow-hidden'>
                
                {/* Same Header Design (Glassmorphism) */}
                <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/50 sticky top-0 z-[50] transition-colors duration-500">
                    <div className="flex-1 max-w-full px-6">
                         <Header 
                            courseTitle={courseTitle} 
                            handleOpenAnnouncementModal={handleOpenAnnouncementModal} 
                            handleOpenChapterAddModal={handleOpenChapterAddModal} 
                            handleOpenAddTraineeModal={handleOpenAddTraineeModal} 
                            handleOpenTrianeeProgressModal={handleOpenTraineeProgress} 
                        />
                    </div>
                </header>

                {/* Main Content Area - Matches Trainer's p-8 gap-8 */}
                <main className='flex-1 flex overflow-hidden p-8 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
                    
                    {/* LEFT: CONTENT VIEWER (White Glass) */}
                    <div className='flex-1 relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 overflow-y-auto custom-scrollbar shadow-xl shadow-slate-200/40 dark:shadow-none p-8'>
                        {isQuiz && <QuizList quizData={quizData} />}
                        {isVideo && videoData.item_type === "VIDEO" && <MediaPlayer videoURL={videoData.source_url} videoId={videoData.id} videoData={videoData} />}
                        {isVideo && videoData.item_type === "IMAGE" && <ImagePlayer videoData={videoData} />}
                        {isCertificate && <Certificate courseId={id} certificateData={certificateData} />}
                        {isText && <TextPresenter data={textData} />}
                        
                        {isEditChapter && !isLesson && (
                            <DeleteContent 
                                isQuiz={isQuiz} isVideo={isVideo} isCertificate={isCertificate} isText={isText} 
                                videoData={videoData} quizData={quizData} certificateData={certificateData} 
                                textData={textData} onRefresh={handleRefresh}
                            />
                        )}

                        {isLesson && <CourseAddContent onRefresh={handleRefresh} chapterInfo={chapterInfo} courseId={id} />}

                        {/* Empty Selection State */}
                        {!isQuiz && !isVideo && !isCertificate && !isText && !isLesson && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                                <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
                                    <span className="text-5xl opacity-40 grayscale">📖</span>
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Admin Control Center</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: CHAPTER LIST (Darker Glass) */}
                    <aside className='w-96 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col'>
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800/50">
                            <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Course Chapters
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            <CourseChapters 
                                courseId={id} 
                                refresh={refresh} 
                                handleChaptersInfo={handleChaptersInfo} 
                                handleEditChapter={handleEditChapter} 
                            />
                        </div>
                    </aside>
                </main>
            </div>

            {/* MODALS */}
            {isTraineeProgressModal && <TraineeProgressModal onExit={handleExitTraineeProgressModal} courseId={id} />}
            {isAddTraineeModal && <AddTraineeModal onExit={handleExitaddTraineeModal} courseId={id} />}
            {isChapterModal && <AddChapterModal onExit={handleExitChapterModal} courseId={id} />}
            {isAnnounceModalOpen && <AnnouncementModal onExit={handleExitAnnouncementModal} courseId={id} certificate={certificateData} />}
        </div>
    )
}