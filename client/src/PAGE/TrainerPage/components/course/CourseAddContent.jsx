import React,{useState} from 'react'
import CreateQuizModal from '../UI/modal/CreateQuizModal.jsx';
import UploadImagesModal from '../UI/modal/UploadImagesModal.jsx';
import VideoUploadModal from '../UI/modal/VideoUploadModal.jsx'
import UploadCertificateModal from '../UI/modal/UploadCertificateModal.jsx';
import TextEditor from '../UI/modal/TextEditor.jsx';

export default function CourseAddContent(props) {
    const [isLessonUploaded, setIsLessonUploaded] = useState(false);
    const [isQuizUpload, setQuizUpload] = useState(false);
    const [isUploadVideo, setUploadvideo] = useState(false);
    const [isUploadImage, setUploadImage] = useState(false);
    const [isUplaodCertificate, setUplaodCertificate] = useState(false);
    const [isTextEditor, setIsTextEditor] = useState(false);

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
    function handleExitCertificateUploadModal (){
      setUplaodCertificate(false)
      props.onRefresh()
    }
    const handleExitTextEditorModal = ()=>{
      setIsTextEditor(false)
      console.log('hello')
      props.onRefresh()
    }
    
    
  return (
  <div className="w-full h-full relative">

    {isQuizUpload && (
      <CreateQuizModal
        onExit={handleExitQuizModal}
        chapterInfo={props.chapterInfo}
      />
    )}

    {isUploadVideo && (
      <VideoUploadModal
        onExit={handleExitVideoUploadModal}
        chapterInfo={props.chapterInfo}
        courseId={props.courseId}
      />
    )}

    {isUploadImage && (
      <UploadImagesModal
        onExit={handleExitImageUploadModal}
        chapterInfo={props.chapterInfo}
        courseId={props.courseId}
      />
    )}

    {isUplaodCertificate && (
      <UploadCertificateModal
        onExit={handleExitCertificateUploadModal}
        chapterInfo={props.chapterInfo}
        courseId={props.courseId}
      />
    )}

    {isTextEditor && (
      <TextEditor
        onExit={handleExitTextEditorModal}
        chapterInfo={props.chapterInfo}
        courseId={props.courseId}
      />
    )}

    {isLessonUploaded ? null : (
      <div className="h-full w-full flex items-center justify-center">

        {/* Container */}
        <div className="bg-[#F1F3E0] rounded-xl shadow-xl p-8 w-full max-w-lg">

          <h2 className="text-xl font-semibold text-[#2D4F2B] mb-6 text-center">
            Add Lesson Content
          </h2>

          <div className="grid grid-cols-1 gap-4">

            {/* Create Quiz */}
            <button
              className={`
                h-11 rounded-xl font-semibold transition
                ${
                  isQuizUpload
                    ? "bg-[#2D4F2B] text-white"
                    : "bg-white border border-[#2D4F2B] text-[#2D4F2B] hover:bg-[#2D4F2B] hover:text-white"
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                setQuizUpload(true);
                setUploadvideo(false);
                setUploadImage(false);
                setUplaodCertificate(false);
                setIsTextEditor(false);
              }}
            >
              Create Quiz
            </button>

            {/* Upload Video */}
            <button
              className={`
                h-11 rounded-xl font-semibold transition
                ${
                  isUploadVideo
                    ? "bg-[#2D4F2B] text-white"
                    : "bg-white border border-[#2D4F2B] text-[#2D4F2B] hover:bg-[#2D4F2B] hover:text-white"
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                setQuizUpload(false);
                setUploadvideo(true);
                setUploadImage(false);
                setUplaodCertificate(false);
                setIsTextEditor(false);
              }}
            >
              Upload Video
            </button>

            {/* Upload Image */}
            <button
              className={`
                h-11 rounded-xl font-semibold transition
                ${
                  isUploadImage
                    ? "bg-[#2D4F2B] text-white"
                    : "bg-white border border-[#2D4F2B] text-[#2D4F2B] hover:bg-[#2D4F2B] hover:text-white"
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                setQuizUpload(false);
                setUploadvideo(false);
                setUploadImage(true);
                setUplaodCertificate(false);
                setIsTextEditor(false);
              }}
            >
              Upload Image
            </button>

            {/* Add Certificate */}
            <button
              className={`
                h-11 rounded-xl font-semibold transition
                ${
                  isUplaodCertificate
                    ? "bg-[#2D4F2B] text-white"
                    : "bg-white border border-[#2D4F2B] text-[#2D4F2B] hover:bg-[#2D4F2B] hover:text-white"
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                setQuizUpload(false);
                setUploadvideo(false);
                setUploadImage(false);
                setUplaodCertificate(true);
                setIsTextEditor(false);
              }}
            >
              Add Certificate
            </button>

            {/* Text Editor */}
            <button
              className={`
                h-11 rounded-xl font-semibold transition
                ${
                  isTextEditor
                    ? "bg-[#2D4F2B] text-white"
                    : "bg-white border border-[#2D4F2B] text-[#2D4F2B] hover:bg-[#2D4F2B] hover:text-white"
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                setQuizUpload(false);
                setUploadvideo(false);
                setUploadImage(false);
                setUplaodCertificate(false);
                setIsTextEditor(true);
              }}
            >
              Text Editor
            </button>

          </div>
        </div>

      </div>
    )}
  </div>
);
}

