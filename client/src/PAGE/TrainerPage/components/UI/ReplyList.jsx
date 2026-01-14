import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { API_URL } from "../../../../api.js";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MessageIcon from '@mui/icons-material/Message';
import Reply from "./Reply.jsx";

export default function ReplyList({ commentId, onRefresh }) {
  const [reply, setReply] = useState("");
  const [replyData, setReplyData] = useState([]);
  const [openReply, setOpenReply] = useState(false);
  const [replyIsOpen, setReplyIsOpen] = useState(false)

  useEffect(() => {
    const fetchReply = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/admin/${commentId}/reply`,
          { withCredentials: true }
        );
        setReplyData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReply();
  }, [commentId, onRefresh]);

  const postReply = async () => {
    if (!reply.trim()) return;

    try {
      await axios.post(
        `${API_URL}/admin/${commentId}/reply`,
        { content: reply },
        { withCredentials: true }
      );
      setReply("");
      onRefresh(); // ✅ refresh comments + replies
    } catch (error) {
      console.log(error);
    }
  };
  console.log(replyData)
  return (
    <div className="ml-10">
      <button className="text-gray-500 ml-10" 
      onClick={() => setOpenReply(!openReply)}>
       <MessageIcon sx={{fontSize:20}} /> Reply 
      </button>

      {openReply && (
        <div className="flex">
          <input
            className="
                w-11/12
                pb-2
                border-b border-gray-300
                text-sm text-gray-900
                placeholder-gray-500
                bg-transparent
                focus:outline-none
                focus:border-[#2D4F2B]
            "
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Reply..."
          />
          <button className="
            px-4 h-10
            rounded-lg
            text-sm font-medium
            ml-3
            text-white
            border 
            bg-[#2D4F2B]
            hover:border-[#2D4F2B]
            hover:bg-white
            hover:text-[#2D4F2B]
            transition"
            onClick={postReply}>
            <SendIcon />
          </button>
        </div>

      )}
      
        
        <div className='flex items-center' onClick={()=>{setReplyIsOpen(!replyIsOpen)}}>
        { replyIsOpen?   (<div className="flex"><KeyboardArrowDownIcon /><p> {replyData.length} Reply</p></div>):(<div className="flex"><KeyboardArrowUpIcon /><p> {replyData.length} Reply</p></div>) }
        </div> 
        {replyIsOpen
            ?<div className='ml-10'>
              {replyData.map((reply, index)=>{
                return <Reply key={index} first_name={reply.first_name} surname={reply.surname} profile={reply.profile_pic} color={reply.color} shade={reply.shades} content={reply.content} />
                
                
              })}
            </div>
            :null}
    </div>
  );
}
