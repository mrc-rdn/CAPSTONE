import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../api";
import Profile from "./Profile";

export default function Header(props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

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

  const refresh = ()=>{
    props.refresh()
  }

  console.log(results);

  return (
    <div className="px-4 pt-4 z-100">
      <div className="flex w-full h-16 bg-white/10 border border-black/10 rounded-xl shadow-md ">
      <div className="h-full flex items-center ml-3 gap-2 w-full">
        <h1 className="text-xl font-bold text-[#2D4F2B]">
          {props.title}
        </h1>

        <div className="w-full flex">
          <div className=" w-6/12 mx-auto relative "> 
            <input
              type="text"
              placeholder="Search..."
              className="bg-white/60 backdrop-blur-md border border-black/10 
                         p-2 pl-5 w-full rounded-full 
                         text-sm text-gray-700 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-black/10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            { results && <div className="absolute w-full mt-2 max-h-80 bg-white/80 border border-black/10 rounded-xl shadow-lg overflow-y-auto ">
              <ul className="z-100">
                {results.map((info, index)=>{
                  return <Profile refresh={refresh} key={index} id={info.id} username={info.username} firstName={info.first_name} surname={info.surname} profile={info.profile_pic}color={info.color}shade={info.shades} />
                })}

              </ul>
            </div>}

          </div>
          

          
        </div>
        

      </div>
      </div>
    </div>
  );
}
