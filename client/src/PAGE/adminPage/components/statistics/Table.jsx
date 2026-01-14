import React , {useState} from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TableRow from './TableRow.';

export default function Table(props) {
  console.log(props.result)
  
  return (
     <div className='w-full h-70 overflow-y-scroll gird place-items-center'>
        
          <table className="w-11/12 h-1/12 bg-white/10  shadow-xl rounded-xl overflow-hidden border border-black/10 m-2 relative">
            <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white sticky top-0 shadow">
                <tr>
                <th className="py-3 px-4 text-center">#</th>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-center">Role</th>
                <th className="py-3 px-6 text-center">View</th>
                </tr>
            </thead>
            <tbody className="text-gray-700 divide-">
            {(props.list.map((info, index)=>{
                return(
                <TableRow 
                  key={index} 
                  index={index} 
                  id={info.id} 
                  first_name={info.first_name} 
                  surname={info.surname} 
                  role={info.role}
                  profile={info.profile_pic} 
                  color={info.color} 
                  shade={info.shades} 
                  result={props.result} 
                  info={info} />
                
                )
            }))}
           
            </tbody>
          </table >
          
        </div>
  )
}
