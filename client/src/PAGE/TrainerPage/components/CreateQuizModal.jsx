import React, {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'
import { API_URL } from '../../../api.js';

export default function CreateQuiz(props) {
  const exit = false
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isMouseOver , setMouseOver] = useState(false)
  const [isMouseOverCloseModal, setMouseOverCloseModal] = useState(false);
  const [isQuizUploaded, setQuizUploaded] = useState(false);

  const addQuestion = (type) => {
    setQuestions([
      ...questions,
      { type, question_text: "", choices: [], correct_answer: "" },
    ]);
  };
  const deleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated)
  }

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addChoice = (index) => {
    const updated = [...questions];
    updated[index].choices.push({ choice_text: "", is_correct: false });
    setQuestions(updated);
  };

  const handleChoiceChange = (qIndex, cIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex].choices[cIndex][field] = value;
    setQuestions(updated);
  };

  const saveQuiz = async () => {
    try {
      await axios.post(`${API_URL}/trainer/chapter/createquiz`, {
      chapter_id: props.chapterId,
      title,
      questions,
    }, {withCredentials: true});
      setQuizUploaded(true)
    } catch (error) {
      consolelog(error)
      setQuizUploaded(false)
    }
    
  };
    return (
      <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center'>
        <div className='w-360 h-150 bg-white overflow-y-scroll p-3 rounded-md'>
          <button 
            onClick={()=>{props.onExit(exit)}} 
            onMouseOver={()=>setMouseOverCloseModal(true)} 
            onMouseOut={()=>setMouseOverCloseModal(false)}
            className={isMouseOverCloseModal?'text-red-500':''}>
            <CloseIcon  />
          </button>   
            {isQuizUploaded?<p>Quiz is Uploaded</p>
            :<div className="p-4 w-full">
              <h2 className="text-xl font-bold mb-4">Create a Quiz</h2>
              <input
                placeholder="Quiz Title"
                className="border-2 border-green-700 p-2 mb-4 w-full rounded-md"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="flex gap-2 mb-4">
                <button onClick={() => addQuestion("fill_blank")} className="bg-green-500 text-white px-3 py-1 rounded">
                  Add Fill in the Blank
                </button>
                <button onClick={() => addQuestion("multiple_choice")} className="bg-green-700 text-white px-3 py-1 rounded">
                  Add Multiple Choice
                </button>
              </div>

              {questions.map((question, index) => (
                <div key={index} className="border p-3 mb-4 rounded bg-green-700 text-white">
                  <div className='w-full h-10 flex'>
                    <h3 className="font-semibold mb-2">Question {index + 1} ({question.type})</h3>
                    <CloseIcon onClick={(e)=>{ deleteQuestion(index)}} className='ml-auto' />
                  </div>
                  
                  <input
                    placeholder="Question text"
                    value={question.question_text}
                    onChange={(e) => updateQuestion(index, "question_text", e.target.value)}
                    className="border p-2 w-full mb-2 rounded-md"
                  />
                 
                  {question.type === "fill_blank" ? (
                    <input
                      placeholder="Correct Answer"
                      value={question.correct_answer}
                      onChange={(e) => updateQuestion(index, "correct_answer", e.target.value)}
                      className="border p-2 w-full rounded-md"
                    />
                  ) : (
                    <div>
                      {question.choices.map((choice, j) => (
                        <div key={j} className="flex items-center mb-2 ">
                          <input
                            placeholder={`Choice ${j + 1}`}
                            value={choice.choice_text}
                            onChange={(e) => handleChoiceChange(index, j, "choice_text", e.target.value)}
                            className="border p-2 flex-1 rounded-md"
                          />
                          <input
                            type="checkbox"
                            checked={choice.is_correct}
                            onChange={(e) =>
                              handleChoiceChange(index, j, "is_correct", e.target.checked)
                            }
                            className="ml-2"
                          />
                          <span className="ml-1">Correct</span>
                        </div>
                      ))}
                      <button
                        onClick={() => addChoice(index)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Add Choice
                      </button>
                    </div>
                  )} 
                </div>
              ))}

              <button onClick={saveQuiz} onMouseOver={()=>setMouseOver(false)} onMouseOut={()=>setMouseOver(true)} 
              className={isMouseOver?"bg-white border-1 border-green-700 text-green px-4 py-2 rounded " : "bg-green-700 border-1 border-green-700 text-white px-4 py-2 rounded "}>
                Save Quiz
              </button>
            </div>}
        </div> 
      </div>
    )
}
