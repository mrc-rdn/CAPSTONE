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
    <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center'>
      <div className='w-10/12 h-100 bg-white p-3 rounded lg:w-4/12'>
        <button onClick={()=>{props.onExit()}}><CloseIcon /></button>
        
        <p className='m-3'>Proudly presented to: <span>Person Recipient </span>
         for having satisfactorily completed the training module on <span className=''>{title}</span></p>
        {isUploaded?<p>Successful uploading certificate</p>
        :<div
        className='flex flex-col items-center '>
          <input 
             className='w-10/12 h-10 text-2xl bg-green-500 rounded p-1 m-1'
            type="text"
            placeholder='Certificate Title'
            required
            onChange={(e)=>{setTitle(e.target.value)}}
          />

          <button 
            className="m-3 w-50 h-10 text-2xl text-white bg-green-500 rounded "
            onClick={handleUploadCertificate}
          >
              Upload Certificate
          </button>
        </div>}

      </div> 
    </div>
  )
}
