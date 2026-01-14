import React from 'react';

export default function QuizFillBlank({ type_question, question, no}) {
  return (
    <div className="w-full bg-gray-50 border border-gray-300 p-5 mt-3 mb-3 rounded-lg shadow-sm">

    {/* Question Type */}
    <p className="text-base font-bold text-gray-500">
      {type_question === "fill_blank" && "Fill in the Blank"}
    </p>

    {/* Question */}
    <div className="flex items-start gap-2 mb-4">
      <span className="font-semibold text-gray-700">
        {no}.
      </span>
      <p className="text-black leading-relaxed">
        {question}
      </p>
    </div>

    {/* Answer Input */}
    <input
      className="
        w-full h-11 px-3
        border border-gray-300 rounded-md
        text-gray-800 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-green-600
        focus:border-green-600
      "
      type="text"
      placeholder="Your answer"
    />

  </div>
  );
}
