import React, {useEffect, useState} from 'react'
import Navbar from './components/Navbar.jsx'
import Header from './components/message/Header.jsx'
import AddContactModal from './components/message/SelectedProfile.jsx'
import ContactList from './components/message/ContactList.jsx'
import axios from 'axios'
import { API_URL } from '../../api.js'
import { io } from "socket.io-client";

const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: false
});

export default function AdminMessages() {

  const [userData, setUserData] = useState([])
  const [refresh, setRefresh] = useState(0)

  function handlerefresh(){
    setRefresh(prev => prev + 1)
    
  }
 
    
 


  useEffect(()=>{
    async function fetchData(){
      try {
        const response = await axios.get(`${API_URL}/admin/dashboard`, {withCredentials: true});
        setUserData(response.data.usersInfo)
        
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
    
  },[])

  //
  useEffect(() => {
    socket.connect();
    console.log(socket)
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => socket.disconnect();
  }, []);
  

  return (
    <div className="flex w-screen h-screen ">
      <div className="absolute inset-0 -z-10 overflow-hidden">
  <img
    src="/images/plmro.jpg"
    alt="Dashboard background"
    className="w-full h-full object-cover scale-105 "
  />
</div>
        <Navbar />
        <div className="w-full h-full flex flex-col relative ">
          
          <Header title="message" refresh={handlerefresh}  />
          
          <ContactList userData={userData} socket={socket} handlerefresh={refresh} />
        </div>
    </div>
  )
}