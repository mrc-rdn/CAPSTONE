import React, {useEffect, useState} from 'react'
import { API_URL } from '../../../api'
import axios from 'axios'

export default function Certificate() {
    const [data, setdata] = useState([]);
    useEffect(()=>{
        async function fetchdata (){
            try {
                const result = await axios.get(`${API_URL}/trainee/dashboard`, {withCredentials:true})
                setdata(result.data.data)
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
    <div className='w-full h-full '>
      <div className='w-full h-full overflow-y-scroll flex justify-center'>

        <div className="h-100 w-10/12">
            <div className="bg-white shadow-2xl relative border-[15px] border-green-700 print:shadow-none" id="certificate">
                <div className="p-16 lg:px-20 md:p-12 sm:px-8 sm:py-10 relative bg-white border-[3px] border-cert-gold min-h-[750px]">

                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 z-0">
                    <img
                    src="images/paranaque.png"
                    alt="Paranaque City Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => (e.target.style.display = "none")}
                    />
                </div>

                {/* Corners */}
                <div className="absolute top-5 left-5 w-20 h-20 border-[3px] border-green-600 border-r-0 border-b-0 z-[1]"></div>
                <div className="absolute top-5 right-5 w-20 h-20 border-[3px] border-green-600 border-l-0 border-b-0 z-[1]"></div>
                <div className="absolute bottom-5 left-5 w-20 h-20 border-[3px] border-green-600 border-r-0 border-t-0 z-[1]"></div>
                <div className="absolute bottom-5 right-5 w-20 h-20 border-[3px] border-green-600 border-l-0 border-t-0 z-[1]"></div>

                {/* Main Content */}
                <div className="relative z-[3] text-center">

                    {/* Header */}
                    <div className="mb-9">
                    <img
                        src="images/logo.gif"
                        alt="PLRMO Logo"
                        className="w-20 h-20 mx-auto mb-4 object-contain"
                        onError={(e) => (e.target.style.display = "none")}
                    />

                    <div className="text-xs font-semibold text-gray-800 tracking-wide leading-[1.8] mb-2">
                        PARAÑAQUE LIVELIHOOD RESOURCE MANAGEMENT OFFICE
                        <br />
                        PARAÑAQUE SKILLS TRAINING CENTER
                        <br />
                        PLRMO Bldg. Simplicio Cruz Cmpd., Brgy. San Isidro, Parañaque City
                    </div>
                    </div>

                    <h1 className="font-playfair text-[64px] md:text-[42px] font-black text-black tracking-[12px] md:tracking-[6px] my-5 uppercase" 
                        style={{ textShadow: "2px 2px 4px rgba(13, 92, 58, 0.1)" }}>
                    CERTIFICATE
                    </h1>
                    <h2 className="font-playfair text-[26px] md:text-xl font-normal text-gray-800 tracking-[8px] md:tracking-[4px] mb-8 uppercase">
                    OF COMPLETION
                    </h2>

                    <p className="text-base text-gray-800 mb-6 italic">Proudly presented to:</p>

                    {/* Student Name */}
                    <div
                    className="font-playfair text-5xl md:text-[32px] font-bold text-black border-b-[3px] border-black pb-2.5 mx-auto mb-8 capitalize max-w-[80%] md:max-w-[90%] inline-block"
                    id="recipientName"
                    >
                    {data.first_name} {data.surname}
                    </div>

                    <p className="text-[15px] text-gray-800 leading-[1.8] mb-2.5">
                    for having satisfactorily completed the training module on
                    </p>

                    {/* Module Name */}
                    <span className="font-bold text-black text-[22px] md:text-lg block my-4 capitalize" id="moduleName">
                    Loading...
                    </span>

                    {/* Dates */}
                    <p className="my-8 text-sm text-gray-800 italic">
                    <span>
                        Completed on: <strong id="completionFullDate">{completionDate.fullDate}</strong>
                    </span>
                    <span className="block mt-2 text-gray-800">
                        at <strong id="completionTime">{completionDate.time}</strong>
                    </span>
                    </p>

                    <div className="my-9 text-[13px] text-gray-800">
                    Issued at Parañaque City, Philippines this{" "}
                    <strong><span id="completionDay">{completionDate.day}</span></strong> day of{" "}
                    <strong><span id="completionMonth">{completionDate.month}</span></strong>,{" "}
                    <strong><span id="completionYear">{completionDate.year}</span></strong>
                    </div>


                    {/* Signatures */}
                    <div className="flex justify-around mt-[70px] gap-16 max-w-[800px] mx-auto">
                    <div className="text-center flex-1">
                        <div className="border-t-2 border-black mb-1 pt-5 min-w-[250px]">
                        <div className="font-bold text-sm text-black mb-1 uppercase tracking-wide">
                            Ma. Violeta P. Yamsuan
                        </div>
                        </div>
                        <div className="text-[11px] text-gray-600">City Government Department Head</div>
                    </div>

                    <div className="text-center flex-1">
                        <div className="border-t-2 border-black mb-1 pt-5 min-w-[250px]">
                        <div className="font-bold text-sm text-black mb-1 uppercase tracking-wide">
                            Edwin L. Olivarez
                        </div>
                        </div>
                        <div className="text-[11px] text-gray-600">City Mayor</div>
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
