import React, {useState} from 'react';

export default function QuizFillBlank(props) {
  const [answer, setAnswer] = useState("");
  const { type_question, question, no } = props;

  return (
    <div  className='w-full h-30  text-black p-2 mt-2 mb-2 rounded-md'>
      <div className='flex'>
        <h1>{no}.</h1>
        <p className='ml-1'>{question}</p>
      </div>
      
      <input 
        onChange={(e)=>{ 
          setAnswer(e.target.value);
          props.answers(e.target.value, props.questionId); 
        }}
        className='border-b-2 border-gray-400 focus:border-[#2D4F2B] outline-none px-2 py-1 w-full mt-8'
        type="text" 
        placeholder="Your answer..." 
        required
      />
    </div>
  );
}