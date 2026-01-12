import React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function Table(props) {
  return (
     <div className='w-full h-100 overflow-y-scroll gird place-items-center'>
        
          <table className="w-11/12 h-1/12 bg-white shadow-md rounded-lg overflow-hidden border-1 m-2 relative ">
            <thead className="bg-green-600 text-white sticky">
                <tr>
                <th>no</th>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-center">Role </th>
                <th className="py-3 px-6 text-center">View </th>
                
              
                </tr>
            </thead>
            <tbody className="text-gray-700">
            {(props.list.map((info, index)=>{
                return(
                <tr className="border-b hover:bg-gray-100 transition duration-300 " key={index}>
                     <th>{index}</th>
                    <td className="py-4 px-6 border-x-1">{info.id}</td>
                    <td className="py-4 px-6 border-x-1">{info.surname.charAt(0).toUpperCase() + info.surname.slice(1)} {info.first_name.charAt(0).toUpperCase()+ info.first_name.slice(1)} </td>
                    <td className="py-4 px-6 border-x-1">{info.role}</td>
                    <td className="py-4 px-6 border-x-1 ">< KeyboardArrowDownIcon /></td>
                    
                    
                </tr>)
                }))}
            </tbody>
          </table >
        </div>
  )
}
