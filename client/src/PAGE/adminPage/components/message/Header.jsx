import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { API_URL } from "../../../../api";
import Profile from "./Profile";
import SearchIcon from '@mui/icons-material/Search';
import SelectedProfile from "./SelectedProfile";

export default function Header(props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/admin/message/search?q=${query}`,
          { withCredentials: true }
        );
        setResults(res.data.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchData();
  }, [query]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setQuery(""); // Clear search dropdown after selection
  };

  const handleExitModal = () => {
    setSelectedUser(null);
    if (props.refresh) props.refresh(); 
  };

  const colorMap = {
    red: { 500: 'bg-red-500' }, yellow: { 500: 'bg-yellow-500' },
    green: { 500: 'bg-green-500' }, orange: { 500: 'bg-orange-500' },
    blue: { 500: 'bg-blue-500' }, purple: { 500: 'bg-purple-500' },
    pink: { 500: 'bg-pink-500' },
  };

  return (
    <div className="px-4 pt-4 relative z-[60]">
      <div className="flex w-full h-16 items-center px-6 bg-white/30 backdrop-blur-md border border-black/5 rounded-[1.5rem] shadow-sm gap-4">
        
        {/* Title */}
        <h1 className="text-xl font-black text-[#2D4F2B] tracking-tight whitespace-nowrap">
          {props.title}
        </h1>

        {/* Search Container */}
        <div className="relative flex-1 max-w-md group">
          <SearchIcon 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2D4F2B] transition-colors" 
            sx={{ fontSize: 18 }} 
          />
          <input
            type="text"
            placeholder="Search users..."
            className="bg-white/60 backdrop-blur-md border border-slate-200/60 
                       p-2.5 pl-11 w-full rounded-xl 
                       text-sm font-medium text-slate-700 placeholder-slate-400
                       focus:outline-none focus:ring-4 focus:ring-[#2D4F2B]/5 focus:bg-white focus:border-[#2D4F2B]/20 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Search Results Dropdown */}
          {query && results && (
            <div className="absolute left-0 w-full mt-3 max-h-80 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-[1.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden z-[100]">
              <div className="p-2 border-b border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">Search Results</p>
              </div>
              <ul className="p-2 overflow-y-auto max-h-64 custom-scrollbar">
                {results.length > 0 ? (
                  results.map((info, index) => (
                    <Profile 
                      onSelect={() => handleSelectUser(info)}
                      key={index} 
                      id={info.id} 
                      username={info.username} 
                      firstName={info.first_name} 
                      surname={info.surname} 
                      profile={info.profile_pic}
                      color={info.color}
                      shade={info.shades} 
                    />
                  ))
                ) : (
                  <li className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    No users found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Global Modal managed by Header with Portal */}
      {selectedUser && createPortal(
        <SelectedProfile
          onExit={handleExitModal}
          id={selectedUser.id}
          username={selectedUser.username}
          firstName={selectedUser.first_name}
          surname={selectedUser.surname}
          profile={selectedUser.profile_pic}
          userColorClass={colorMap[selectedUser.color]?.[selectedUser.shades] || 'bg-slate-500'}
        />,
        document.body
      )}
    </div>
  );
}