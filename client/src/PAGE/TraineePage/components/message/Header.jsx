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
          `${API_URL}/trainee/message/search?q=${query}`,
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
    // Mapping keys to match the Profile component's expected props
    setSelectedUser({
      ...user,
      firstName: user.first_name // ensuring naming consistency
    });
    setQuery(""); // Clear search to hide dropdown
  };

  const handleExitModal = () => {
    setSelectedUser(null);
    props.refresh(); 
  };

  const colorMap = {
    red: { 500: 'bg-red-500' }, yellow: { 500: 'bg-yellow-500' },
    green: { 500: 'bg-green-500' }, orange: { 500: 'bg-orange-500' },
    blue: { 500: 'bg-blue-500' }, purple: { 500: 'bg-purple-500' },
    pink: { 500: 'bg-pink-500' },
  };

  return (
    <div className="relative z-[60] w-full max-w-md">
      {/* Search Input Container */}
      <div className="relative group">
        <SearchIcon 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2D4F2B] transition-colors" 
          sx={{ fontSize: 18 }} 
        />
        <input
          type="text"
          placeholder="Search for trainers or colleagues..."
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 
                     p-2.5 pl-11 w-full rounded-xl 
                     text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400
                     focus:outline-none focus:ring-4 focus:ring-[#2D4F2B]/5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2D4F2B]/20 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Search Results Dropdown */}
      {query && results && (
        <div className="absolute right-0 w-full mt-3 max-h-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[1.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden z-[100]">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">Direct Search</p>
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

      {/* Global Modal using Portal */}
      {selectedUser && createPortal(
        <SelectedProfile
          onExit={handleExitModal}
          {...selectedUser}
          userColorClass={colorMap[selectedUser.color]?.[selectedUser.shades || 500] || 'bg-slate-500'}
        />,
        document.body
      )}
    </div>
  );
}