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
    <div className="w-full h-18 flex items-center  ">
        <div className="flex justify-start items-center w-1/4 ">
            <img src="./public/images/logo2.gif" alt="" className="h-12 ml-10 mr-5"/>
            <h1 className='text-2xl font-bold text-green-800'>E-Kabuhayan</h1>
        </div>
        <div className="flex w-2/4 justify-center">
            <div className="nav-bar w-130 h-12 bg-green-700 flex justify-around items-center rounded-full text-white ">
                <button
                onMouseOver={() => setHoverHome(true)}
                onMouseOut={() => setHoverHome(false)}
                style={hoverHome ? hoverStyle : null}
                className='rounded-full'
                >
                Home
                </button>

                <button
                    onMouseOver={() => setHoverFeatures(true)}
                    onMouseOut={() => setHoverFeatures(false)}
                    style={hoverFeatures ? hoverStyle : null}
                    className='rounded-full'
                >
                    Features
                </button>

                <button
                    onMouseOver={() => setHoverFAQs(true)}
                    onMouseOut={() => setHoverFAQs(false)}
                    style={hoverFAQs ? hoverStyle : null}
                    className='rounded-full'
                >
                    FAQs
                </button>

                <button
                    onMouseOver={() => setHoverAbout(true)}
                    onMouseOut={() => setHoverAbout(false)}
                    style={hoverAbout ? hoverStyle : null}
                    className='rounded-full'
                >
                    About Us
                </button>
            </div>
            
        </div>
        <div className="flex w-1/4 justify-end">
            <button className="w-25 h-10 text-green-600 bg-transparent rounded-full text-lg font-normal border border-green-600 border-solid mr-10"><Link to="/role">Login</Link></button>
        </div>
          
    </div>
  )
}
