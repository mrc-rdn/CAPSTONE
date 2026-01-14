import React,{useState, useEffect} from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SelectedProfile from './SelectedProfile';
import axios from 'axios';
import { API_URL } from '../../../../api';
import LinearProgress from '@mui/material/LinearProgress';

export default function TableRow(props) {
    const [isOpen, setIsOpen] = useState(false)

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
    const result = props.result.filter((info)=> info.user_id === props.id)
    console.log()
 
  return (<>
            <tr 
                  
                  className="hover:bg-green-50 transition duration-200"
                >
                    <th className="py-3 px-4 text-center text-gray-500">{props.index + 1}</th>

                    <td className="py-4 px-6">{props.id}</td>

                    <td className="py-4 px-6 font-medium">
                      {props.surname.charAt(0).toUpperCase() + props.surname.slice(1)}{" "}
                      {props.first_name.charAt(0).toUpperCase() + props.first_name.slice(1)}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {props.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center text-green-700 hover:text-green-900 cursor-pointer"
                    onClick={()=>setIsOpen(!isOpen)}>
                      <KeyboardArrowDownIcon />
                    </td>
                    
                </tr>
                {isOpen && 
                  <tr>
                      <td colSpan='5' className='p-3 '>
                        <div className='flex ml-50'>
                     
                          <div className="flex items-center gap-5 h-40 ">
                            {props.profile ? (
                              <img
                                src={props.profile}
                                alt=""
                                className="w-28 h-28 rounded-full object-cover border border-gray-300"
                              />
                            ) : (
                              <div
                                className={`w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold ${userColorClass}`}
                              >
                                {props.first_name.slice(0, 1).toUpperCase()}
                              </div>
                            )}

                            <div className="flex flex-col">
                              <p className="text-xl font-semibold text-gray-900">
                                {props.first_name} {props.surname}
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                username: {props.username}
                              </p>

                              <p className="text-xs text-gray-400">
                                ID: {props.id}
                              </p>
                            </div>
                          </div>
                          {result[0] && <div className='bg-white w-90 h-40 m-3 ml-5 rounded-xl p-4 border-1'>
                            <p className='text-2xl font-bold '>{result[0]?.courseTitle}</p>
                            <p className='mt-3'>Progress</p>
                            <div className='flex items-center'>
                            
                            <div className='w-10/12'>
                              <LinearProgress
                                variant="determinate"
                                value={result[0]?.percentage}
                                sx={{
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: "#e0e0e0",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#6F8A6A",
                                  },
                                }}
                              />
                            </div>
                            <p className='ml-3'>{result[0]?.percentage}%</p>
                            </div>
                            <p>Status: {result[0]?.percentage === 100 ? (
                              <span className="text-[#2D4F2B] font-medium">
                                Completed
                                </span>
                              ) : (
                                <span className="text-[#6F8A6A]">
                                  On Going
                                </span>
                              )}
                            </p>
                          </div>}
                        </div>
                      </td>
                  </tr>
                
                    
                 }
    </>
  )
}
