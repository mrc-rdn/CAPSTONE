import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../../../../api.js";

export default function ExcelGenerator(props) {
  const [chapters, setChapters] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [quizProgress, setQuizProgress] = useState([]);
  const [videoProgress, setVideoProgress] = useState([]);
  const [imageProgress, setImageProgress] = useState([]);
  useEffect(()=>{
    const fetchdata =async()=>{try {
      const result = await axios.post(`${API_URL}/trainer/${props.course_id}/excelrender`,
        {},
        {withCredentials:true}); // replace with your endpoint
        console.log(result)
      setChapters(result.data.chapter || []);
      setTrainees(result.data.trainee || []);
      setQuizProgress(result.data.quiz_progress || []);
      setVideoProgress(result.data.video_progress || []);
      setImageProgress(result.data.image_progress || []);
    } catch (error) {
      console.error(error);
    }}
fetchdata()
  },[])

  const generateExcel = async() => {
      
    if (!trainees.length || !chapters.length) return alert("No data to export");

    const data = [];

    // Header row: "Student Name" + chapter titles
    data.push(["Student Name", ...chapters.map(ch => ch.title)]);

    // Rows per student
    trainees.forEach(student => {
      const row = [student.first_name + " " + student.surname];

      chapters.forEach(chapter => {
        // Safe checks for completion (nulls are ignored)
        const completedQuiz = quizProgress.some(
          q =>
            q?.student_id === student.student_id &&
            q?.chapter_id === chapter.id
        );

        const completedVideo = videoProgress.some(
          v =>
            v?.student_id === student.student_id &&
            v?.chapter_id === chapter.id &&
            v?.is_completed === true
        );

        const completedImage = imageProgress.some(
          i =>
            i?.student_id === student.student_id &&
            i?.chapter_id === chapter.id &&
            i?.is_completed === true
        );

        // Only mark "✓" if completed in any progress type
        row.push(completedQuiz || completedVideo || completedImage ? "✓" : "");
      });

      data.push(row);
    });

    // Create worksheet & workbook
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Completion");

    // Export Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "completion_tracker.xlsx"
    );
  };

  return (
    <div>
      <button onClick={generateExcel} className="m-3 w-60 h-10  text-white bg-green-500 rounded">Generate Completion Excel</button>
    </div>
  );
}
