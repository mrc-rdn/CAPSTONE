import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function TextPresenter({data}) {
    
  return (
    <div className='w-full h-full flex justify-center items-center flex-col'>
        <h2 className="text-2xl font-bold mb-4 ">Posts</h2>

        <div className="w-full flex justify-center">
            <Swiper
            spaceBetween={20}
            slidesPerView={1}
            className="w-full max-w-5xl h-[70vh] mx-auto"
            >
            {data.map(post => (
                <SwiperSlide key={post.id} className="flex justify-center">
                <div className="w-full h-full border p-4 bg-white shadow hover:shadow-lg transition ">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <div 
                    className="
                        h-full overflow-y-auto p-4 text-gray-900

                        [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-1
                        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-1
                        [&_h3]:text-xl  [&_h3]:font-semibold [&_h3]:mb-1
                        [&_p]:mb-1
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-1
                        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-1
                        [&_li]:mb-1
                    "
                    
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
    </div>

  )
}
