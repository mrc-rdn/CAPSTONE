import React, {useState} from 'react'
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyList from './ReplyList'

export default function CommentList(props) {

    const isReplyOpen = props.openReply === props.comment.id;
        
  return (
    <li>
        <div className="flex flex-col m-3 border-1 rounded p-3 ">
            <div className="flex flex-row ">
                <PersonIcon fontSize="large" className="border-2 rounded-full "/>
                <h1 className="mt-auto mb-auto ml-3">{props.comment.first_name} {props.comment.surname}</h1>
                
                {props.comment.user_id === props.userId?<button className="ml-auto"
                onClick={()=>props.deleteComment(comment.id)} >
                    <DeleteIcon />
                </button>: null}
            </div>
            
            <p className="ml-12">
                {props.comment.content}
            </p>
            <div>
                {isReplyOpen
                ?<ReplyList handleExitReply={props.handleExitReply} />

                :<button
                onClick={()=>props.handleOpenReply(props.comment.id)}>
                    Reply
                </button>}
            </div>
            
            
        </div>
    </li>
  )
}
