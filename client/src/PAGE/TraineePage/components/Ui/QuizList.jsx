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

const handleAnswer = (answer, questionId) => {
  setUserAnswers(prev => ({
    ...prev,
    [questionId]: answer
  }));
};

  
  // FINAL SCORE
  const handleCheck = async () => {
    //console.log(props.chapterDetails, props.courseDetails)
    setCheckedAnswers(false)
    let score = 0;
    let tempResults = [];

    groupedQuizzes.forEach((quiz, index) => {
    const userAns = userAnswers[quiz.question_id];
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

    if (!correct) {
      console.error("No correct answer found for question:", quiz.question_id);
      tempResults.push({
        no: index + 1,
        question_id: quiz.question_id,
        question: quiz.question_text,
        userAnswer: userAns || "",
        correctAnswer: "No correct answer set",
        isCorrect: false
      });
      return; // continue sa next iteration
    }
    const correctAns = correct.text;
    const isCorrect = userAns === correctAns;
    if (isCorrect) score++;

    tempResults.push({
      no: index + 1,
      question_id: quiz.question_id,
      question: quiz.question_text,
      userAnswer: userAns || "",
      correctAnswer: correctAns,
      isCorrect
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

    
   
    
    try {
      const [quizanswer, progress] = await Promise.all([
        axios.post(`${API_URL}/trainee/quiz/answer`, 
        {quiz_id: props.quizData[0].quiz_id, chapter_id: props.quizData[0].chapter_id, course_id:  props.courseId, score: score ,percentage: percent, tempResults}, 
        {withCredentials: true}),
        axios.post(`${API_URL}/trainee/chapterprogress/${props.courseId}/${props.quizData[0].chapter_id}`,{}, {withCredentials:true})
      ]); 

      console.log(quizanswer.data)
      console.log(progress.data)
      setResultFecth(quizanswer.data.data)
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

        setResultFecth(res.data.data)
        setAnswer(res.data.success)
      } catch (error) {
        console.log(error);
        setAnswer(false);
      }
    };

    isAnswered();
  }, [refresh]);
console.log(groupedQuizzes)

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
                key={index}
                no={index + 1}
                questionId={quiz.question_id}
                type_question={quiz.type}
                question={quiz.question_text}
                answers={handleAnswer}
              />
            )}

            {quiz.type === "multiple_choice" && (
              <QuizMultipleChoice
                key={index}
                no={index + 1}
                questionId={quiz.question_id}
                type_question={quiz.type}
                question={quiz.question_text}
                choices={quiz.choices}
                answers={handleAnswer}
              />
            )}
          </div>
        ))}

        {/* SUBMIT BUTTON */}
        <button
        className='m-3 w-50 h-10 text-2xl text-white bg-[#2D4F2B] rounded mx-auto'
        onClick={handleCheck}>Submit</button>
      </>
    </div>}
    
    {/* 🔥 ILAGAY MO DITO YUNG RESULTS UI 🔥 */}
  {checkedAnswers?null
  :<div  className='w-full flex flex-col'>
  {resultFetch.length > 0 && (
    <div className="w-full mt-5 p-3 bg-gray-100 rounded">
      <h2 className="font-bold text-lg mb-2">Results</h2>

      
        <CheckedAnswers item={resultFetch} groupQuizzes={groupedQuizzes} />
      
    </div>
  )}
  </div>}

  </div>
);

}