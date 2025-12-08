import React,{useState, useEffect} from 'react'
import axios from 'axios'
import QuizFillBlank from './QuizFillBlank.jsx';
import QuizMultipleChoice from './QuizMultipleChoice.jsx';
import CheckedAnswers from './CheckedAnswers.jsx';
import { API_URL } from '../../../../api.js';

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
  //console.log(grouped)
  return Object.values(grouped);
}

export default function QuizList(props) {
  const [results, setResults] = useState([]);
  const [resultFetch, setResultFecth] = useState([])
  const [isAnswer, setAnswer] = useState(false)
  const [checkedAnswers, setCheckedAnswers] = useState(false)
  const [refresh, setRefresh] = useState(0);
  const groupedQuizzes = groupQuizzes(props.quizData)

  // STORE USER ANSWERS
  const [userAnswers, setUserAnswers] = useState({});

  const handleAnswer = (answer, index) => {
    setUserAnswers(prev => ({
      ...prev,
      [index]: answer
    }));
  };

  // FINAL SCORE
  const handleCheck = async () => {
    //console.log(props.chapterDetails, props.courseDetails)
    setCheckedAnswers(false)
    let score = 0;
    let tempResults = [];

    groupedQuizzes.forEach((quiz, index) => {
    const userAns = userAnswers[index + 1];
    let correctAns = "";

    if (quiz.type === "fill_blank") {
      correctAns = quiz.correct_answer;
      const isCorrect = userAns?.toLowerCase().trim() === quiz.correct_answer.toLowerCase();
      if (isCorrect) score++;

      tempResults.push({
        no: index + 1,
        question_id: quiz.question_id,
        question: quiz.question_text,
        userAnswer: userAns || "",
        correctAnswer: correctAns,
        isCorrect: isCorrect
      });
    }

    if (quiz.type === "multiple_choice") {
      const correct = quiz.choices.find(c => c.is_correct === true);
      correctAns = correct.text;
      const isCorrect = userAns === correct.text;
      if (isCorrect) score++;

      tempResults.push({
        no: index + 1,
        question_id: quiz.question_id,
        question: quiz.question_text,
        userAnswer: userAns || "",
        correctAnswer: correctAns,
        isCorrect: isCorrect
      });
    }
  });

    // Save results to state
    setResults(tempResults);

    // Percentage
    const total = groupedQuizzes.length;
    const percent = (score / total) * 100;

    console.log("FINAL SCORE:", score, "/", total);
    console.log("PERCENTAGE:", percent.toFixed(2) + "%");

    console.log("DETAILED RESULTS:", tempResults);

    
    console.log(props.quizData) 
    console.log(props.quizData[0].quiz_id) 
    console.log(props.quizData[0].chapter_id) 
    console.log(props.courseId) 
    console.log(tempResults) 
    
    try {
      const res = await axios.post(`${API_URL}/trainee/quiz/answer`, {
        quiz_id: props.quizData[0].quiz_id, 
        chapter_id: props.quizData[0].chapter_id, 
        course_id:  props.courseId, 
        score: score , 
        percentage: percent,
        tempResults
      }, {withCredentials: true})
      
      setRefresh(prev => prev + 1)
    } catch (error) {
      console.log('errorposting your asnwer', error)
    }

  };
    
    
  useEffect(() => {
    const isAnswered = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/trainee/quiz/quizprogress`,
          { chapter_id: props.quizData[0].chapter_id },
          { withCredentials: true }
        );

        console.log(res.data.data.length);

        //If no progress found → null
        if (res.data.data.length === 0) {
          setAnswer(false);
          setCheckedAnswers(true)   // user has NOT answered
        } else {
          setCheckedAnswers(false)
          setAnswer(true);
          setResultFecth(res.data.data)
          //console.log(res.data.data)    // user already answered this chapter
        }
      } catch (error) {
        console.log(error);
        setAnswer(false);
      }
    };

    isAnswered();
  }, [refresh]);


  return (
  <div className='w-full h-full flex flex-col items-center overflow-y-scroll p-5'>
    
    <h2 className="text-lg font-bold ">{isAnswer?'Quiz Result':'Available Quizzes'}</h2>
    
    {isAnswer?null
    :<div className='w-full flex flex-col '>
      <>
        {groupedQuizzes.map((quiz, index) => (
          <div key={index} className=''>
            {quiz.type === "fill_blank" && (
              <QuizFillBlank
                no={index + 1}
                type_question={quiz.type}
                question={quiz.question_text}
                answers={handleAnswer}
              />
            )}

            {quiz.type === "multiple_choice" && (
              <QuizMultipleChoice
                no={index + 1}
                type_question={quiz.type}
                question={quiz.question_text}
                choices={quiz.choices}
                answers={handleAnswer}
              />
            )}
          </div>
        ))}

        {/* SUBMIT BUTTON */}
        <button onClick={handleCheck}>Submit</button>
      </>
    </div>}
    
    {/* 🔥 ILAGAY MO DITO YUNG RESULTS UI 🔥 */}
  {checkedAnswers?null
  :<div  className='w-full flex flex-col'>
  {resultFetch.length > 0 && (
    <div className="w-full mt-5 p-3 bg-gray-100 rounded">
      <h2 className="font-bold text-lg mb-2">Results</h2>

      {resultFetch.map((item,index) => (
        <CheckedAnswers  key={index} item={item} />
      ))}
    </div>
  )}
  </div>}

  </div>
);

}