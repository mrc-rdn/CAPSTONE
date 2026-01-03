import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


export default function Header(props) {
  const [isOpenMenu, setIsOpenMenu] = useState(false)
    
     function deslugify(slug) {
        // 1. Replace hyphens with spaces
        // 2. Capitalize first letter of each word (optional)
        return slug
            .replace(/-/g, ' ')               // replace - with space
            .replace(/\b\w/g, char => char.toUpperCase()); // capitalize each word
    }
     const handleOpenMenu = ()=>{
      setIsOpenMenu(true)
    }
    const handleExitMenu = ()=>{
      console.log('hello')
      setIsOpenMenu(false)
    }
  return (
    <div className="flex w-full h-full bg-green-700 items-center text-white">
        <Link to="/trainer/course">
            <button className="ml-5 text-sm sm:text-lg">
            <ArrowBackIcon />
            </button>

        </Link>

        <h1 className="text-sm sm:text-xl font-medium ml-10">{deslugify(props.courseTitle)}</h1>
      {isOpenMenu?null:<button className="ml-auto mr-3 p-1 bg-green-700 lg:hidden "
        onClick={handleOpenMenu}>
          <MenuIcon sx={{fontSize: 30}} />
      </button>}

      <div className={isOpenMenu?'absolute z-100 top-0 right-0  h-full bg-white shadow-lg':'ml-auto hidden lg:block '}>
      <div className={isOpenMenu?'flex flex-col h-full text-black  ':'ml-auto hidden lg:block'}>
        <button className='mr-auto p-3 lg:hidden'
          onClick={handleExitMenu}
        >
          <CloseIcon  />
        </button>

        <button
        onClick={() => {props.handleOpenTrianeeProgressModal()}}
        className="p-3  mx-3  hover:border-b-3  p-3 transition-all duration-80 ease-in-out text-sm"
        >
        Trainee Progress
        </button>

        <button       
            onClick={() =>{props.handleOpenChapterAddModal()}} 
            className=" m-3 hover:border-b-3  p-3 transition-all duration-100 ease-in-out text-sm"
            >
       + Chapter
        </button>

        <button
            onClick={()=>{props.handleOpenAddTraineeModal()}}
            className=" m-3 hover:border-b-3  hover:border-b-3 lg:p-3 transition-all duration-80 ease-in-out p-3 text-sm"
        >
        + Trainee
        </button>
      </div>
      </div>

    </div>
      
  )
}
