import React, { useState, useEffect } from "react";
import axios from "axios";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { API_URL } from "../../../../api";

// In-memory storage
let demoCalendarEvents = [];

export default function GoogleCalendarUI(props) {
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventInputText, setEventInputText] = useState("");
  const [calendarEvents, setCalendarEvents] = useState(demoCalendarEvents);
  const [refresh, setRefresh] = useState(0)
  const [upcomingEvents, setUpcomingEvents] = useState([])

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();
  const monthName = currentViewDate.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  function  handleRefresh(){
    
    setRefresh(prev => prev + 1)
   
  }
  const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // remove time

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate < today;
};



  const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") {
    return date.split("T")[0]; // tanggalin ang oras
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};



  // Get all events for a specific date
  const getEventsFor = (date) => {
  if (!calendarEvents || !Array.isArray(calendarEvents)) return [];

  const key = formatDate(date);
  return calendarEvents.filter(ev => ev.event_date === key);
};

  const fetchDate = async()=>{
    const date1 = new Date(new Date(year, month, 1));
    const date2 = new Date(new Date(year, month+1 , 1));

    const year1 = date1.getFullYear();
    const month1 = date1.getMonth() + 1; // months are 0-based
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth() + 1; // months are 0-based
    const day2 = date2.getDate();

    const formatted1 = `${year1}-${month1}-${day1}`;
    const formatted2 = `${year2}-${month2}-${day2}`;

    const result = await axios.post(`${API_URL}/trainee/dashboard/upcomingschedule`,
        {date1: formatted1, date2: formatted2},
        {withCredentials:true}
    )
    setUpcomingEvents(result.data.data)
    props.handleUpcomingEventData(result.data.data)
    
  }
  useEffect(()=>{
    fetchDate()
  },[refresh]);

  const goToPreviousMonth = async() =>{
    setCurrentViewDate(new Date(year, month - 1, 1))
  
    const date1 = new Date(new Date(year, month - 1, 1));
    const date2 = new Date(new Date(year, month , 1));

    const year1 = date1.getFullYear();
    const month1 = date1.getMonth() + 1; // months are 0-based
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth() + 1; // months are 0-based
    const day2 = date2.getDate();

    const formatted1 = `${year1}-${month1}-${day1}`;
    const formatted2 = `${year2}-${month2}-${day2}`;

    const result = await axios.post(`${API_URL}/trainee/dashboard/upcomingschedule`,
        {date1: formatted1, date2: formatted2},
        {withCredentials:true}
    )
    
    props.handleUpcomingEventData(result.data.data)

  };

  const goToNextMonth = async() =>{
    setCurrentViewDate(new Date(year, month + 1, 1))
    const date1 = new Date(new Date(year, month+ 1 , 1));
    const date2 = new Date(new Date(year, month +2, 1));

    const year1 = date1.getFullYear();
    const month1 = date1.getMonth() + 1; // months are 0-based
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth() + 1; // months are 0-based
    const day2 = date2.getDate();

    const formatted1 = `${year1}-${month1}-${day1}`;
    const formatted2 = `${year2}-${month2}-${day2}`;
    
    
    const result = await axios.post(`${API_URL}/trainee/dashboard/upcomingschedule`,
        {date1: formatted1, date2: formatted2},
        {withCredentials:true}
    )

    props.handleUpcomingEventData(result.data.data)
  };

 const openDateModal = (day) => {
  const date = new Date(year, month, day);

  if (isPastDate(date)) return; // ❌ stop here

  setSelectedDate(date);
  setEventInputText("");
  setIsModalOpen(true);
};


  async function addEventToDate() {
  try {
    if (!selectedDate) {
      console.log("No date selected!");
      return;
    }

    // Kunin yung local date sa format YYYY-MM-DD
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // month 0-indexed
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    console.log("Sending date:", dateString);

    const result = await axios.post(
      `${API_URL}/trainee/calendar/events`,
      {
        text: eventInputText,
        color: generateRandomColor(),
        event_date: dateString
      },
      { withCredentials: true }
    );

    setCalendarEvents(result.data.events);

  } catch (error) {
    console.log('Error in addEventToDate:', error);
  }
}

    //fetch the calendar data 
  useEffect(()=>{
   async function fetchEvents() {
    try {
      const res = await axios.get(`${API_URL}/trainee/calendar/events`, {
        withCredentials: true
      });

      const cleaned = res.data.events.map(ev => {
      const d = new Date(ev.event_date); // convert string to Date
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return {
        ...ev,
        event_date: `${year}-${month}-${day}` // YYYY-MM-DD, local date
      };
    });


      setCalendarEvents(cleaned); // MUST be an array
      setRefresh(prev => prev + 1)
    } catch (err) {
      console.error("Failed to load events", err);
    }
  }
    fetchEvents()
  }, [refresh])

  const deleteEvent = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/trainee/calendar/events/${id}` , {withCredentials:true})
      console.log(res)
     setRefresh(prev => prev + 1)
    } catch (error) {
      console.log('error deleting you todo',error)
    }
  };

  const generateRandomColor = () =>`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

  const isToday = (date) => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

  return (
  <div
    className="
      w-full
      rounded-2xl
      bg-white/15
      backdrop-blur-xl
      border
      border-white/30
      shadow-[0_8px_30px_rgba(0,0,0,0.08)]
      p-4
    "
  >

    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <button
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
        onClick={goToPreviousMonth}
      >
        <ArrowBackIosIcon fontSize="small" />
      </button>

      <h2 className="font-bold text-lg text-[#2D4F2B] tracking-wide">
        {monthName} {year}
      </h2>

      <button
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
        onClick={goToNextMonth}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </button>
    </div>

    {/* Week Labels */}
    <div className="grid grid-cols-7 text-center text-xs font-medium text-[#708A58] mb-3">
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
        <div key={d}>{d}</div>
      ))}
    </div>

    {/* Calendar Grid */}
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
        <div key={i} />
      ))}

      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const date = new Date(year, month, day);
        const dayEvents = getEventsFor(date);

        return (
         <button
            key={day}
            disabled={isPastDate(date)}
            onClick={() => openDateModal(day)}
            className={`
              relative
              aspect-square
              rounded-xl
              p-2
              backdrop-blur-sm
              border
              border-white/20
              transition-all
              duration-200
              ${
                isToday(date)
                  ? "bg-[#2D4F2B]/80 text-[#FFF1CA] shadow-lg"
                  : isPastDate(date)
                  ? "bg-gray-300/40 text-gray-400 cursor-not-allowed"
                  : "bg-white/30 text-[#2D4F2B] hover:bg-[#FFF1CA]/30"
              }
            `}
          >

            <p className="text-sm font-semibold">{day}</p>

            <div className="absolute bottom-1 left-1 flex gap-1">
              {dayEvents.slice(0,3).map((ev,idx)=>(
                <span
                  key={idx}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{backgroundColor:ev.color}}
                />
              ))}
              {dayEvents.length > 3 && (
                <span className="text-[10px] text-[#2D4F2B] ml-1">
                  +{dayEvents.length - 3}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>

    {/* MODAL */}
    {isModalOpen && selectedDate && (
      <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center backdrop-blur-sm rounded-xl">

        <div
          className="
            relative
            w-[420px]
            max-w-[92vw]
            bg-white/20
            backdrop-blur-xl
            border
            border-white/30
            rounded-2xl
            p-5
            shadow-[0_10px_40px_rgba(0,0,0,0.15)]
          "
        >
          <button
            className="absolute top-3 right-4 text-white/70 hover:text-white"
            onClick={() => {
              setIsModalOpen(false);
              handleRefresh();
              props.onRefresh();
            }}
          >
            ✕
          </button>

          <h3 className="font-semibold text-white mb-3">
            {selectedDate.toDateString()}
          </h3>

          <input
            value={eventInputText}
            onChange={(e) => setEventInputText(e.target.value)}
            placeholder="Add event..."
            className="
              w-full
              p-2
              mb-3
              rounded-lg
              bg-white/70
              border
              border-white/40
              focus:outline-none
              focus:ring-2
              focus:ring-[#2D4F2B]
            "
          />

          <button
            onClick={addEventToDate}
            className="
              w-full
              bg-[#2D4F2B]/80
              hover:bg-[#2D4F2B]
              text-white
              py-2
              rounded-lg
              font-medium
              mb-4
              transition
            "
          >
            Add Event
          </button>

          <ul className="space-y-2 max-h-52 overflow-y-auto">
            {getEventsFor(selectedDate).map(ev => (
              <li
                key={ev.id}
                className="
                  flex
                  justify-between
                  items-center
                  bg-white/30
                  rounded-lg
                  px-3
                  py-2
                "
              >
                <span className="text-[#2D4F2B]" style={{color: ev.color}}>
                  {ev.text}
                </span>
                <button
                  className="text-[#CF0F0F] hover:text-[#CF0F0F]/500"
                  onClick={() => deleteEvent(ev.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
);

}
