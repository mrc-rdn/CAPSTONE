import React from 'react'
import School from '@mui/icons-material/School';
import CalendarToday from '@mui/icons-material/CalendarToday';
import Group from '@mui/icons-material/Group';
import TrendingUp from '@mui/icons-material/TrendingUp';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import MenuBook from '@mui/icons-material/MenuBook';

export default function Features() {
  return (
    <div>
         {/* Features */}
      <section id="features" className="py-24 bg-green-600">
        <div className="max-w-[1200px] mx-auto px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white ">
              What We Offer On <span className='md:text-4xl font-extrabold text-4xl text-yellow-400 mb-4 text-primary'>E</span><span className='md:text-4xl font-extrabold text-4xl text-yellow-400 mb-4 text-primary'>-Kabuhayan</span>
            </h2> 
            
            <p className="text-white text-sm mt-5  md:text-xl">
              Our platform provides everything you need to develop skills, track progress, and achieve your goals.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Skill dev */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl shadow-white/30 hover:p-5 transition-all">
              <School className="text-yellow-400 text-4xl mb-4" />
              <h3 className="font-semibold text-xl mb-2 ">Skill Development</h3>
              <p className="text-gray-500 text-sm">
                Access quality training modules designed for practical skill acquisition in various industries.
              </p>
            </div>

            {/* Training calendar */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl shadow-white/30 hover:p-5 transition-all">
              <CalendarToday className="text-yellow-400 text-4xl mb-4" />
              <h3 className="font-semibold text-xl mb-2 ">Training Calendar</h3>
              <p className="text-gray-500 text-sm">
                Stay updated with upcoming workshops, sessions, and important events.
              </p>
            </div>

            {/* Community learning */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl shadow-white/30 hover:p-5 transition-all">
              <Group className="text-yellow-400 text-4xl mb-4" />
              <h3 className="font-semibold text-xl mb-2">Community Learning</h3>
              <p className="text-gray-500 text-sm">
                Connect with fellow trainees, share experiences, and learn collaboratively.
              </p>
            </div>

            {/* Progress tracking */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl shadow-white/30 hover:p-5 transition-all">
              <TrendingUp className="text-yellow-400 text-4xl mb-4" />
              <h3 className="font-semibold text-xl mb-2">Progress Tracking</h3>
              <p className="text-gray-500 text-sm">
                Monitor your learning journey with intuitive progress indicators for each module.
              </p>
            </div>

            {/* Success stories */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl shadow-white/30 hover:p-5 transition-all">
              <EmojiEvents className="text-yellow-400 text-4xl mb-4" />
              <h3 className="font-semibold text-xl mb-2">Success Stories</h3>
              <p className="text-gray-500 text-sm">
                Get inspired by real success stories from trainees who secured jobs or started businesses.
              </p>
            </div>

            {/* Learning resources */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl shadow-white/30 hover:p-5 transition-all">
              <MenuBook className="text-yellow-400 text-4xl mb-4" />
              <h3 className="font-semibold text-xl mb-2">Learning Resources</h3>
              <p className="text-gray-500 text-sm">
                Access a variety of learning materials including videos, PDFs, and interactive lessons.
              </p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}
