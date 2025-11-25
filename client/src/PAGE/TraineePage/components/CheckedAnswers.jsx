import React from 'react'

export default function CheckedAnswers(props) {
  return (
    <>
    <div key={props.item.no} className="mb-3 p-3 border rounded bg-white">
      <p><strong>{props.item.no}. {props.item.question}</strong></p>
      <p>
        {props.item.is_correct ? 
          <span className="text-green-600 font-bold">✔ Correct</span> :
          <span className="text-red-600 font-bold">❌ Wrong</span>
        }
      </p>
      <p><strong>Your Answer:</strong> {props.item.user_answer || "(no answer)"}</p>
      <p><strong>Correct Answer:</strong> {props.item.correct_answer}</p>
    </div>
    </>
  )
}
