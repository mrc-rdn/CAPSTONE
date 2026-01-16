import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false); // State para sa modal
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Greeting pagka-bukas ng modal
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([{ 
          role: 'ai', 
          text: "Magandang araw! Ako ang E-Kabuhayan AI Assistant. Para sa registration at enrollment, mangyaring pumunta sa official PLRMO Facebook Page para ma-assign sa inyong kurso. May maipaglilingkod pa ba ako?" 
        }]);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: Cannot connect to server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON (FAB) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#2D4F2B] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#F1F3E0] hover:text-[#2D4F2B] border border-green-800 transition-all active:scale-90 z-50"
      >
        {isOpen ? (
          // Close Icon (X)
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          // Chat Icon
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      {/* CHAT MODAL */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-[#2D4F2B] p-4 text-white font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>E-Kabuhayan Support</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl text-sm max-w-[85%] shadow-sm ${
                  m.role === 'user' ? 'bg-[#2D4F2B] text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-[10px] text-gray-400 italic px-2">Sumasagot...</div>}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mag-type ng tanong..."
              className="flex-1 p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm"
            />
            <button 
              disabled={isLoading} 
              type="submit"
              className="bg-[#2D4F2B] text-white p-2 rounded-lg hover:bg-[#F1F3E0] hover:text-[#2D4F2B] border-2 border-green-800  disabled:bg-gray-400 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;