import React from 'react'

export default function FillBlankAnswers(props) {
    console.log(props.item)
    const answer = props.item.find(ans => ans.question_id === props.id);
    console.log(answer)
  return (
     <div className="mb-3 p-3  rounded-lg ">
      <div className='flex'>
        <p>{props.index}. {props.question_text}</p>
        <p>
          {answer.is_correct ? 
            <span className="text-green-600 font-bold m-2">Correct</span> :
            <span className="text-red-600 font-bold m-2"> Wrong</span>
          }
        </p>

      </div>
      <div className='p-2'>
        <div className='flex items-center ml-2'>
            <label htmlFor="">Your Answer: </label>
            <input 
                className='border-b-2 border-gray-400 focus:border-[#2D4F2B] outline-none px-2 py-1 w-10/12 mt-2'
                type="text"
                value={answer.user_answer || "(no answer)"} 
            />

        </div>
        <p className='m-3'><strong>Correct Answer:</strong> {answer.correct_answer}</p>

      </div>
      
      
    </div> 
   )
}
