import React from 'react';

export default function QuizFillBlank({ type_question, question, no}) {
  return (
    <div className='w-full h-30 bg-green-700 text-white p-2 mt-2 mb-2 rounded-md'>
      <h1 className="">{type_question==="fill_blank"&& "Fill Blank"}</h1>
      <div className='flex'>
        <h1>{no}.</h1>
        <p className='ml-1'>{question}</p>
      </div>
      
      
      <input className='w-full h-10 border border-white p-1 rounded-md mt-2' type="text" placeholder="Your answer..." />
    </div>
  );
}
