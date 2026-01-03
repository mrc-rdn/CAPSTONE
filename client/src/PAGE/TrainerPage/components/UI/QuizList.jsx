import React,{useState} from 'react'
import axios from 'axios'
import QuizFillBlank from './QuizFillBlank';
import QuizMultipleChoice from './QuizMultipleChoice';

function groupQuizzes(quizData) {

  const grouped = {};
  quizData.map(item => {
    if (!grouped[item.question_id]) {
      grouped[item.question_id] = { ...item, choices: [] };
    }
    if (item.type === "multiple_choice") {
      grouped[item.question_id].choices.push({
        id: item.id,
        text: item.choice_text,
        is_correct: item.is_correct
      });
    }
  });
  return Object.values(grouped);
}


export default function QuizList(props) {

  const groupedQuizzes = groupQuizzes(props.quizData)
  

  return (
    <div className='w-full h-full flex flex-col items-center overflow-y-scroll p-5'>
      <h2 className="text-lg font-bold ">Available Quizzes</h2>

      {groupedQuizzes.map((quiz , index ) => (
        <>
          {quiz.type === "fill_blank" && (
            <QuizFillBlank
              key={index}
              no={index +1}
              type_question={quiz.type}
              question={quiz.question_text}
            />
          )}

          {quiz.type === "multiple_choice" && (
            <QuizMultipleChoice
              key={index}
              no={index +1}
              type_question={quiz.type}
              question={quiz.question_text}
              choices={quiz.choices}
            />
          )}
        </>
      ))}
  </div>

  );
}
