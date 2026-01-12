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
  <div className="mt-3">

    {/* Reply button */}
    <button
      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition"
      onClick={() => setOpenReply(!openReply)}
    >
      <MessageIcon sx={{ fontSize: 16 }} />
      Reply
    </button>

    {/* Reply input */}
    {openReply && (
      <div className="flex items-start gap-2 mt-3">

        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Add a reply..."
          className="
            flex-1 px-3 py-2
            border border-gray-300 rounded-full
            text-sm
            focus:outline-none focus:ring-2 focus:ring-green-600
          "
        />

        <button
          onClick={postReply}
          className="text-green-600 hover:text-green-700 transition"
        >
          <SendIcon sx={{ fontSize: 20 }} />
        </button>
      </div>
    )}

    {/* Toggle replies */}
    {replyData.length > 0 && (
      <button
        className="flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-gray-800 transition"
        onClick={() => setReplyIsOpen(!replyIsOpen)}
      >
        {replyIsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        {replyData.length} {replyData.length > 1 ? "replies" : "reply"}
      </button>
    )}

    {/* Replies list */}
    {replyIsOpen && (
      <div className="mt-4 pl-6 border-l border-gray-200 space-y-3">
        {replyData.map((reply, index) => (
          <Reply
            key={index}
            first_name={reply.first_name}
            surname={reply.surname}
            profile={reply.profile_pic}
            color={reply.color}
            shade={reply.shades}
            content={reply.content}
          />
        ))}
      </div>
    )}

  </div>
);
}