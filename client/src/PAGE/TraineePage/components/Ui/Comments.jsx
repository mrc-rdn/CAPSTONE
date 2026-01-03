import { useEffect, useState } from "react";
import axios from "axios";

import { API_URL } from "../../../../api.js";
import CommentList from "./CommentList.jsx";

function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [isCommeting, setCommenting] = useState(false)
  const [isComments, setIsComments] = useState(false)
  const [refresh , setRefresh] = useState(0)
  const [userId, setUserId] = useState()
  const [openReply, setOpenReply] = useState(0)

    useEffect(() => {
      const fetchComments = async () => {
            
        try {
            const res = await axios.get(`${API_URL}/trainee/${videoId}/comments`, {withCredentials:true});
            setComments(res.data.data);
            
            setUserId(res.data.userId)
            setIsComments(res.data.success)
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
      };

        fetchComments();
    }, [refresh]);
    
  // Add new comment
    const addComment = async () => {
        if (!input.trim()) return;
        try {
        const res = await axios.post(`${API_URL}/trainee/${videoId}/comments`, {
            content: input,
        },{withCredentials: true});
        setRefresh(prev => prev + 1)
        setInput("");
        } catch (error) {
        console.error("Error posting comment:", error);
        }
    };
    const deleteComment = async (id) => {
        try {
            const res = await axios.post(`${API_URL}/trainee/deletecomment`, {
            commentId: id
            }, { withCredentials: true });
            setRefresh(prev => prev + 1)

            if (res.data.success) {
            setComments(comments.filter((c) => c.id !== id));
            }

        } catch (error) {
            console.log("Error deleting comment:", error);
        }
    };
    const handleOpenReply = (id)=>{
      console.log(id)
      setOpenReply(id)
    }
    const handleExitReply = () =>{
      setOpenReply(0)
    }

    
  return (
    <div className=" w-full h-full relative">
      <h3 className="text-sm font-bold mb-3">
       {comments.length} Comment
      </h3>

      {/* Input Section */}
      <div className="flex flex-col gap-3 w-full ">
        <input
          value={input}
          onClick={()=>{setCommenting(true)}}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 focus:outline-none focus:outline-none focus:ring-blue-500 border-b-2 m-2"
        />
        {isCommeting
        ?<div className="w-full ">
            
            <button 
            className="w-20  px-4 py-2 border rounded-lg"
            onClick={()=>{setInput(""), setCommenting(false);}}>
                Cancel
            </button>

            <button
            onClick={addComment}
            className="w-20 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg m-3 " 
            >
              Post
            </button>
        </div>
        :null }   
        
      </div>

      {/* Comment List */}
        <div className="">
            <ul>
            {comments.map((comment, index) => {
                return (
                    <CommentList 
                        key={index} 
                        comment={comment} 
                        userId={userId} 
                        deleteComment={deleteComment} 
                        handleOpenReply={handleOpenReply} 
                        handleExitReply={handleExitReply}
                        openReply={openReply}
                    />
                )
            })}
            </ul>
        </div>
    </div>
  );
}

export default Comments;
