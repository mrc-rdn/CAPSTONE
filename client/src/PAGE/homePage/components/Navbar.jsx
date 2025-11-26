import React, {useState} from 'react'
import { Link } from "react-router-dom";

export default function Navbar() {
  const [hoverHome, setHoverHome] = useState(false);
  const [hoverFeatures, setHoverFeatures] = useState(false);
  const [hoverFAQs, setHoverFAQs] = useState(false);
  const [hoverAbout, setHoverAbout] = useState(false);

  const hoverStyle={
    width:"90px",
    height:"40px",
    color: "black",
    backgroundColor: "white",
    transition: "ease .5s" 
  }

  return(
    
            <button className="w-25 h-10 text-green-600 bg-transparent rounded-full text-lg font-normal border border-green-600 border-solid mr-10"><Link to="/role">Login</Link></button>
        
          
    
  )
}
