import React from 'react';
import CheckIcon from '@mui/icons-material/Check';

export default function QuizMultipleChoice({ type_question, question, choices,  no }) {
  
  return (
  <div className="w-full bg-gray-50 border border-gray-300 p-5 mt-3 mb-3 rounded-lg shadow-sm">

    {/* Question Type */}
    <p className="text-base font-bold text-gray-500">
      {type_question === "multiple_choice" && "Multiple Choice"}
    </p>

    {/* Question */}
    <div className="flex items-start gap-2 mb-4">
      <span className="font-semibold text-gray-700">
        {no}.
      </span>
      <p className="text-gray-800 leading-relaxed">
        {question}
      </p>
    </div>

    {/* Choices */}
    <ul className="space-y-3">
      {choices.map((choice, index) => (
        <li
          key={index}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition"
        >
          <input
            type="radio"
            name={`q-${question}`}
            className="accent-green-600"
          />

          <span className="text-gray-800 flex-1">
            {choice.text}
          </span>

          {choice.is_correct && (
            <span className="text-green-600">
              <CheckIcon />
            </span>
          )}
        </li>
      ))}
    </ul>

  </div>
);
}
