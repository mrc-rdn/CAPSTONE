import React, {useState} from 'react'
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from "../../../../../api";

export default function UploadCertificateModal(props) {
    const [title , setTitle] = useState("")
    const [isUploaded, setIsUpload] = useState(false)
    async function handleUploadCertificate(){
      console.log(props.courseId, props.chapterInfo.chapterId)
      try {
        const res = await axios.post(`${API_URL}/trainer/chapter/addcertificate`, 
          {courseId: props.courseId, chapterId:props.chapterInfo.chapterId, title: title}, 
          {withCredentials:true})
          console.log(res)
          setIsUpload(true)
      } catch (error) {
        console.log(error)
        setIsUpload(false)
      }
    }
  return (
  <div className="w-full h-full bg-black/50 fixed inset-0 flex items-center justify-center z-50">
    <div className="w-[600px] bg-white rounded-2xl shadow-xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Upload Certificate
        </h1>
        <button
          onClick={() => { props.onExit(); }}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Certificate Preview Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="text-gray-700 leading-relaxed">
          Proudly presented to:
          <span className="font-semibold text-gray-900 ml-1">
            Person Recipient
          </span>
          <br />
          for having satisfactorily completed the training module on
          <span className="font-semibold text-green-600 ml-1">
            {title}
          </span>
        </p>
      </div>

      {/* Content */}
      {isUploaded ? (
        <div className="text-center py-8">
          <p className="text-lg font-medium text-green-600">
            ✔ Successful uploading certificate
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">

          {/* Title Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Certificate Title
            </label>
            <input
              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              placeholder="Enter certificate title"
              required
              onChange={(e) => { setTitle(e.target.value); }}
            />
          </div>

          {/* Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleUploadCertificate}
              className="
                w-52 h-11
                rounded-xl
                font-semibold
                bg-[#2D4F2B]
                text-white
                hover:bg-[#708A58]
                focus:outline-none
                focus:ring-2
                focus:ring-[#FFB823]
                transition
              "
            >
              Upload Certificate
            </button>
          </div>

        </div>
      )}

    </div>
  </div>
);
}