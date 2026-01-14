import React,{useState} from 'react'
import SelectedProfile from './SelectedProfile';

export default function Profile(props) {
    const [isModalOpen , setIsModalOpen] = useState(false)
    
    const colorMap = {
          red: {200: 'bg-red-200',300: 'bg-red-300',400: 'bg-red-400',500: 'bg-red-500',600: 'bg-red-600',700: 'bg-red-700', 800: 'bg-red-800'},
          yellow: {200: 'bg-yellow-200',300: 'bg-yellow-300',400: 'bg-yellow-400',500: 'bg-yellow-500',600: 'bg-yellow-600',700: 'bg-yellow-700',800: 'bg-yellow-800'},
          green: {200: 'bg-green-200',300: 'bg-green-300',400: 'bg-green-400',500: 'bg-green-500',600: 'bg-green-600',700: 'bg-green-700',800: 'bg-green-800'},
          orange: {200: 'bg-orange-200',300: 'bg-orange-300',400: 'bg-orange-400',500: 'bg-orange-500',600: 'bg-orange-600',700: 'bg-orange-700',800: 'bg-orange-800'},
          blue: {200: 'bg-blue-200',300: 'bg-blue-300',400: 'bg-blue-400',500: 'bg-blue-500',600: 'bg-blue-600',700: 'bg-blue-700',800: 'bg-blue-800'},
          purple: {200: 'bg-purple-200',300: 'bg-purple-300',400: 'bg-purple-400',500: 'bg-purple-500',600: 'bg-purple-600',700: 'bg-purple-700',800: 'bg-purple-800'},
          pink: {200: 'bg-pink-200',300: 'bg-pink-300',400: 'bg-pink-400',500: 'bg-pink-500',600: 'bg-pink-600',700: 'bg-pink-700',800: 'bg-pink-800'},
      }
  
    const userColorClass = colorMap[props.color]?.[props.shade] || 'bg-gray-500';
    const handleExitModal = (exit)=>{
        props.refresh()
        setIsModalOpen(exit)
    }
  return (
  <div>
    <li
      className="w-full h-16 flex items-center gap-3 px-3 cursor-pointer rounded-lg hover:bg-gray-100 transition"
      onClick={() => {
        setIsModalOpen(true);
      }}
    >
      {props.profile ? (
        <img
          src={props.profile}
          alt=""
          className="w-11 h-11 rounded-full border border-gray-300 object-cover"
        />
      ) : (
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${userColorClass}`}
          >
            {props.firstName.slice(0, 1).toUpperCase()}
          </div>
        </div>
      )}

      <div className="w-full flex flex-col">
        <p className="text-sm font-medium text-gray-800">
          {props.username}
        </p>
      </div>
    </li>

    {isModalOpen ? (
      <SelectedProfile
        onExit={handleExitModal}
        id={props.id}
        username={props.username}
        firstName={props.firstName}
        surname={props.surname}
        profile={props.profile}
        userColorClass={userColorClass}
      />
    ) : null}
  </div>
);
}