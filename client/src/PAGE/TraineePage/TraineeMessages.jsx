import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Header from "./components/message/Header.jsx";
import ContactList from "./components/message/ContactList.jsx";
import axios from "axios";
import { API_URL } from "../../api.js";
import { io } from "socket.io-client";

// ✅ ISANG SOCKET INSTANCE LANG
const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: false,
});

export default function AdminMessages() {
  const [userData, setUserData] = useState({});
  const [refresh, setRefresh] = useState(0);

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  // =============================
  // FETCH USER INFO
  // =============================
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${API_URL}/trainee/dashboard`, {
          withCredentials: true,
        });
        setUserData(res.data.usersInfo);
      } catch (err) {
        console.log(err);
      }
    }
    fetchUser();
  }, []);

  // =============================
  // SOCKET CONNECT (ONCE)
  // =============================
  useEffect(() => {
    if (!userData?.id) return;

    socket.connect();
    socket.emit("join-user", userData.id);

    return () => {
      socket.disconnect();
    };
  }, [userData?.id]);

  return (
    <div className="flex w-screen h-screen">
      <Navbar />

      <div className="w-full bg-gray-200">
        <Header title="message" refresh={handleRefresh} />

        <ContactList
          userData={userData}
          socket={socket}
          refresh={refresh}
        />
      </div>
    </div>
  );
}
