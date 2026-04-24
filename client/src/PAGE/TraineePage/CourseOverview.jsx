import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Header from "./components/course/Header.jsx"
import CourseChapters from './components/course/CourseChapters.jsx'
import { API_URL } from '../../api.js'
import QuizList from './components/Ui/QuizList.jsx'
import MediaPlayer from './components/Ui/MediaPlayer.jsx'
import ImagePlayer from './components/Ui/ImagePlayer.jsx'
import Certificate from './components/Ui/Certificate.jsx'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AnnouncementModal from './components/Ui/AnnouncementModal.jsx'
import TextPresenter from './components/Ui/TextPresenter.jsx'
import LockIcon from '@mui/icons-material/Lock';

export default function CourseOverview() {
    const { id, courseTitle } = useParams();
    const [refresh, setRefresh] = useState(0)
    const [chapterInfo, setChapterInfo] = useState({ chapterId: "", chapterIndex: "" })
    const [chapterId, setChapterId] = useState("")

    const [isLesson, setIsLessonUploaded] = useState(false)
    const [isVideo, setIsVideo] = useState(false);
    const [isAnnouncementModal, setIsAnnouncementModal] = useState(false);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isCertificate, setIsCertificate] = useState(false)
    const [isText, setIstext] = useState(false)
    const [quizData, setQuizData] = useState([])
    const [videoData, setVideoData] = useState([])
    const [certificateData, setCertificateData] = useState([])
    const [textData, setTextData] = useState([])

    const [notif, setNotif] = useState(0)
    const [isOpenChapters, setIsOpenChapters] = useState(false)
    const [isAnswerReady, setIsAnswerReady] = useState(false);
    const [progresstrack, setProgressTrack] = useState({})
    const [chapterIndex, setChapterIndex] = useState(0)

    function handleRefresh() {
        setRefresh(prev => prev + 1)
    }

    useEffect(() => {
        const handleprogressloader = async () => {
            try {
                await axios.get(`${API_URL}/trainee/chapterprogress/${id}/loader`, { withCredentials: true })
            } catch (err) { console.error(err) }
        }
        handleprogressloader()
    }, [id])

    const handleChaptersInfo = async (chaptersId, chapterIndex) => {
        setChapterId(chaptersId)
        setChapterIndex(chapterIndex)
        try {
            const [video, quiz, certificate, text, progress] = await Promise.all([
                axios.post(`${API_URL}/trainee/course/chapter/mediaitems`, { courseId: id, chapterId: chaptersId }, { withCredentials: true }),
                axios.post(`${API_URL}/trainee/course/chapter/quiz`, { chapterId: chaptersId }, { withCredentials: true }),
                axios.get(`${API_URL}/trainee/course/${id}/${chaptersId}/getcertificate`, { withCredentials: true }),
                axios.get(`${API_URL}/trainee/texteditor/${id}/${chaptersId}`, { withCredentials: true }),
                axios.get(`${API_URL}/trainee/chapterprogress/${id}/unlocktracker`, { withCredentials: true }),
            ])

            let progresslock = progress.data.data.find(item => item.chapter_id === chaptersId)
            setProgressTrack(progresslock || { is_unlocked: false })

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
        } catch (error) { console.log(error) }
        setChapterInfo({ chapterId: chaptersId, chapterIndex: chapterIndex })
    }

    const handleOpenChapters = () => setIsOpenChapters(true);
    const handleExitChapters = () => setIsOpenChapters(false);
    const handleOpenAnnouncementModal = (notif) => { setIsAnnouncementModal(true); setNotif(notif); }
    const handleExitAnnouncementModal = () => { setRefresh(prev => prev + 1); setIsAnnouncementModal(false); }
    const chapteroff = (answerReady) => setIsAnswerReady(answerReady);

    return (
        <div className='flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500'>
            
            <div className='flex-1 flex flex-col relative overflow-hidden'>
                
                {/* 1. MODERN GLASS HEADER (Mirrored from Trainer) */}
                <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/50 sticky top-0 z-[50]">
                    <div className="flex-1 max-w-full px-6 ">
                        <Header 
                            courseTitle={courseTitle} 
                            handleOpenAnnouncementModal={handleOpenAnnouncementModal} 
                            courseId={id} 
                            refresh={refresh} 
                        />
                    </div>
                </header>

                {/* 2. SCROLLABLE CONTENT VIEWPORT */}
                <main className='flex-1 flex overflow-hidden p-8 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
                    
                    {/* LEFT: CONTENT VIEWER (White Glass) */}
                    <div className='flex-1 relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 overflow-y-auto custom-scrollbar shadow-xl shadow-slate-200/40 dark:shadow-none p-8'>
                        
                        {/* Content Logic */}
                        {isQuiz && <QuizList quizData={quizData} courseId={id} chapteroff={chapteroff} />}
                        {isVideo && videoData.item_type === "VIDEO" && <MediaPlayer videoURL={videoData.source_url} videoId={videoData.id} videoData={videoData} />}
                        {isVideo && videoData.item_type === "IMAGE" && <ImagePlayer videoData={videoData} courseId={id} chapterId={chapterId} />}
                        {isCertificate && <Certificate courseId={id} certificateData={certificateData} isDone={progresstrack?.is_unlocked} />}
                        {isText && <TextPresenter data={textData} />}
                        
                        {isLesson && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                <p className="text-xs font-black uppercase tracking-widest">No Content Uploaded</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isQuiz && !isVideo && !isCertificate && !isText && !isLesson && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                                <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
                                    <span className="text-5xl opacity-40 grayscale">📖</span>
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Select a chapter to start learning</p>
                            </div>
                        )}

                        {/* LOCK OVERLAY */}
                        {progresstrack?.is_unlocked === false && (
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-[20] flex flex-col items-center justify-center rounded-[3rem]">
                                <div className='bg-white dark:bg-slate-800 p-8 rounded-full shadow-2xl'>
                                    <LockIcon sx={{ fontSize: 60, color: '#64748b' }} />
                                </div>
                                <p className='text-2xl font-black mt-6 text-white uppercase tracking-tighter'>Content Locked</p>
                                <p className='text-slate-200 text-sm'>Complete previous chapters to unlock</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: CHAPTER LIST (Mirrored from Trainer) */}
                    <aside className={`
                        ${isOpenChapters ? 'fixed inset-y-0 right-0 w-80 z-[100]' : 'hidden lg:flex'} 
                        w-96 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col
                    `}>
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
                            <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Course Chapters
                            </h2>
                            {isOpenChapters && (
                                <button onClick={handleExitChapters} className="lg:hidden text-slate-500">✕</button>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
                            {isAnswerReady && <div className='bg-slate-900/10 backdrop-blur-[2px] absolute inset-0 z-10 rounded-[2rem]' />}
                            <CourseChapters 
                                courseId={id} 
                                refresh={refresh} 
                                handleChaptersInfo={handleChaptersInfo} 
                                handleExitChapters={handleExitChapters} 
                            />
                        </div>
                    </aside>

                    {/* Mobile Toggle Button */}
                    {!isOpenChapters && (
                        <button 
                            className="fixed right-0 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-l-xl shadow-lg lg:hidden z-40"
                            onClick={handleOpenChapters}
                        >
                            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                        </button>
                    )}
                </main>
            </div>

            {/* Modals */}
            {isAnnouncementModal && (
                <AnnouncementModal 
                    courseId={id} 
                    onExit={handleExitAnnouncementModal} 
                    notif={notif} 
                />
            )}
        </div>
    )
}