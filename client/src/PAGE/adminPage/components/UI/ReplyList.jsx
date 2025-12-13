import React,{useState, useEffect} from 'react'
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios'
import {API_URL} from '../../../../api.js'

export default function ReplyList(props) {
    const [reply, setReply] = useState("")


    const postReply = async()=>{
        
        try {
            const res = await axios.post(`${API_URL}/admin/${props.commentId}/reply`, 
                {content: reply},
                {withCredentials: true})
            setReply("")
            props.handleExitReply()
            props.handleRefresh()
        } catch (error) {
            console.log(error)
        }
    }

    
  return (
    <div className='w-full'>
        <input 
            className="w-full flex-1 px-3 py-2 focus:outline-none focus:outline-none focus:ring-blue-500 border-b-2"
            type="text" 
            placeholder='Reply'
            required
            onChange={(e)=>setReply(e.target.value)}
            value={reply}/>
        <button
            className="w-20  px-4 py-2 border rounded-lg"
            onClick={()=>props.handleExitReply()}
        >
            Cancel
        </button>
        <button
            className="w-20 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg m-3 " 
            onClick={postReply}
            
        >
            <SendIcon />
        </button>

        <div>

        </div>
    </div>
  )
}
