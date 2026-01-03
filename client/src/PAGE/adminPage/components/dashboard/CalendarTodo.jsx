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

    const result = await axios.post(`${API_URL}/admin/dashboard/upcomingschedule`,
        {date1: formatted1, date2: formatted2},
        {withCredentials:true}
    )
    setUpcomingEvents(result.data.data)
    props.handleUpcomingEventData(result.data.data)
  }
  useEffect(()=>{
    fetchDate()
  },[]);
  
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

    const result = await axios.post(`${API_URL}/admin/dashboard/upcomingschedule`,
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
    
    
    const result = await axios.post(`${API_URL}/admin/dashboard/upcomingschedule`,
        {date1: formatted1, date2: formatted2},
        {withCredentials:true}
    )

    props.handleUpcomingEventData(result.data.data)
  };

  const openDateModal = (day) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setEventInputText("");
    setIsModalOpen(true);
    const dateStr = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
    console.log(dateStr); // "2025-11-01"

    
    
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
      `${API_URL}/admin/calendar/events`,
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

  function  handleRefresh(){
    setRefresh(prev => prev + 1)
  }
    //fetch the calendar data 
  useEffect(()=>{
   async function fetchEvents() {
    try {
      const res = await axios.get(`${API_URL}/admin/calendar/events`, {
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
      
    } catch (err) {
      console.error("Failed to load events", err);
    }
  }
    fetchEvents()
  }, [refresh])

  const deleteEvent = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/admin/calendar/events/${id}` , {withCredentials:true})
      console.log(res)
      handleRefresh()
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
    <div className="w-full h-full px-3 py-2 rounded-xl bg-white border-2 border-gray-200"
    style={{boxShadow: "3px 3px 5px rgba(0,0,0,0.1)"}}>
      {/* Header */}
      <div className="flex justify-between mt-2">
        <button onClick={goToPreviousMonth}><ArrowBackIosIcon/></button>
        <h2 className="font-bold text-xl">
          {monthName} {year}
        </h2>
        <button onClick={goToNextMonth}><ArrowForwardIosIcon /></button>
      </div>

      {/* Week Labels */}
      <div className="grid grid-cols-7 text-center text-gray-500 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
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
              onClick={() => openDateModal(day)}
              className={` pb-3 rounded hover:bg-green-700/90 relative hover:text-white text-green-900 ${isToday(date) ? "bg-green-600 text-white" : "bg-green-200"}`}
            ><p className="text-lg  font-semibold  ">
              {day}
            </p>
              

              <div className="absolute top-6 left-1 flex gap-1 items-center">
                {dayEvents.slice(0, 3).map((ev, idx) => (
                  <span
                    key={idx}
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: ev.color }}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-xs text-white">
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-80 p-4 rounded shadow relative">
            <button
              className="absolute top-2 right-2"
              onClick={() => {setIsModalOpen(false), handleRefresh()}}
            >
              ✕
            </button>

            <h3 className="font-bold mb-2">
              {selectedDate.toDateString()}
            </h3>

            <input
              value={eventInputText}
              onChange={(e) => setEventInputText(e.target.value)}
              className="border p-1 w-full mb-2"
              placeholder="Add event..."
            />

            <button
              onClick={() => {
                addEventToDate();
                handleRefresh();
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded mb-2"
            >
              Add
            </button>

            <ul className="max-h-40 overflow-y-auto">
              {getEventsFor(selectedDate).map((ev, idx) => (
                <li
                  key={idx}
                  className="flex justify-between bg-gray-100 p-1 rounded mb-1"
                >
                  <span style={{ color: ev.color }}>{ev.text}</span>
                  <button
                    className="text-red-600"
                    onClick={() => deleteEvent(ev.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}

              {getEventsFor(selectedDate).length === 0 && (
                <li className="text-gray-500">No events</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

