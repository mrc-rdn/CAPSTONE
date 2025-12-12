import React,{useState} from 'react'
import SendIcon from '@mui/icons-material/Send';

export default function ReplyList(props) {
    const [reply, setReply] = useState("")
  return (
    <div>
        <input 
            className="flex-1 px-3 py-2 focus:outline-none focus:outline-none focus:ring-blue-500 border-b-2 m-2"
            type="text" 
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
        >
            <SendIcon />
        </button>
    </div>
  )
}
