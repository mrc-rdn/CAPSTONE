import React, {useEffect, useState} from 'react'
import { API_URL } from '../../../../api.js'
import axios from 'axios'

export default function Certificate(props) {
    const {title} =  props.certificateData[0]
    const [data, setdata] = useState([]);
    useEffect(()=>{
        async function fetchdata (){
            try {
                const result = await axios.get(`${API_URL}/admin/dashboard`, {withCredentials:true})
                setdata(result.data.usersInfo[0])
                console.log(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchdata()
    },[])
    const [completionDate, setCompletionDate] = useState({
    fullDate: "",
    day: "",
    month: "",
    year: "",
    time: "",
  });

  useEffect(() => {
    const now = new Date();

    const options = { month: "long" }; // "November"
    const month = new Intl.DateTimeFormat("en-US", options).format(now);

    const day = now.getDate(); // 27
    const year = now.getFullYear(); // 2025
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    setCompletionDate({
      fullDate: now.toLocaleDateString(), // e.g., 11/27/2025
      day: day,
      month: month,
      year: year,
      time: `${hours}:${minutes}`, // 24-hour format
    });
  }, []);
  return (
    <div className='w-full h-full overflow-y-scroll '>
      <div className='w-full min-h-screen  flex justify-center p-2 sm:p-4 lg:p-8'>
        <div className="w-full max-w-[1200px]">
          <div className="bg-white shadow-2xl relative border-[8px] sm:border-[12px] lg:border-[15px] border-green-700 print:shadow-none" id="certificate">
            <div className="p-6 sm:p-10 md:p-12 lg:p-16 xl:px-20 relative bg-white border-2 lg:border-[3px] border-yellow-600 min-h-[600px] sm:min-h-[700px] lg:min-h-[750px]">

              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] opacity-20 z-0">
                <img
                  src="images/paranaque.png"
                  alt="Paranaque City Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>

              {/* Corners - Responsive sizing */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-5 lg:left-5 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-2 lg:border-[3px] border-green-600 border-r-0 border-b-0 z-[1]"></div>
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-5 lg:right-5 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-2 lg:border-[3px] border-green-600 border-l-0 border-b-0 z-[1]"></div>
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-5 lg:left-5 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-2 lg:border-[3px] border-green-600 border-r-0 border-t-0 z-[1]"></div>
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 lg:bottom-5 lg:right-5 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-2 lg:border-[3px] border-green-600 border-l-0 border-t-0 z-[1]"></div>

              {/* Main Content */}
              <div className="relative z-[3] text-center">

                {/* Header */}
                <div className="mb-6 sm:mb-8 lg:mb-9">
                  <img
                    src="images/logo.gif"
                    alt="PLRMO Logo"
                    className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 object-contain"
                    onError={(e) => (e.target.style.display = "none")}
                  />

                  <div className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-gray-800 tracking-wide leading-[1.6] sm:leading-[1.8] mb-2 px-2">
                    PARAÑAQUE LIVELIHOOD RESOURCE MANAGEMENT OFFICE
                    <br />
                    PARAÑAQUE SKILLS TRAINING CENTER
                    <br />
                    <span className="hidden sm:inline">PLRMO Bldg. Simplicio Cruz Cmpd., Brgy. San Isidro, Parañaque City</span>
                    <span className="sm:hidden">PLRMO Bldg., Brgy. San Isidro, Parañaque City</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-[4px] sm:tracking-[8px] lg:tracking-[12px] my-3 sm:my-4 lg:my-5 uppercase" 
                    style={{ textShadow: "2px 2px 4px rgba(13, 92, 58, 0.1)" }}>
                  CERTIFICATE
                </h1>
                <h2 className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-gray-800 tracking-[3px] sm:tracking-[6px] lg:tracking-[8px] mb-5 sm:mb-7 lg:mb-8 uppercase">
                  OF COMPLETION
                </h2>

                <p className="text-sm sm:text-base text-gray-800 mb-4 sm:mb-5 lg:mb-6 italic">Proudly presented to:</p>

                {/* Student Name */}
                <div
                  className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black border-b-2 lg:border-b-[3px] border-black pb-2 lg:pb-2.5 mx-auto mb-5 sm:mb-7 lg:mb-8 capitalize max-w-[90%] sm:max-w-[85%] lg:max-w-[80%] inline-block break-words"
                  id="recipientName"
                >
                  {data.first_name} {data.surname}
                </div>

                <p className="text-xs sm:text-sm lg:text-[15px] text-gray-800 leading-[1.6] sm:leading-[1.8] mb-2 lg:mb-2.5 px-4">
                  for having satisfactorily completed the training module on
                </p>

                {/* Module Name */}
                <span className="font-bold text-black text-base sm:text-lg md:text-xl lg:text-[22px] block my-3 sm:my-4 capitalize px-4" id="moduleName">
                  {title}
                </span>

                {/* Dates */}
                <div className="my-5 sm:my-7 lg:my-8 text-xs sm:text-sm text-gray-800 italic px-4">
                  <span>
                    Completed on: <strong id="completionFullDate">{completionDate.fullDate}</strong>
                  </span>
                  <span className="block mt-1 sm:mt-2 text-gray-800">
                    at <strong id="completionTime">{completionDate.time}</strong>
                  </span>
                </div>

                <div className="my-6 sm:my-8 lg:my-9 text-[11px] sm:text-xs lg:text-[13px] text-gray-800 px-4">
                  Issued at Parañaque City, Philippines this{" "}
                  <strong><span id="completionDay">{completionDate.day}</span></strong> day of{" "}
                  <strong><span id="completionMonth">{completionDate.month}</span></strong>,{" "}
                  <strong><span id="completionYear">{completionDate.year}</span></strong>
                </div>

                {/* Signatures */}
                <div className="flex flex-col sm:flex-row justify-around mt-10 sm:mt-12 lg:mt-[70px] gap-8 sm:gap-12 lg:gap-16 max-w-[800px] mx-auto px-4">
                  <div className="text-center flex-1">
                    <div className="border-t-2 border-black mb-1 pt-4 sm:pt-5 min-w-0 sm:min-w-[200px] lg:min-w-[250px]">
                      <div className="font-bold text-xs sm:text-sm text-black mb-1 uppercase tracking-wide">
                        Ma. Violeta P. Yamsuan
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-gray-600">City Government Department Head</div>
                  </div>

                  <div className="text-center flex-1">
                    <div className="border-t-2 border-black mb-1 pt-4 sm:pt-5 min-w-0 sm:min-w-[200px] lg:min-w-[250px]">
                      <div className="font-bold text-xs sm:text-sm text-black mb-1 uppercase tracking-wide">
                        Edwin L. Olivarez
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-gray-600">City Mayor</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>  
      </div>
  
    </div>
  )
}
