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
        const res = await axios.post(`${API_URL}/admin/chapter/addcertificate`, 
          {courseId: props.courseId, chapterId:props.chapterInfo.chapterId, title: title}, 
          {withCredentials:true})
          console.log(res)
          setIsUpload(true)
          props.onExit()
      } catch (error) {
        console.log(error)
        setIsUpload(false)
      }
    }
  return (
    <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center'>
      <div className='w-130 h-90 bg-white p-3 rounded'>
        <button onClick={()=>{props.onExit()}}><CloseIcon /></button>
        
        <p>Proudly presented to: <span>Person Recipient </span>
         for having satisfactorily completed the training module on <span className=''>{title}</span></p>
        {isUploaded?<p>Successful uploading certificate</p>
        :<div>
          <input 
            className='border-1'
            type="text"
            placeholder='Title'
            required
            onChange={(e)=>{setTitle(e.target.value)}}
          />

          <button 
            className=''
            onClick={handleUploadCertificate}
          >
              Upload Certificate
          </button>
        </div>}

      </div> 
    </div>
  )
}
