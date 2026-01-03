import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function Profile(props) {
    let data = props.data.usersInfo
    const navigate = useNavigate()
    const [picture, setPicture] = useState("")
    const handleEditProfile = ()=>{
        return navigate('/admin/editprofile')
    }
    
    useEffect(() => {
        if (!props.data) return
        setPicture(data?? "")
    }, [props.data])
    console.log(props.data)

return (
    <div className='ml-auto flex items-center'>
        <div>
            <button className='text-green-700'><NotificationsIcon /></button>   

        </div>
        <div 
            className='mr-4 flex items-center'
            onClick={handleEditProfile}>
                
            
            {picture.profile_pic
            ?<img src={picture.profile_pic} alt="" className='w-11 h-11 rounded-full ml-2 border-1' />
            :<div className='ml-2'>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${props.userColorClass}`}>
                    <p>
                    {props.data.usersInfo && props.data.usersInfo && props.data.usersInfo.first_name.slice(0,1)}
                    </p>
                </div>
            </div>}
            <p className='ml-2 text-xs'>
                {props.data.username && props.data.username}
            </p>
        </div>

    </div>
    
  )
}
