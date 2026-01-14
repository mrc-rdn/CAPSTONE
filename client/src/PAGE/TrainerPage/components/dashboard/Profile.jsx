import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function Profile(props) {
    let data = props.data.usersInfo
    const navigate = useNavigate()
    const [picture, setPicture] = useState("")
    const handleEditProfile = () => {
        return navigate('/trainer/editprofile')
    }

    useEffect(() => {
        if (!props.data) return
        setPicture(data ?? "")
    }, [props.data])
    console.log(props.data)

    return (
        <div className="ml-auto flex items-center">
            <div
                className="
                    mr-1
                    flex items-center gap-2
                    px-3 py-1.5
                    rounded-xl
                    
                    backdrop-blur-md
                    border border-white/5
                    cursor-pointer
                    hover:bg-white/50
                    transition
                    "
                onClick={handleEditProfile}
            >
                {picture.profile_pic ? (
                    <img
                        src={picture.profile_pic}
                        alt=""
                        className="w-11 h-11 rounded-full border border-white/10 object-cover"
                    />
                ) : (
                    <div
                        className={`
          w-11 h-11
          rounded-xl
          flex items-center justify-center
          text-white font-semibold
          ${props.userColorClass}
        `}
                    >
                        {props.data.usersInfo &&
                            props.data.usersInfo.first_name.slice(0, 1)}
                    </div>
                )}

                <p className="text-sm text-white font-medium">
                    {props.data.username && props.data.username}
                </p>
            </div>
        </div>


    )
}