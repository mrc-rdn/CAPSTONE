import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../../../../api.js";

export default function ExcelGenerator(props) {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const result = await axios.post(
          `${API_URL}/admin/${props.course_id}/excelrender`,{},
          { withCredentials: true }
        );
console.log(result.data)
        setProgress(result.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchdata();
  }, []);

  // 🔥 DERIVED DATA
  const trainees = Array.from(
    new Map(
      progress.map(p => [
        p.user_id,
        {
          user_id: p.user_id,
          first_name: p.first_name,
          surname: p.surname
        }
      ])
    ).values()
  );

  const chapters = Array.from(
    new Map(
      progress.map(p => [
        p.chapter_id,
        {
          chapter_id: p.chapter_id,
          title: p.title
        }
      ])
    ).values()
  );

  const generateExcel = () => {
    if (!progress.length) {
      return alert("No data to export");
    }

    const data = [];

    data.push([
      "Student Name",
      ...chapters.map(ch => ch.title)
    ]);

    trainees.forEach(student => {
      const row = [`${student.first_name} ${student.surname}`];

      chapters.forEach(chapter => {
        const done = progress.some(
          p =>
            p.user_id === student.user_id &&
            p.chapter_id === chapter.chapter_id &&
            p.is_done === true
        );

        row.push(done ? "✓" : "");
      });

      data.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Completion");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "completion_tracker.xlsx"
    );
  };

  return (
    <div>
      <button
        onClick={generateExcel}
        className="m-3 w-60 h-10 text-white bg-green-500 rounded"
      >
        Generate Completion Excel
      </button>
    </div>
  );
}
