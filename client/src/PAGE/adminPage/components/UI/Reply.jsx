import React from 'react'

export default function Reply({first_name,surname, profile, shade, color, content}) {
  const colorMap = {
    red: {200: 'bg-red-200',300: 'bg-red-300',400: 'bg-red-400',500: 'bg-red-500',600: 'bg-red-600',700: 'bg-red-700', 800: 'bg-red-800'},
    yellow: {200: 'bg-yellow-200',300: 'bg-yellow-300',400: 'bg-yellow-400',500: 'bg-yellow-500',600: 'bg-yellow-600',700: 'bg-yellow-700',800: 'bg-yellow-800'},
    green: {200: 'bg-green-200',300: 'bg-green-300',400: 'bg-green-400',500: 'bg-green-500',600: 'bg-green-600',700: 'bg-green-700',800: 'bg-green-800'},
    orange: {200: 'bg-orange-200',300: 'bg-orange-300',400: 'bg-orange-400',500: 'bg-orange-500',600: 'bg-orange-600',700: 'bg-orange-700',800: 'bg-orange-800'},
    blue: {200: 'bg-blue-200',300: 'bg-blue-300',400: 'bg-blue-400',500: 'bg-blue-500',600: 'bg-blue-600',700: 'bg-blue-700',800: 'bg-blue-800'},
    purple: {200: 'bg-purple-200',300: 'bg-purple-300',400: 'bg-purple-400',500: 'bg-purple-500',600: 'bg-purple-600',700: 'bg-purple-700',800: 'bg-purple-800'},
    pink: {200: 'bg-pink-200',300: 'bg-pink-300',400: 'bg-pink-400',500: 'bg-pink-500',600: 'bg-pink-600',700: 'bg-pink-700',800: 'bg-pink-800'},
  }

 const userColorClass = colorMap[color]?.[shade] || 'bg-gray-500';
  return (
    <div className='mt-5'>
      <div className='flex'>
        {profile
            ?<img src={profile} alt="" className='w-8 h-8 rounded-full ml-2 border-1' />
            :<div className='ml-2'>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${userColorClass}`}>
                    <p>
                    { first_name.slice(0,1).toUpperCase()}
                    </p>
                </div>
            </div>}
        <h1 className="ml-3">
            {first_name} {surname}
        </h1>
      </div>
    <p className="ml-16 break-words w-11/12 mb-3">{content}</p>
  </div>
  )
}
