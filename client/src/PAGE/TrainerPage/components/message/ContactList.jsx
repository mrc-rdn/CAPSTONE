import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import { API_URL } from '../../../../api.js'
import Contact from './Contact.jsx'
import Messages from './Messages.jsx'
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';


export default function ContactList({userData, socket}) {
    
    const [contacts, setContacts] = useState([])
    const [contactId, setContactId] = useState()
    const [messages, setMessages] = useState([])
    const [isSelectedContact, setIsSelectedContact] = useState(false)
    const [activeContactId ,setActiveContactId] = useState()
    const [message, setMessage] = useState("")

    const [refresh, setRefresh]= useState(0);
    const bottomRef = useRef(null);
    const [isOpenChat, setIsOpenChat] = useState(false)
    const [notif, setNotifCount] = useState(0)
    
    function handleRefresh(index){
        setRefresh(prev => prev + 1)
        
    }
    socket.on("new_notification", () => {
  setNotifCount(prev => prev + 1);
});
console.log(notif)
    const handleSelectContactMessage = async(contactId)=>{
        console.log(contactId)
        setContactId(contactId)
        socket.emit("join-chat", contactId);
         try {
            const fetchData = await axios.get(`${API_URL}/trainer/${contactId}`, {withCredentials:true})
            setIsSelectedContact(true)
            setMessages(fetchData.data)
            setIsOpenChat(false)
            console.log(fetchData.data)
        } catch (error) {
            console.log('error', error)
        }
            
    }
    
    useEffect(()=>{ 
        const fetchContacts = async() =>{
            try {
                const fetchData = await axios.get(`${API_URL}/trainer/chats`, {withCredentials:true})
                
                setContacts(fetchData.data)
                
            } catch (error) {
                console.log('error', error)
            }
            
        }  
        fetchContacts()
        handleSelectContactMessage(contactId)
        setIsOpenChat(true)
        
        
    },[refresh])

    const handleSendMessage = async(e)=>{
        e.preventDefault()
        try {
            
            const fetchData = await axios.post(`${API_URL}/trainer/sendMessage`,{chat_id:contactId ,message:message}, {withCredentials:true})
            setMessage("")
            
            
        } catch (error) {
            console.log('error sending your message', error)
        }
    }
     

    
    useEffect(() => {
        socket.on("receive_message", (msg) => {
            
            if (msg.chat_id === contactId) {
            setMessages(prev => [...prev, msg]);
            c
            }
        });

        return () => {
            socket.off("receive_message");
        };
    }, [contactId]);    
    
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, []); // 👈 first load ONLY

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  

    const handleOpenChapters = ()=>{
      setIsOpenChat(true)
    }
    const handleExitChapters = ()=>{
      
      setIsOpenChat(false)
    }
  return (
    <div className='h-11/12 flex'>
        {isOpenChat?null:<button className="p-1  lg:hidden fixed left-23 top-21 z-50 lg:hidden "
          onClick={handleOpenChapters}>
            <CloseIcon sx={{fontSize: 25}} />
        </button>}
        <div className={isOpenChat?'fixed  w-full h-11/12 bg-white block overflow-y-scroll':'w-3/12 h-full bg-white hidden lg:block overflow-y-scroll '}>
            <ul>
                {contacts.map((contact, index) =>{
                    return<li key={index}>{contact.user1_id !== userData[0]?.id 
                        ?  <Contact 
                           contactData={contact} 
                           firstName={contact.user1_firstname} 
                           surname={contact.user1_surname} 
                           handleSelectContact={handleSelectContactMessage}
                           handleActiveChapter={()=>setActiveContactId(contact.id)}
                           isActive={activeContactId === contact.id } />
                        :  <Contact 
                            contactData={contact} 
                            firstName={contact.user2_firstname} 
                            surname={contact.user2_surname} 
                            handleSelectContact={handleSelectContactMessage}
                            handleActiveChapter={()=>setActiveContactId(contact.id)}
                            isActive={activeContactId === contact.id } />
                    }</li>
                })}
            </ul>
        </div>
        
        <div className="w-full flex flex-col">
            <div className="h-full overflow-y-scroll">
                <ul className="w-full h-full">
                    {messages.map((message, index) => (
                    <Messages
                        key={index}
                        message={message}
                        userData={userData}
                    />
                    ))}
                    {/* 👇 anchor */}
                    <div ref={bottomRef} />
                </ul>
            </div>
            
            
            

            {isSelectedContact
            ?<div className='w-full h-20 mt-auto bg-white flex justify-center items-center'>
                <input 
                  type="text" 
                  className='w-10/12 h-10 text-2xl bg-green-500 rounded p-1'
                  placeholder='Message...'
                  required
                  onChange={(e)=>{setMessage(e.target.value)}}
                  value={message}
                  />
                <button 
                   className='text-green-700 ml-3 '
                   onClick={handleSendMessage}>
                    <SendIcon sx={{fontSize: 30}}/>
                </button>
            </div>
            :null}
        </div>
        
    
    </div>
  )
}
