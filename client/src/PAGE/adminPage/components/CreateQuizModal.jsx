import React, {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'

export default function CreateQuiz(props) {
  const exit = false
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = (type) => {
    setQuestions([
      ...questions,
      { type, question_text: "", choices: [], correct_answer: "" },
    ]);
  };

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
    await axios.post("http://localhost:3000/admin/chapter/createquiz", {
      chapter_id: props.chapterId,
      title,
      questions,
    }, {withCredentials: true});
    alert("Quiz saved!");
  };
    return (
      <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center'>
        <div className='w-350 h-150 bg-white'>
          <button onClick={()=>{props.onExit(exit)}}><CloseIcon /></button>   
          <h1>Trainee</h1>
            <div className="p-4 over">
              <h2 className="text-xl font-bold mb-4">Create a Quiz</h2>
              <input
                placeholder="Quiz Title"
                className="border p-2 mb-4 w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="flex gap-2 mb-4">
                <button onClick={() => addQuestion("fill_blank")} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Add Fill in the Blank
                </button>
                <button onClick={() => addQuestion("multiple_choice")} className="bg-green-500 text-white px-3 py-1 rounded">
                  Add Multiple Choice
                </button>
              </div>

              {questions.map((q, i) => (
                <div key={i} className="border p-3 mb-4 rounded">
                  <h3 className="font-semibold mb-2">Question {i + 1} ({q.type})</h3>
                  <input
                    placeholder="Question text"
                    value={q.question_text}
                    onChange={(e) => updateQuestion(i, "question_text", e.target.value)}
                    className="border p-2 w-full mb-2"
                  />

                  {q.type === "fill_blank" ? (
                    <input
                      placeholder="Correct Answer"
                      value={q.correct_answer}
                      onChange={(e) => updateQuestion(i, "correct_answer", e.target.value)}
                      className="border p-2 w-full"
                    />
                  ) : (
                    <div>
                      {q.choices.map((c, j) => (
                        <div key={j} className="flex items-center mb-2">
                          <input
                            placeholder={`Choice ${j + 1}`}
                            value={c.choice_text}
                            onChange={(e) => handleChoiceChange(i, j, "choice_text", e.target.value)}
                            className="border p-2 flex-1"
                          />
                          <input
                            type="checkbox"
                            checked={c.is_correct}
                            onChange={(e) =>
                              handleChoiceChange(i, j, "is_correct", e.target.checked)
                            }
                            className="ml-2"
                          />
                          <span className="ml-1">Correct</span>
                        </div>
                      ))}
                      <button
                        onClick={() => addChoice(i)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Add Choice
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button onClick={saveQuiz} className="bg-blue-700 text-white px-4 py-2 rounded">
                Save Quiz
              </button>
            </div>
        </div> 
      </div>
    )
}
