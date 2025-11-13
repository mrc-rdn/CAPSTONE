import React,{useState} from 'react'
import axios from 'axios'

export default function QuizList(props) {
 const [quizzes, setQuizzes] = useState();

  

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Available Quizzes</h2>
      {props.quizData.map((quiz) => (
        <div key={quiz.id} className="border p-3 mb-2 rounded">
          {quiz.title}
        </div>
      ))}
    </div>
  );
}
