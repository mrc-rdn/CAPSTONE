import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function Header(props) {
    
     function deslugify(slug) {
        // 1. Replace hyphens with spaces
        // 2. Capitalize first letter of each word (optional)
        return slug
            .replace(/-/g, ' ')               // replace - with space
            .replace(/\b\w/g, char => char.toUpperCase()); // capitalize each word
    }
  return (
    <div className="flex w-full h-full bg-green-700 items-center text-white">
        <Link to="/admin/course">
            <button 
                className="ml-5 text-large"
            >
                <ArrowBackIcon /> Back to Course
            </button>
        </Link>

        <h1 className="text-xl font-medium ml-20">{deslugify(props.courseTitle)}</h1>

        <button
        onClick={() => {props.handleOpenTraineeProgressmodal()}}
        className="ml-auto m-3 p-3  m-3 hover:border-b-3 p-3 transition-all duration-80 ease-in-out"
        >
        Trainee Progress
        </button>

        <button       
            onClick={() =>{props.handleOpenChapterAddModal()}} 
            className=" m-3 hover:border-b-3 p-3 transition-all duration-100 ease-in-out"
            >
       + Add Chapter
        </button>

        <button
            onClick={()=>{props.handleOpenAddTraineeModal()}}
            className=" m-3 hover:border-b-3 hover:border-b-3 p-3 transition-all duration-80 ease-in-out p-3"
        >
        + Add Trainee
        </button>
        

    </div>
      
  )
}
