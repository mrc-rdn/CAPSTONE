import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../../api";
import Contact from "./Contact.jsx";
import Messages from "./Messages.jsx";
import SendIcon from "@mui/icons-material/Send";

export default function ContactList({ userData, socket, refresh }) {
  const [contacts, setContacts] = useState([]);
  const [contactId, setContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [message, setMessage] = useState("");

  const bottomRef = useRef(null);

  // =============================
  // FETCH CONTACTS
  // =============================
  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_URL}/trainee/chats`, {
        withCredentials: true,
      });
      setContacts(res.data);
    } catch (err) {
      console.log("fetchContacts error:", err);
    }
  };

  // =============================
  // INITIAL LOAD + MANUAL REFRESH
  // =============================
  useEffect(() => {
    fetchContacts();
  }, [refresh]);

  // =============================
  // SOCKET LISTENERS
  // =============================
  useEffect(() => {
    if (!socket) return;

    // 🔔 NOTIFICATION
    const handleNotification = ({ chat_id }) => {
      // ❌ nasa loob na ng chat → wag mag notif
      if (chat_id === contactId) return;
      fetchContacts();
    };

    // 💬 REALTIME MESSAGE
    const handleReceiveMessage = (newMessage) => {
      if (newMessage.chat_id === contactId) {
        // nasa active chat → show agad
        setMessages((prev) => [...prev, newMessage]);

        // auto seen
        axios.put(
          `${API_URL}/trainee/chats/${contactId}/seen`,
          {},
          { withCredentials: true }
        );
      } else {
        // ibang chat → notif
        fetchContacts();
      }
    };

    socket.on("new_notification", handleNotification);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("seen_update", fetchContacts);

    return () => {
      socket.off("new_notification", handleNotification);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("seen_update", fetchContacts);
    };
  }, [socket, contactId]);

  // =============================
  // SELECT CONTACT
  // =============================
  const handleSelectContact = async (chatId) => {
    try {
      setContactId(chatId);
      setActiveContactId(chatId);

      socket.emit("join-chat", chatId);

      await axios.put(
        `${API_URL}/trainee/chats/${chatId}/seen`,
        {},
        { withCredentials: true }
      );

      const res = await axios.get(`${API_URL}/trainee/${chatId}`, {
        withCredentials: true,
      });

      setMessages(res.data.data);
      fetchContacts();
    } catch (err) {
      console.log("select contact error:", err);
    }
  };

  // =============================
  // SEND MESSAGE
  // =============================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await axios.post(
        `${API_URL}/trainee/sendMessage`,
        {
          chat_id: contactId,
          message,
        },
        { withCredentials: true }
      );

      setMessage("");
    } catch (err) {
      console.log("send message error:", err);
    }
  };
console.log(contacts)
  // =============================
  // AUTO SCROLL
  // =============================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex">
      {/* CONTACT LIST */}
      <div className="w-4/12 bg-white overflow-y-auto">
        <ul>
          {contacts.map((contact) => {
            const isOtherUser = contact.user1_id !== userData.id;

            return (
              <li key={contact.id}>
                <Contact
                  contactData={contact}
                  firstName={
                    isOtherUser
                      ? contact.user1_firstname
                      : contact.user2_firstname
                  }
                  surname={
                    isOtherUser
                      ? contact.user1_surname
                      : contact.user2_surname
                  }
                  profile={
                    isOtherUser
                      ? contact.user1_profile_pic
                      : contact.user2_profile_pic
                  }
                  color={
                    isOtherUser
                      ? contact.user1_color
                      : contact.user2_color
                  }
                  shade={
                    isOtherUser
                      ? contact.user1_shades
                      : contact.user2_shades
                  }
                  unread_count={contact.unread_count}
                  isActive={activeContactId === contact.id}
                  handleSelectContact={() =>
                    handleSelectContact(contact.id)
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* CHAT AREA */}
      <div className="w-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ul>
            {messages.map((msg, index) => (
              <Messages key={index} message={msg} userData={userData} />
            ))}
            <div ref={bottomRef} />
          </ul>
        </div>

        {/* INPUT */}
        {contactId && (
          <form
            onSubmit={handleSendMessage}
            className="h-20 bg-white flex items-center justify-center"
          >
            <input
              type="text"
              className="w-6/12 h-10 text-lg bg-green-500 rounded px-3 text-white placeholder-white"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="ml-3 text-green-700">
              <SendIcon sx={{ fontSize: 30 }} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
