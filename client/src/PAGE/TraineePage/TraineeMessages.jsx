import React, {useEffect, useState} from 'react'
import Navbar from './components/Navbar.jsx'
import Header from './components/message/Header.jsx'
import AddContactModal from './components/message/AddContactModal.jsx'
import ContactList from './components/message/ContactList.jsx'
import axios from 'axios'
import { API_URL } from '../../api.js'
import { io } from "socket.io-client";

const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: false
});

export default function Message() {
  const [isAddContactModal, setIsAddContactModal] = useState(false)
  const [userData, setUserData] = useState([])

  function handleOpenAddContactModal (){
    setIsAddContactModal(true)
    
  }
  function onExitAddContactModal (){
    setIsAddContactModal(false)
  }


  useEffect(()=>{
    async function fetchData(){
      try {
        const response = await axios.get(`${API_URL}/trainee/dashboard`, {withCredentials: true});
        setUserData(response.data.usersInfo)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  },[])
//
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="flex w-screen h-screen ">
        <Navbar />
        <div className='w-full bg-gray-200'>
          
          <Header title="message" handleOpenAddContactModal={handleOpenAddContactModal} />
          {isAddContactModal?<AddContactModal onExit={onExitAddContactModal} /> :null }
          <ContactList userData={userData} socket={socket} />
        </div>
    </div>
  )
}
