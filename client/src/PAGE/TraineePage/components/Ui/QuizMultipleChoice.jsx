import React from 'react';

export default function QuizMultipleChoice({ type_question, question, choices, no, answers }) {
  return (
    <div className='w-full h-50 bg-green-700 text-white p-2 mt-2 mb-2 p-3 rounded-md'>
        <h1>{type_question==="multiple_choice"&& "Multiple Choice"}</h1>
        <div className='flex'>
            <h1>{no}.</h1>
            <p className='ml-1'>{question}</p>
        </div>
      
      <ul>
        {choices.map(choice => (
          <li key={choice.id} className='m-2 ml-2'>
            <label>
              <input 
                className='mr-1' 
                type="radio" 
                name={`q-${no}`} 
                onChange={() => answers(choice.text, no)}
              />
              {choice.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}