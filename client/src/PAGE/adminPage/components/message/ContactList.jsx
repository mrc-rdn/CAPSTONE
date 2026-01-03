import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import { API_URL } from '../../../../api'
import Contact from './Contact.jsx'
import Messages from './Messages.jsx'
import SendIcon from '@mui/icons-material/Send';

export default function ContactList({userData, socket, handlerefresh}) {
    
    const [contacts, setContacts] = useState([])
    const [contactId, setContactId] = useState()
    const [messages, setMessages] = useState([])
    const [isSelectedContact, setIsSelectedContact] = useState(false)
    const [activeContactId ,setActiveContactId] = useState()
    const [message, setMessage] = useState("")

    const [refresh, setRefresh]= useState(0);
    const bottomRef = useRef(null);
    
    function handleRefresh(index){
        setRefresh(prev => prev + 1)
        
    }
     const handleSendMessage = async(e)=>{
        e.preventDefault()
        socket.emit("join-chat", contactId);
        try {
            const fetchData = await axios.post(`${API_URL}/admin/sendMessage`,{chat_id:contactId ,message:message}, {withCredentials:true})
            setMessage("")
            fetchContacts()
            
        } catch (error) {
            console.log('error sending your message', error)
        }
    }
      

    useEffect(()=>{ 
        const fetchContacts = async() =>{
            try {
                const fetchData = await axios.get(`${API_URL}/admin/chats`, {withCredentials:true})
                
                setContacts(fetchData.data)
                
            } catch (error) {
                console.log('error', error)
            }
            
        } 
        fetchContacts()
    },[handlerefresh])

    const handleSelectContact = async(contactId)=>{
        setContactId(contactId)
        socket.emit("join-chat", contactId);
         try {
            const fetchData = await axios.get(`${API_URL}/admin/${contactId}`, {withCredentials:true})
            setIsSelectedContact(true)
            setMessages(fetchData.data.data)
        } catch (error) {
            console.log('error', error)
        }
            
    }

    useEffect(() => {
        socket.on("receive_message", (msg) => {
            if (msg.chat_id === contactId) {
                console.log(msg)
            setMessages(prev => [...prev, msg]);
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
    console.log(userData )
  return (
    <div className='h-11/12 flex'>
        <div className='w-2/12 h-full bg-white'>
            <ul>
                {contacts.map((contact, index) =>{
                    return<li key={index}>{contact.user1_id !== userData.id 
                        ?  <Contact 
                           contactData={contact} 
                           firstName={contact.user1_firstname} 
                           surname={contact.user1_surname} 
                           handleSelectContact={handleSelectContact}
                           handleActiveChapter={()=>setActiveContactId(contact.id)}
                           isActive={activeContactId === contact.id } />
                        :  <Contact 
                            contactData={contact} 
                            firstName={contact.user2_firstname} 
                            surname={contact.user2_surname} 
                            handleSelectContact={handleSelectContact}
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
                        userData={userData[0]}
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
                  className='w-6/12 h-10 text-2xl bg-green-500 rounded p-1'
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
