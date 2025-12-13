import React, {useState, useEffect} from 'react'
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyList from './ReplyList'
import axios from 'axios'
import {API_URL} from '../../../../api.js'

export default function CommentList(props) {

    const isReplyOpen = props.openReply === props.comment.id;
    const [replies, setReply] = useState([])
    const [isReply, setIsReply]= useState(false)
    const [refresh, setRefresh] = useState(0)

    const handleRefresh = ()=>{
        setRefresh(prev => prev + 1)
    }
    useEffect(()=>{
      const fetchReply = async() =>{
        try {
          const res = await axios.get(`${API_URL}/admin/${props.comment.id}/reply`,
            {withCredentials: true}
          )
          
          setReply(res.data.data)
        } catch (error) {
          console.log(error)
        }
      }
      fetchReply()
    },[refresh])
    
  return (
    <li>
        <div className="flex flex-col m-3 border-1 rounded p-3 ">
            <div className="flex flex-row ">
                <PersonIcon fontSize="large" className="border-2 rounded-full "/>
                <h1 className="mt-auto mb-auto ml-3">{props.comment.first_name} {props.comment.surname}</h1>
                
                {props.comment.user_id === props.userId?<button className="ml-auto"
                onClick={()=>props.deleteComment(props.comment.id)} >
                    <DeleteIcon />
                </button>: null}
            </div>
            
            <p className="ml-12">
                {props.comment.content}
            </p>
            <div>
                {isReplyOpen
                ?<ReplyList handleExitReply={props.handleExitReply} commentId={props.comment.id} handleRefresh={handleRefresh} />

                :<button
                onClick={()=>props.handleOpenReply(props.comment.id)}>
                    Reply
                </button>}
            </div>
            <button 
                className='font-bold text-2xl w-10 bg-green-200'
                onClick={()=>{setIsReply(!isReply)}}
            >
            {isReply? "-": "+"}
            </button>

            {isReply?<div className='ml-10'>
                {replies.map((reply, index)=>{
                    return <p>{reply.content}</p>
                })}
            </div>:null}
            
            
        </div>
    </li>
  )
}
