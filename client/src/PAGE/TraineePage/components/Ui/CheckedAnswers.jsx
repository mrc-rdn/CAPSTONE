import React from 'react'
import QuizFillBlank from './QuizFillBlank.jsx';
import QuizMultipleChoice from './QuizMultipleChoice.jsx';
import MultipleChoiceAnswers from './checkanswers/MultipleChoiceAnswers.jsx';
import FillBlankAnswers from './checkanswers/FillBlankAnswers.jsx';

export default function CheckedAnswers(props) {

  return (
    <>
    {props.groupQuizzes.map((quiz, index) => (
      <div key={index} className=''>
        {quiz.type === "fill_blank" && (
          <FillBlankAnswers key={index} id={quiz.question_id} question_text={quiz.question_text} index={index+1} item={props.item}/>
        )}

        {quiz.type === "multiple_choice" && (
          <MultipleChoiceAnswers id={quiz.question_id} question_text={quiz.question_text} choices={quiz.choices} index={index+1} item={props.item}/>
        )}
      </div>
    ))}

    
    </>
  )
}