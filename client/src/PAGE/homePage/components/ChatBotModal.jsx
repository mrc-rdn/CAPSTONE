import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000"; 

export default function GeminiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/ask`, { question: input });
      setMessages(prev => [...prev, { sender: "bot", text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "Hindi makakonekta sa server. Pakicheck ang backend." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all"
      >
        {isOpen ? "✖" : "💬"}
      </button>

      {/* Modal Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-[450px] bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-blue-600 p-4 text-white font-bold">Gemini Assistant</div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-2 rounded-lg text-sm max-w-[80%] ${m.sender === "user" ? "bg-blue-500 text-white" : "bg-white border"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400">Gemini is thinking...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t flex gap-2">
            <input 
              className="flex-1 border rounded px-2 py-1 text-sm outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type here..."
            />
            <button onClick={handleSend} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}