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
          `${API_URL}/trainer/message/search?q=${query}`,
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
    setQuery(""); // Clear search dropdown
  };

  const handleExitModal = () => {
    setSelectedUser(null);
    props.refresh(); // Refresh contacts if needed
  };

  const colorMap = {
    red: { 500: 'bg-red-500' }, yellow: { 500: 'bg-yellow-500' },
    green: { 500: 'bg-green-500' }, orange: { 500: 'bg-orange-500' },
    blue: { 500: 'bg-blue-500' }, purple: { 500: 'bg-purple-500' },
    pink: { 500: 'bg-pink-500' },
  };

  return (
    <div className="relative z-[60] w-full max-w-md">
      <div className="relative group">
        <SearchIcon 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" 
          sx={{ fontSize: 18 }} 
        />
        <input
          type="text"
          placeholder="Search trainers or trainees..."
          className="bg-white/60 backdrop-blur-md border border-slate-200/60 
                     p-2.5 pl-11 w-full rounded-xl 
                     text-sm font-medium text-slate-700 placeholder-slate-400
                     focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500/20 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Search Results Dropdown */}
      {query && results && (
        <div className="absolute right-0 w-full mt-3 max-h-80 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-[1.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden z-[100]">
          <div className="p-2 border-b border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">Search Results</p>
          </div>
          <ul className="p-2 overflow-y-auto max-h-64 custom-scrollbar">
            {results.length > 0 ? (
              results.map((info, index) => (
                <Profile 
                  onSelect={handleSelectUser}
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

      {/* Global Modal managed by Header with Portal to ensure it escapes relative parents */}
      {selectedUser && createPortal(
        <SelectedProfile
          onExit={handleExitModal}
          {...selectedUser}
          userColorClass={colorMap[selectedUser.color]?.[selectedUser.shade] || 'bg-slate-500'}
        />,
        document.body
      )}
    </div>
  );
}
