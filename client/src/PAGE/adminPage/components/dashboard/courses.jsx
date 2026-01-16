import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../../../api'

export default function courses({ course }) {
  const [enrolled, setenrolled] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${API_URL}/admin/${course.id}/enrolled`,
        { withCredentials: true }
      )
      setenrolled(res.data.data)
    }
    fetchData()
  }, [])

  console.log(enrolled)

  return (
    <div
      className="
    w-55
    max-w-full
    h-32
    m-2
    p-4
    rounded-xl
    bg-white/70
    border border-emerald-900/5
    shadow-sm
    flex flex-col
    justify-between
    transition
    hover:shadow-md
  "
    >
      <p
        className="
      text-base
      font-bold
      text-[#2D4F2B]
      leading-tight
      truncate
    "
      >
        {course.title}
      </p>

      <p
        className="
      text-sm
      text-[#6F8A6A]
      leading-snug
      line-clamp-2
    "
      >
        {course.description}
      </p>

      <div className="pt-2">
        <span
          className="
        inline-flex
        items-center
        justify-center
        px-3
        py-1
        text-xs
        font-medium
        text-[#2D4F2B]
        bg-[#708A58]/50
        rounded-full
      "
        >
          {enrolled.length} Students
        </span>
      </div>
    </div>

  )
}