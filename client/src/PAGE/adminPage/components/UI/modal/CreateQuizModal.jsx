import React, {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'
import { API_URL } from '../../../../../api.js';

export default function CreateQuiz(props) {
  const exit = false
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isMouseOver , setMouseOver] = useState(false)
  const [isMouseOverCloseModal, setMouseOverCloseModal] = useState(false)
  const [isQuizUploaded, setIsQuizUploaded] = useState(false);
console.log()
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

  const saveQuiz = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/admin/chapter/createquiz`, 
      {chapter_id: props.chapterInfo.chapterId,
      title,
      questions,
      }, {withCredentials: true});

    } catch (error) {
      console.error('error on uploading quiz ', error)
      setIsQuizUploaded(false)
    }
    finally{
      setIsQuizUploaded(true)
      props.onExit(exit)
    }
    
    
  };
  console.log(props.chapterInfo.chapterId)
    
    return (
  <div className="w-full h-full bg-white overflow-y-scroll p-6 rounded-xl absolute">

    {/* ===== HEADER ===== */}
    <div className="flex items-center justify-between border-b border-[#6F8A6A]/40 pb-3 mb-6">
      <h2 className="text-xl font-semibold text-[#2D4F2B]">
        Create Quiz
      </h2>
      <button
        onClick={() => props.onExit(exit)}
        className="w-9 h-9 flex items-center justify-center text-[#2D4F2B]"
      >
        <CloseIcon />
      </button>
    </div>

    {isQuizUploaded ? (
      <div className="flex items-center justify-center py-20">
        <p className="text-base font-medium text-[#2D4F2B]">
          ✔ Quiz successfully uploaded
        </p>
      </div>
    ) : (

      <form onSubmit={saveQuiz} className="space-y-6">

        {/* ===== QUIZ TITLE ===== */}
        <div>
          <label className="block text-sm text-[#2D4F2B] mb-1">
            Quiz Title
          </label>
          <input
            placeholder="Enter quiz title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full h-10 px-3
              rounded-lg
              border border-[#6F8A6A]
              focus:outline-none
              focus:ring-2
              focus:ring-[#FFB823]
            "
          />
        </div>

        {/* ===== ADD QUESTION BUTTONS ===== */}
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => addQuestion("fill_blank")}
            className="
              h-10 px-4
              rounded-xl
              font-semibold text-sm
              bg-[#2D4F2B]
              text-white
              hover:bg-[#708A58]
              transition
            "
          >
            Add Fill in the Blank
          </button>

          <button
            type="button"
            onClick={() => addQuestion("multiple_choice")}
            className="
              h-10 px-4
              rounded-xl
              font-semibold text-sm
              bg-[#2D4F2B]
              text-white
              hover:bg-[#708A58]
              transition
            "
          >
            Add Multiple Choice
          </button>
        </div>

        {/* ===== QUESTIONS ===== */}
        <div className="space-y-5">
          {questions.map((question, index) => (
            <div
              key={index}
              className="border border-[#6F8A6A]/40 rounded-xl p-4 bg-white"
            >

              {/* Question Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#2D4F2B]">
                  Question {index + 1} ({question.type})
                </h3>
                <button
                  type="button"
                  onClick={() => deleteQuestion(index)}
                  className="w-8 h-8 flex items-center justify-center text-[#2D4F2B]"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>

              {/* Question Text */}
              <input
                placeholder="Question text"
                value={question.question_text}
                required
                onChange={(e) =>
                  updateQuestion(index, "question_text", e.target.value)
                }
                className="
                  w-full h-10 px-3 mb-3
                  rounded-lg
                  border border-[#6F8A6A]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#FFB823]
                "
              />

              {/* Question Type */}
              {question.type === "fill_blank" ? (
                <input
                  placeholder="Correct answer"
                  value={question.correct_answer}
                  required
                  onChange={(e) =>
                    updateQuestion(index, "correct_answer", e.target.value)
                  }
                  className="
                    w-full h-10 px-3
                    rounded-lg
                    border border-[#6F8A6A]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#FFB823]
                  "
                />
              ) : (
                <div className="space-y-3">

                  {question.choices.map((choice, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <input
                        placeholder={`Choice ${j + 1}`}
                        value={choice.choice_text}
                        required
                        onChange={(e) =>
                          handleChoiceChange(index, j, "choice_text", e.target.value)
                        }
                        className="
                          flex-1 h-10 px-3
                          rounded-lg
                          border border-[#6F8A6A]
                          focus:outline-none
                          focus:ring-2
                          focus:ring-[#FFB823]
                        "
                      />
                      <label className="flex items-center gap-1 text-sm text-[#2D4F2B]">
                        <input
                          type="checkbox"
                          checked={choice.is_correct}
                          onChange={(e) =>
                            handleChoiceChange(index, j, "is_correct", e.target.checked)
                          }
                        />
                        Correct
                      </label>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addChoice(index)}
                    className="
                      h-9 px-4
                      rounded-xl
                      font-semibold text-sm
                      bg-[#2D4F2B]
                      text-white
                      hover:bg-[#708A58]
                      transition
                    "
                  >
                    Add Choice
                  </button>

                </div>
              )}
            </div>
          ))}
        </div>

        {/* ===== SAVE BUTTON ===== */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="
              w-40 h-11
              rounded-xl
              font-semibold
              bg-[#2D4F2B]
              text-white
              hover:bg-[#708A58]
              focus:outline-none
              focus:ring-2
              focus:ring-[#FFB823]
              transition
            "
          >
            Save Quiz
          </button>
        </div>

      </form>
    )}

  </div>
);
}
