// App.jsx
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

import { API_URL } from '../../../../../api';
import CloseIcon from '@mui/icons-material/Close';

export default function TextEditor(props) {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [posts, setPosts] = useState([]);
    const [isPostingSuccess, setIspostingSuccess] = useState(false)
   

    const savePost = async () => {
        if (!title || !content) return alert("Title and content are required");
        try {
            const res = await axios.post(`${API_URL}/admin/posts`,
                { title:title, courseId: props.courseId, chapterId: props.chapterInfo.chapterId, content: content },
                {withCredentials:true});
            setPosts([res.data, ...posts]);
            setTitle('');
            setContent('');
            setIspostingSuccess(true)
        } catch (err) {
            console.error(err);
            setIspostingSuccess(false)
        }
    };


    return (
   
    <div className='w-full h-full absolute bg-white p-3 rounded'>
    <button onClick={()=>{props.onExit();}}><CloseIcon /></button>
        {isPostingSuccess
        ?<p className='m-5'>Successful posting</p>
        :<div className=" w-full h-11/12 flex flex-col p-4 ">
            <h1 className="text-3xl font-bold mb-4">Text Editor</h1>

            <input 
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 mb-2 w-full rounded"
            />
            <div className='h-9/12 '>
                <ReactQuill value={content} onChange={setContent} className=' h-10/12 ' />
            </div>
            

            <button
                onClick={savePost}
                className="bg-blue-500 text-white w-full h-10 rounded hover:bg-blue-600"
            >
                Save Post
            </button>

            
        </div>}
    </div>
    
    );
}

