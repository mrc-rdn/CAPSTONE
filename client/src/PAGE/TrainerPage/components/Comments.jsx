import { useEffect, useState } from "react";
import axios from "axios";
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from "../../../api";

function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [isCommeting, setCommenting] = useState(false)
  const [isComments, setIsComments] = useState(false)

    useEffect(() => {
        const fetchComments = async () => {
            
        try {
            const res = await axios.get(`${API_URL}/trainer/${videoId}/comments`, {withCredentials:true});
            setComments(res.data.data);
            setIsComments(res.data.success)
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
        };

        fetchComments();
    }, [videoId]);
    
  // Add new comment
    const addComment = async () => {
        if (!input.trim()) return;
        try {
        const res = await axios.post(`${API_URL}/trainer/${videoId}/comments`, {
            content: input,
        },{withCredentials: true});

        setComments([res.data, ...comments]);
        setInput("");
        } catch (error) {
        console.error("Error posting comment:", error);
        }
    };
    const deleteComment = async (id) => {
        try {
            const res = await axios.post(`${API_URL}/trainer/video/deletecomment`, {
            commentId: id
            }, { withCredentials: true });

            if (res.data.success) {
            setComments(comments.filter((c) => c.id !== id));
            }

        } catch (error) {
            console.log("Error deleting comment:", error);
        }
    };
  return (
    <div className=" w-full h-full relative">
      <h3 className="text-lg font-bold mb-3">
       {comments.length} Comments
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
                <li key={index}>
                    <div className="flex flex-col m-3 border-1 rounded p-3 ">
                        <div className="flex flex-row ">
                            <PersonIcon fontSize="large" className="border-2 rounded-full "/>
                            <h1 className="mt-auto mb-auto ml-3">{comment.first_name} {comment.surname}</h1>
                            
                            <button className="ml-auto"
                            onClick={()=>deleteComment(comment.id)} >
                                <DeleteIcon />
                            </button>
                        </div>
                        
                        <p className="ml-12">
                            {comment.content}
                        </p>
                        
                    </div>
                </li>)
            })}
            </ul>
        </div>
    </div>
  );
}

export default Comments;
