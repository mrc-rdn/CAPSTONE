import React, { useState } from 'react';

export default function QuizMultipleChoice({ no, type_question, question, choices, answers, questionId, answer }) {
  // store the index of the selected choice
  const [selectedIndex, setSelectedIndex] = useState(null);
console.log(answer)
  return (
    <div className='w-full h-60 text-black mt-2 p-3 rounded-md'>
      <div className='flex mb-3'>
        <h1>{no}.</h1>
        <p className='ml-1'>{question}</p>
      </div>

      <ul>
        {choices.map((choice, index) => (
          <li 
            key={index} 
            className={`px-4 py-2 rounded-xl text-white transition-colors cursor-pointer mb-3 shadow
              ${selectedIndex === index ? "bg-[#2D4F2B]" : "bg-[#708A58] hover:bg-[#2D4F2B]"}`}
            onClick={() => {
              setSelectedIndex(index); // mark this choice as selected
              answers(choice.text, questionId); // call the answer callback
            }}
          >
            <label className='flex items-center cursor-pointer'>
              <input 
                className='mr-2 accent-[#FFB823]' 
                type="radio" 
                name={`q-${no}`} 
                checked={selectedIndex === index}
                onChange={() => {
                  setSelectedIndex(index);
                  answers(choice.text, questionId);
                }}
              />
              {choice.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
