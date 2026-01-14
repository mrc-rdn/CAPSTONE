import React from 'react'

export default function MultipleChoiceAnswers({id, question_text, choices, index, item}) {

  const answer = item.find(ans => ans.question_id === id);

  return (
    <div className="w-full h-60 text-black mt-2 p-3 mb-2 rounded-md">
      <div className="flex mb-3">
        <h1>{index}.</h1>
        <p className="ml-1">{question_text}</p>
      </div>

      <ul>
        {choices.map((choice, index) => {
          const isCorrect = answer?.correct_answer === choice.text;
          const isUserWrong =
            answer?.user_answer === choice.text &&
            answer?.user_answer !== answer?.correct_answer;

          return (
            <li
              key={index}
              className={`
                px-4 py-2 rounded-xl text-white transition-colors cursor-pointer mb-3 shadow
                ${isCorrect ? "bg-green-600" : ""}
                ${isUserWrong ? "bg-red-600" : ""}
                ${!isCorrect && !isUserWrong ? "bg-[#708A58]" : ""}
              `}
            >
              {choice.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
