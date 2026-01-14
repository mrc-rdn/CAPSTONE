import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../api.js";
import CommentList from "./CommentList.jsx";

function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [isCommenting, setCommenting] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [userId, setUserId] = useState();

  const triggerRefresh = () => {
    setRefresh((p) => p + 1);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/trainee/${videoId}/comments`,
          { withCredentials: true }
        );
        setComments(res.data.data);
        setUserId(res.data.userId);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, [refresh, videoId]);

  const addComment = async () => {
    if (!input.trim()) return;

    try {
      await axios.post(
        `${API_URL}/trainee/${videoId}/comments`,
        { content: input },
        { withCredentials: true }
      );
      setInput("");
      setCommenting(false);
      triggerRefresh(); // ✅ refresh after post
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (id) => {
    try {
      await axios.post(
        `${API_URL}/trainee/deletecomment`,
        { commentId: id },
        { withCredentials: true }
      );
      triggerRefresh(); // ✅ refresh after delete
    } catch (error) {
      console.log(error);
    }
  };
console.log(comments)
  return (
  <div className="w-full">

    {/* Comment count */}
    <h3 className="text-xl font-semibold text-gray-900 mb-6">
      {comments.length} Comments
    </h3>

  {/* Add comment */}
<div className="flex gap-4 mb-6">
  <div className="flex-1">
    <input
      value={input}
      onClick={() => setCommenting(true)}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Add a comment..."
      className="
        w-full
        pb-2
        border-b border-gray-300
        text-sm text-gray-900
        placeholder-gray-500
        bg-transparent
        focus:outline-none
        focus:border-[#2D4F2B]
      "
    />

    {isCommenting && (
      <div className="flex justify-end gap-2 mt-3">

        {/* Cancel */}
        <button
          onClick={() => {
            setInput("");
            setCommenting(false);
          }}
          className="
            px-4 h-10
            rounded-lg
            text-sm font-medium
            text-[#2D4F2B]
            border border-[#2D4F2B]
            hover:bg-[#2D4F2B]
            hover:text-white
            transition
          "
        >
          Cancel
        </button>

        {/* Comment */}
        <button
          onClick={addComment}
          disabled={!input.trim()}
          className="
            px-5 h-10
            rounded-xl
            text-sm font-semibold
            bg-[#2D4F2B]
            text-white
            hover:bg-[#2D4F2B]
            focus:outline-none
            focus:ring-2
            focus:ring-[#FFB823]
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
          "
        >
          Comment
        </button>

      </div>
    )}
  </div>
</div>



    {/* Comment list */}
    <ul className="space-y-4">
      {comments.map((comment) => (
        <CommentList
          key={comment.id}
          comment={comment}
          profile={comment.profile_pic}
          color={comment.color}
          shade={comment.shades}
          userId={userId}
          deleteComment={deleteComment}
          onRefresh={triggerRefresh}
        />
      ))}
    </ul>

  </div>
);
}

export default Comments;

