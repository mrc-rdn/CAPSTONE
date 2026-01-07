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
          `${API_URL}/admin/${videoId}/comments`,
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
        `${API_URL}/admin/${videoId}/comments`,
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
      <h3 className="text-sm font-bold mb-3">
        {} Comments
      </h3>

      <input
        value={input}
        onClick={() => setCommenting(true)}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write a comment..."
        className="w-full px-3 py-2 border-b-2"
      />

      {isCommenting && (
        <div>
          <button className="w-20  px-4 py-2 border rounded-lg"
            onClick={() => { setInput(""); setCommenting(false); }}>
            Cancel
          </button>
          <button className="w-20 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg m-3"
           onClick={addComment}
           >
            Post
          </button>
        </div>
      )}

      <ul>
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

