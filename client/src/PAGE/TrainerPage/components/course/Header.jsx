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
  <div className="flex w-full h-full bg-[#2D4F2B] items-center text-white">

    {/* Back button */}
    <Link to="/trainer/course">
      <button className="ml-5 text-large hover:text-[#FFB823] transition">
        <ArrowBackIcon />
      </button>
    </Link>

    {/* Title */}
    <h1 className="text-xl font-medium ml-20 truncate">
      {deslugify(props.courseTitle)}
    </h1>

    {/* Actions */}
    <button
      onClick={props.handleOpenAnnouncementModal}
      className="
        ml-auto m-3 p-3
        text-sm font-medium
        hover:text-[#FFB823]
        transition
      "
    >
      Announcement
    </button>

    <button
      onClick={props.handleOpenTrianeeProgressModal}
      className="
        m-3 p-3
        text-sm font-medium
        hover:text-[#FFB823]
        transition
      "
    >
      Trainee Progress
    </button>

    <button
      onClick={props.handleOpenChapterAddModal}
      className="
        m-3 p-3
        text-sm font-semibold
        hover:text-[#FFB823]
        transition
      "
    >
      + Add Chapter
    </button>

    <button
      onClick={props.handleOpenAddTraineeModal}
      className="
        m-3 p-3
        text-sm font-semibold
        hover:text-[#FFB823]
        transition
      "
    >
      + Add Trainee
    </button>

  </div>
);
}

