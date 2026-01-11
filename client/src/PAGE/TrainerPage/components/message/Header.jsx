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

  const refresh = ()=>{
    props.refresh()
  }

  console.log(results);

  return (
    <div className="flex w-full h-1/12 bg-white">
      <div className="h-full flex items-center ml-3 gap-2 w-full">
        <h1 className="text-xl font-bold text-green-700">
          {props.title}
        </h1>
        <div className="w-full flex">
          <div className=" w-6/12 mx-auto relative "> 
            <input
              type="text"
              placeholder="Search..."
              className="border p-2 pl-5 w-full rounded-full "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            { results && <div className="absolute  w-full max-h-100 bg-gray-300 overflow-y-scroll">
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
  );
}
