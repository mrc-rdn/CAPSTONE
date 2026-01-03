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
    <div className="flex w-full h-full bg-green-700 items-center text-white ">
        <Link to="/trainee/course">
            <button className="ml-5 text-sm sm:text-lg">
            <ArrowBackIcon />
            </button>

        </Link>

        <h1 className="text-sm sm:text-xl font-medium ml-10">{deslugify(props.courseTitle)}</h1>

       

    </div>
      
  )
}
