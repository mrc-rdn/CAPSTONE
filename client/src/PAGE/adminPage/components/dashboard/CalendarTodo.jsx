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
  const [refresh, setRefresh] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();
  const monthName = currentViewDate.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  function handleRefresh() {
    setRefresh(prev => prev + 1);
  }

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string") return date.split("T")[0];
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getEventsFor = (date) => {
    if (!calendarEvents || !Array.isArray(calendarEvents)) return [];
    const key = formatDate(date);
    return calendarEvents.filter(ev => ev.event_date === key);
  };

  // Keep Admin Endpoint
  const fetchDate = async () => {
    const date1 = new Date(year, month, 1);
    const date2 = new Date(year, month + 1, 1);
    const formatted1 = `${date1.getFullYear()}-${date1.getMonth() + 1}-${date1.getDate()}`;
    const formatted2 = `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`;

    const result = await axios.post(`${API_URL}/admin/dashboard/upcomingschedule`,
        { date1: formatted1, date2: formatted2 },
        { withCredentials: true }
    );
    setUpcomingEvents(result.data.data);
    props.handleUpcomingEventData(result.data.data);
  };

  useEffect(() => {
    fetchDate();
  }, [refresh]);
  
  const goToPreviousMonth = () => setCurrentViewDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentViewDate(new Date(year, month + 1, 1));

  const openDateModal = (day) => {
    const date = new Date(year, month, day);
    if (isPastDate(date)) return;
    setSelectedDate(date);
    setEventInputText("");
    setIsModalOpen(true);
  };

  // Keep Admin Endpoint
  async function addEventToDate() {
    try {
      if (!selectedDate) return;
      const dateString = formatDate(selectedDate);
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
      setEventInputText(""); // Clear input after success
    } catch (error) {
      console.log('Error in addEventToDate:', error);
    }
  }

  // Keep Admin Endpoint
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(`${API_URL}/admin/calendar/events`, { withCredentials: true });
        const cleaned = res.data.events.map(ev => {
          const d = new Date(ev.event_date);
          return {
            ...ev,
            event_date: formatDate(d)
          };
        });
        setCalendarEvents(cleaned);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    }
    fetchEvents();
  }, [refresh]);

  // Keep Admin Endpoint
  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/calendar/events/${id}`, { withCredentials: true });
      handleRefresh();
    } catch (error) {
      console.log('error deleting', error);
    }
  };

  const generateRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="w-full rounded-2xl bg-white/15 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="p-2 rounded-full bg-white/20 dark:bg-slate-800 hover:bg-white/30 dark:hover:bg-slate-700 transition"
          onClick={goToPreviousMonth}
        >
          <ArrowBackIosIcon fontSize="small" className="dark:text-slate-100" />
        </button>

        <h2 className="font-bold text-lg text-[#2D4F2B] dark:text-emerald-400 tracking-wide">
          {monthName} {year}
        </h2>

        <button
          className="p-2 rounded-full bg-white/20 dark:bg-slate-800 hover:bg-white/30 dark:hover:bg-slate-700 transition"
          onClick={goToNextMonth}
        >
          <ArrowForwardIosIcon fontSize="small" className="dark:text-slate-100" />
        </button>
      </div>

      {/* Week Labels */}
      <div className="grid grid-cols-7 text-center text-xs font-black uppercase tracking-widest text-[#708A58] dark:text-emerald-500/70 mb-3">
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
                relative aspect-square rounded-xl p-2 backdrop-blur-sm border border-white/20 dark:border-slate-800 transition-all duration-200 flex flex-col items-center justify-center
                ${isToday(date)
                    ? "bg-[#2D4F2B] dark:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : isPastDate(date)
                    ? "bg-gray-300/20 dark:bg-slate-800/40 text-gray-400 dark:text-slate-600 cursor-not-allowed"
                    : "bg-white/30 dark:bg-slate-800/60 text-[#2D4F2B] dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700"
                }
              `}
            >
              <p className="text-sm font-black tracking-tight">{day}</p>

              <div className="absolute bottom-1.5 flex gap-0.5">
                {dayEvents.slice(0,3).map((ev,idx)=>(
                  <span
                    key={idx}
                    className="w-1 h-1 rounded-full"
                    style={{backgroundColor:ev.color}}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className={`text-[8px] font-black leading-none ${isToday(date) ? 'text-white' : 'text-[#2D4F2B] dark:text-emerald-400'}`}>
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
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="relative w-[420px] max-w-full bg-white dark:bg-slate-900 border border-white/30 dark:border-slate-800 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <button
              className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              onClick={() => {
                setIsModalOpen(false);
                handleRefresh();
                props.onRefresh();
              }}
            >
              ✕
            </button>

            <h3 className="font-black text-slate-800 dark:text-white mb-4 uppercase tracking-widest text-xs">
              {selectedDate.toDateString()}
            </h3>

            <input
              value={eventInputText}
              onChange={(e) => setEventInputText(e.target.value)}
              placeholder="Add new event..."
              className="w-full p-3 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D4F2B] dark:focus:ring-emerald-500 transition-all"
            />

            <button
              onClick={addEventToDate}
              className="w-full bg-[#2D4F2B] dark:bg-emerald-600 hover:bg-[#1e3a1c] dark:hover:bg-emerald-700 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs mb-6 transition-all active:scale-95"
            >
              Create Event
            </button>

            <ul className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
              {getEventsFor(selectedDate).map(ev => (
                <li key={ev.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200" style={{borderLeft: `3px solid ${ev.color}`, paddingLeft: '8px'}}>
                    {ev.text}
                  </span>
                  <button
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
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