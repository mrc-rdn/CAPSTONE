import React , {useState} from 'react'
import PersonIcon from '@mui/icons-material/Person';

export default function Contact(props) {
  const [isSelectedContact, setIsSelectedContact] = useState(false)
  
  const handleSelect = ()=>{
    props.handleSelectContact(props.contactData.id)
    props.handleActiveChapter(props.contactData.id)
  }

  return (
    <div className={
      props.isActive
      ?'w-full h-15 flex bg-green-500 justify-center items-center overflow-y-scroll'
      :'w-full h-15 flex justify-center items-center '} 
      onClick={ handleSelect}
    >
        <div><PersonIcon sx={{fontSize: 50}}/></div>
        <div className='w-full flex m-1'>
            <p className='ml-1 mr-1'>{props.firstName} </p> <p> {props.surname}</p>
        </div>
    </div>
  )
}
