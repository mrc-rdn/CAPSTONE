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

  // FETCH CONTACTS (Kept Admin Endpoint)
  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/chats`, { withCredentials: true });
      setContacts(res.data);
    } catch (err) { console.log("fetchContacts error:", err); }
  };

  useEffect(() => { fetchContacts(); }, [refresh]);

  useEffect(() => {
    if (!socket) return;
    const handleNotification = ({ chat_id }) => { if (chat_id !== contactId) fetchContacts(); };
    const handleReceiveMessage = (newMessage) => {
      if (newMessage.chat_id === contactId) {
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`${API_URL}/admin/chats/${contactId}/seen`, {}, { withCredentials: true });
      } else { fetchContacts(); }
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

  const handleSelectContact = async (chatId) => {
    try {
      setContactId(chatId);
      setActiveContactId(chatId);
      socket.emit("join-chat", chatId);
      await axios.put(`${API_URL}/admin/chats/${chatId}/seen`, {}, { withCredentials: true });
      const res = await axios.get(`${API_URL}/admin/${chatId}`, { withCredentials: true });
      setMessages(res.data.data);
      fetchContacts();
    } catch (err) { console.log("select contact error:", err); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await axios.post(`${API_URL}/admin/sendMessage`, { chat_id: contactId, message }, { withCredentials: true });
      setMessage("");
    } catch (err) { console.log("send message error:", err); }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div className="flex h-full gap-6 p-6">
      {/* CONTACT LIST COLUMN */}
      <aside className="w-80 flex flex-col bg-slate-50/50 dark:bg-slate-900/20 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40">
          <h3 className="font-black text-slate-800 dark:text-slate-100 tracking-tight">Contacts</h3>
        </div>
        <ul className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {contacts.map((contact) => {
            const isOtherUser = contact.user1_id !== userData.id;
            return (
              <li key={contact.id}>
                <Contact
                  firstName={isOtherUser ? contact.user1_firstname : contact.user2_firstname}
                  surname={isOtherUser ? contact.user1_surname : contact.user2_surname}
                  profile={isOtherUser ? contact.user1_profile_pic : contact.user2_profile_pic}
                  color={isOtherUser ? contact.user1_color : contact.user2_color}
                  shade={isOtherUser ? contact.user1_shades : contact.user2_shades}
                  unread_count={contact.unread_count}
                  isActive={activeContactId === contact.id}
                  handleSelectContact={() => handleSelectContact(contact.id)}
                />
              </li>
            );
          })}
        </ul>
      </aside>

      {/* CHAT MAIN AREA */}
      <div className="flex-1 flex flex-col bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm">
        {contactId ? (
          <>
            <div className="h-16 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex items-center px-8 justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30 shadow-sm text-indigo-700 dark:text-indigo-300 font-black">
                  {(() => {
                    const active = contacts.find(c => c.id === contactId);
                    return active?.user1_id !== userData.id ? active?.user1_firstname[0] : active?.user2_firstname[0];
                  })()}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {(() => {
                      const active = contacts.find(c => c.id === contactId);
                      return active?.user1_id !== userData.id 
                        ? `${active?.user1_firstname} ${active?.user1_surname}` 
                        : `${active?.user2_firstname} ${active?.user2_surname}`;
                    })()}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/30 dark:bg-slate-950/10">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <Messages key={index} message={msg} userData={userData} />
                ))}
                <div ref={bottomRef} />
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                <input
                  type="text"
                  className="flex-1 h-11 px-4 text-sm font-medium bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder-slate-400"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                    message.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <SendIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-800 shadow-sm">
              <SendIcon sx={{ fontSize: 32, color: '#4f46e5', transform: 'rotate(-45deg)' }} />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Admin Communications</h3>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-xs">
              Select a conversation to manage user support and inquiries
            </p>
          </div>
        )}
      </div>
    </div>
  );
}