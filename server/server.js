import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import bcrypt from "bcrypt"

import env from 'dotenv'
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local"

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary"

import db from './db/connection.js'

const app = express();
const port = 3000;
const saltRounds = parseInt(process.env.SALTED_ROUNDS);

env.config();

db.connect();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "elearning_videos", // folder name sa Cloudinary
    resource_type: "video", // importante ito para sa mp4/mov files
    allowed_formats: ["mp4", "mov", "avi", "mkv"],
    public_id: (req, file) => `video_${Date.now()}_${file.originalname}`,
  },
});

const uploadVideo = multer({ storage: videoStorage });

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "elearning_images", // folder para sa images
    resource_type: "image", // importante para sa jpg/png/gif
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    public_id: (req, file) => `image_${Date.now()}_${file.originalname}`,
  },
});

const uploadImage = multer({ storage: imageStorage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // your React app's URL https://e-kabuhayanlmsfe.onrender.com
    credentials: true,               // allow cookies to be sent
  })
);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true if using https
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(passport.initialize());
app.use(passport.session());

function generateNumericId() {
  return Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);
}


//resgiter account of trainer and trainee
app.post("/admin/registeraccount", async (req, res) => {
  const { firstName, surname, contactNo, username, password, role } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [username])

    if (checkResult.rows.length > 0) {
      res.json({ success: false, error: "Username already exists. Try logging in." })
    } else {
      if (password.length < 8) {

        res.json({ error: "your password is too short" })
      } else {

        bcrypt.hash(password, saltRounds, async (err, hash) => {

          if (err) {
            res.json("Error hasing password:", err)
          } else {
            const usersRes = await db.query("INSERT INTO users (id, username, password, role) VALUES ($1, $2, $3, $4) RETURNING *", [generateNumericId(), username, hash, role])

            const users = usersRes.rows[0]
            const userId = users.id

            const userInfoRes = await db.query("INSERT INTO users_info (id, first_name, surname, contact_no) VALUES ($1, $2, $3, $4) RETURNING *", [userId, firstName, surname, contactNo])

            res.json({ success: true, message: "Account created" })
          }
        })
      }
    }
  } catch (err) {
    res.json({ error: err.message })
  }
});


//admin
//admin
//admin 


// admin & trainer login 

app.post("/trainer/login", passport.authenticate("local"), (req, res) => {
  try {
    if (req.user.role === "SUPERADMIN") {
      res.json({ success: true, redirectTo: "/admin/dashboard" });
    } else if (req.user.role === "TRAINER") {
      res.json({ success: true, redirectTo: "/trainer/dashboard" });
    } else {
      res.json({ success: false, message: "role is invalid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//for protection avoid parameters insertion

app.get("/admin/protectedroute", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(403).json({ success: false, message: 'role is invalid' })
    }

    res.status(200).json({ success: true, message: "success login" })
  } catch (error) {
    res.status(400).json({ success: false, message: "Server error" })
  }
})


//fetching data
app.get("/admin/dashboard", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    const trainee = await db.query("SELECT * FROM users WHERE role = 'TRAINEE'");
    const trainer = await db.query("SELECT * FROM users WHERE role = 'TRAINER' ")
    const coursesResponse = await db.query("SELECT * FROM courses")
    res.status(200).json({
      success: true,
      traineeCount: trainee.rows.length,
      trainerCount: trainer.rows.length,
      coursesCount: coursesResponse.rows.length
    });

  } catch (err) {
    res.status(500).json({ message: err })
  }
});

//create course
app.post("/admin/course/createcourse", async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ succes: false, message: "Unauthorized" })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(403).json({ succes: false, messsage: "invalid role" })
    }

    const response = await db.query(
      "INSERT INTO courses (title, description, created_by ) VALUES($1, $2, $3) RETURNING * ",
      [title, description, req.user.id])

    res.status(200).json({ succes: true, data: response.rows })
  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
});

//delete course
app.delete("/admin/coursedelete/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ succes: false, message: "Unauthorized" })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(403).json({ succes: false, messsage: "invalid role" })
    }
    const result = await db.query('DELETE FROM courses WHERE id = $1', [courseId])
    res.status(200).json({ succes: true, messsage: 'success deleting the course' })
  } catch (error) {
    res.status(400).json({ message: `unable to delete the course:  ${error}`, })
  }
})


//fethcing data for courses to appear to course admin page
app.get("/admin/course", async (req, res) => {

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const query = `SELECT * FROM courses `
    const response = await db.query(query)


    res.status(200).json({ data: response.rows })

  } catch (error) {
    res.status(400).json({ success: false, message: 'having error in the query', error })
  }
});




//fetching chapters data to appear according to your course
app.get("/admin/course/:courseId", async (req, res) => {
  const { courseId } = req.params
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = 'SELECT * FROM courses JOIN chapters ON courses.id = chapters.course_id WHERE courses.id = $1 ORDER BY order_index ASC'
    const response = await db.query(query, [courseId]);
    res.status(200).json({ success: true, data: response.rows, chapterLength: response.rows.length })

  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
})


//create chapter
app.post("/admin/course/addchapter", async (req, res) => {
  const { courseId, chapterName, description, chapterIndex } = req.body
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(403).json({ success: false, message: 'invalid role' })
    }

    // const courseIdInt =parseInt(course_id);
    // const orderIndex = parseInt(chapter_no)
    const date = new Date();
    const time = date.toLocaleTimeString();
    const response = await db.query(
      "INSERT INTO chapters (course_id, title, description, order_index, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING * ",
      [courseId, chapterName, description, chapterIndex, time]
    )
    res.status(200).json({ success: true, data: response.rows[0] })


  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
});

//edit the title and description of chapter
app.put("/admin/course/editchapter", async (req, res) => {
  try {
    const { title, description, courseId, chapterId } = req.body;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `
      UPDATE chapters 
      SET title = $1, description = $2
      WHERE id = $3 AND course_id = $4
      RETURNING *;
    `;

    const result = await db.query(query, [title, description, chapterId, courseId]);

    res.json({ success: true, event: result.rows });
  } catch (error) {
    res.json({ success: false, message: error });
  }

});
//edit chapter index order
app.put('/admin/chapter/reorder', async (req, res) => {
  const { orderedChapters } = req.body; // array of {id, order_index}
  try {
    for (const chapter of orderedChapters) {
      await db.query(
        'UPDATE chapters SET order_index = $1 WHERE id = $2',
        [chapter.order_index, chapter.id]
      );
    }
    res.json({ message: 'Chapters reordered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update chapter order' });
  }
});

//delete chapter
app.delete("/admin/chapter/deletechapter/:chapterId", async (req, res) => {
  try {
    const { chapterId } = req.params
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    await db.query('DELETE FROM chapters WHERE id = $1', [chapterId])
    res.json({ success: true, message: 'Done deleting' });
  } catch (error) {
    res.json({ success: false, message: error });
  }
})


// to upload videos
app.post("/admin/chapter/uploadvideo", uploadVideo.single("video"), async (req, res) => {
  //const activityNumber = req.params;
  try {
    const { title, course_id, chapter_id } = req.body;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    if (!req.file) {
      return res.status(400).json({ succes: false, message: "No file uploaded" })
    }



    const query = 'INSERT INTO video_items ( title, source_url, required,created_at, course_id, chapter_id , item_type) VALUES ($1, $2, $3, now(), $4, $5, $6) RETURNING*'
    const values = [title, req.file.path, true, course_id, chapter_id, 'VIDEO']
    //const response = await db.query("INSERT INTO video_items ( title, item_type, source_url, order_index, required,created_at, course_id, chapter_id) VALUES ('title', 'VIDEO', 'dfasdfasdf', 1, True, now(), 2, 25)")
    const response = await db.query(query, values)
    res.json({ success: true, message: `File received successfully`, data: response })
  } catch (error) {
    res.json({ success: false, message: 'Failed Uploading' })
  }
});

app.post('/admin/chapter/upload-image', uploadImage.single('image'), async (req, res) => {
  try {
    const { title, course_id, chapter_id } = req.body;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    if (!req.file) {
      return res.status(400).json({ succes: false, message: "No file uploaded" })
    }
    const query = 'INSERT INTO video_items ( title, source_url, required,created_at, course_id, chapter_id, item_type) VALUES ($1, $2, $3, now(), $4, $5, $6) RETURNING*'
    const values = [title, req.file.path, true, course_id, chapter_id, "IMAGE"]
    const response = await db.query(query, values)
    res.json({ success: true, message: `File received successfully`, data: response.rows })
    console.log(response)
  } catch (error) {
    res.json({ success: false, message: 'Failed Uploading' })
  }
});


app.delete("/admin/course/deletecontent", async (req, res) => {
  try {
    const { isVideo, isQuiz, videoData, quizData } = req.body
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }

    if (isVideo) {
      const result = await cloudinary.uploader.destroy(
        videoData.source_url,
        { resource_type: "video" } // ← important kapag video
      );
      const result1 = await cloudinary.uploader.destroy(
        videoData.source_url,
        { resource_type: "image" });
      const result2 = await db.query('DELETE FROM video_items WHERE id = $1', [videoData.id])
    }

    if (isQuiz) {

      const result1 = await db.query('DELETE FROM quizzes WHERE id = $1', [quizData[0].quiz_id])
    }
    console.log(isVideo, isQuiz, quizData, videoData)
    res.json({ success: true })
  } catch (error) {
    res.json({ success: false, message: error })
  }
});

//comments in the video 
app.get("/admin/:videoId/comments", async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(
      `SELECT 
        comments.id,
        comments.video_item_id,
        comments.user_id,
        comments.content,
        comments.created_at,
        users_info.first_name,
        users_info.surname
      FROM comments
      JOIN users_info 
      ON users_info.id = comments.user_id
      WHERE comments.video_item_id = $1
      ORDER BY comments.created_at DESC`,
      [videoId]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: 'there is a comment', data: result.rows, userId: req.user.id });
    } else {
      res.json({ success: false, message: 'there is no comment yet', data: result.rows });
    }

  } catch (error) {
    res.json(error)
  }

});
app.post("/admin/:videoId/comments", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `INSERT INTO comments (video_item_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [videoId, req.user.id, content]
    );

    res.json(result.rows[0]);
  } catch (error) {
    req.json(error)
  }

});
app.post("/admin/deletecomment", async (req, res) => {
  try {
    const { commentId } = req.body;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "unauthorized access" });
    }

    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: "invalid role" });
    }

    const result = await db.query(
      `DELETE FROM comments
       WHERE id = $1
       RETURNING *`,
      [commentId]
    );

    res.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    res.json({ success: false, error });
  }
});

app.get("/admin/:commentsId/reply", async(req, res)=>{
  try {
    const {commentsId} = req.params;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `SELECT 
        replies.id,
        replies.comments_id,
        replies.user_id,
        replies.content,
        replies.created_at,
        users_info.first_name,
        users_info.surname
      FROM replies
      JOIN users_info 
      ON users_info.id = replies.user_id
      WHERE replies.comments_id = $1
      ORDER BY replies.created_at DESC`,
      [commentsId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.json({ success: false, error });
  }
})
app.post("/admin/:commentsId/reply", async (req, res) => {
  try {
    const { commentsId } = req.params;
    const { content  } = req.body;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `INSERT INTO replies (comments_id, content, created_at, user_id)
      VALUES ($1, $2,now(), $3)
      RETURNING *`, 
      [commentsId, content, req.user.id])

     res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    req.json(error)
  }
});

//to create a quiz
app.post("/admin/chapter/createquiz", async (req, res) => {
  const { chapter_id, title, questions } = req.body;

  try {

    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const quizResult = await db.query(
      "INSERT INTO quizzes (chapter_id, title) VALUES ($1, $2) RETURNING *",
      [chapter_id, title]
    );
    const quizId = quizResult.rows[0].id;

    for (const q of questions) {
      const questionResult = await db.query(
        "INSERT INTO questions (quiz_id, question_text, type, correct_answer) VALUES ($1, $2, $3, $4) RETURNING id",
        [quizId, q.question_text, q.type, q.correct_answer || null]
      );
      const questionId = questionResult.rows[0].id;

      if (q.type === "multiple_choice" && q.choices) {
        for (const c of q.choices) {
          await db.query(
            "INSERT INTO choices (question_id, choice_text, is_correct) VALUES ($1, $2, $3)",
            [questionId, c.choice_text, c.is_correct]
          );
        }
      }
    }

    res.status(201).json({ message: "Quiz created successfully", quizId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

//this is to fetch data or the question inside the database
app.post("/admin/chapter/quiz", async (req, res) => {
  const { chapterId } = req.body;
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const quizzes = await db.query(
      "SELECT quizzes.id AS quiz_id, quizzes.chapter_id, questions.id AS question_id, questions.question_text, questions.type, questions.correct_answer, choices.id AS choice_id, choices.choice_text, choices.is_correct FROM quizzes JOIN questions ON quizzes.id = questions.quiz_id LEFT JOIN choices ON questions.id = choices.question_id WHERE quizzes.chapter_id = $1 ORDER BY questions.id, choices.id",
      [chapterId]
    );

    if (quizzes.rows.length > 1) {
      res.json({ success: true, data: quizzes.rows });
    } else (
      res.json({ success: false, message: 'there is no quiz yet' })
    )

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error fetching quizzes" });
  }
});
//this is to delete the quiz inside the chapter
app.delete("/admin/chapter/deletequiz", async (req, res) => {
  try {
    const quizId = req.body.quizId
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query('DELETE FROM quizzes WHERE id = $1 RETURNING *', [quizId]);
    if (result.rows.length < 0) {
      res.status(400).json({ success: false, message: 'there is no any quizzes available in this chapter', quizzes: result.rows[0] })
    } else {
      res.status(200).json({ success: true, message: 'success deleting the the quizzes', quizzes: result.rows[0] })
    }
  } catch (error) {
    res.status(400).json({ success: false, message: `there is a error in query section ${error}` })
  }
})


// this part is for getting the chapteritems to retrieve the video
app.post("/admin/chapter/mediaitems", async (req, res) => {

  try {
    const { courseId, chapterId } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM chapters JOIN video_items ON chapters.id = video_items.chapter_id WHERE chapters.course_id = $1 AND video_items.chapter_id = $2`
    const value = [courseId, chapterId]
    const result = await db.query(query, value);

    if (result.rows.length === 1) {
      res.json({ success: true, message: 'success gathering your data', data: result.rows })
    } else {
      res.json({ success: false, messsage: 'there no video added yet', data: result.rows })
    }

  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});

// fetching the data inside the chapter so if you open or click the course it will appear automatically 
//course chapters.jsx
app.get("/admin/course/:chapterindex/:courseId", async (req, res) => {
  try {
    const { chapterindex, courseId } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }


    const query1 = `SELECT * FROM chapters 
      JOIN quizzes
      ON quizzes.chapter_id = chapters.id
      WHERE chapters.course_id = $1 AND chapters.order_index = $2`
    const value1 = [courseId, chapterindex]
    const quizItems = await db.query(query1, value1)

    const query2 = `SELECT * FROM chapters 
      JOIN video_items 
      ON chapters.id = video_items.chapter_id 
      WHERE chapters.course_id = $1 AND chapters.order_index = $2`
    const value2 = [courseId, chapterindex]
    const videoItems = await db.query(query2, value2);

    const query3 = `SELECT *FROM chapters
      WHERE chapters.course_id = $1 AND chapters.order_index = $2`
    const value3 = [courseId, chapterindex]
    const chapterInfo = await db.query(query3, value3);

    console.log(quizItems.rows.length, videoItems.rows.length)
    if (quizItems.rows.length === 0 && videoItems.rows.length === 0) {
      return res.json({
        success: false,
        message: "No video or quiz added yet.",
        chapterInfo: chapterInfo.rows,
        data: {
          quiz: quizItems.rows,
          video: videoItems.rows
        }
      });
    }
    // Success
    return res.json({
      success: true,
      message: "Success gathering your data",
      chapterInfo: chapterInfo.rows,
      data: {
        quiz: quizItems.rows,
        video: videoItems.rows
      }
    });


  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});






//enroll your trainer into the course
app.post("/admin/course/enroll", async (req, res) => {

  try {
    const { courseId, studentId } = req.body;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM users WHERE id = $1`
    const values = [studentId]
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      if (result.rows[0].role === 'TRAINER') {
        res.status(401).json({ success: true, message: 'Access denied. Your user role does not satisfy the enrollment criteria for this course.' })
      }
      const query1 = 'INSERT INTO enrollments (course_id, student_id) VALUES ($1, $2) RETURNING *'
      const values2 = [courseId, studentId]
      const response = await db.query(query1, values2)
      res.status(200).json({ success: true, message: 'success enrollment', data: response.rows })
    } else {
      res.status(200).json({ success: false, message: 'unsuccess enrollment there ', data: result.rows })
    }


  } catch (error) {
    res.status(400).json({ success: false, messsage: 'failed enrollment please check', error: error })
  }
})

//calendar todo list 
app.post("/admin/calendar/events", async (req, res) => {

  try {
    const { event_date, text, color } = req.body;

    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `
      INSERT INTO calendar_events (user_id, event_date, text, color)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await db.query(query, [req.user.id, event_date, text, color]);

    res.json({ success: true, event: result.rows[0] });
  } catch (error) {
    res.json({ success: false, message: error });
  }

});
//fetch the data inside the calendar
app.get("/admin/calendar/events", async (req, res) => {
  try {

    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `SELECT * FROM calendar_events WHERE user_id = $1 ORDER BY event_date ASC`,
      [req.user.id]
    );

    res.json({ success: true, events: result.rows });
  } catch (error) {
    res.json({ success: false, message: error });
  }

});
//delete the data inside the chapter
app.delete("/admin/calendar/events/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `DELETE FROM calendar_events WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    res.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    res.json({ success: false, message: error });
  }

});

//trainee progress 
app.post('/admin/course/traineeprogress', async (req, res) => {
  try {
    const { course_id } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`SELECT * FROM enrollments
    JOIN users_info
    ON users_info.id = enrollments.student_id
    WHERE course_id = $1
    ORDER BY users_info.surname ASC;`, [course_id])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//video progress
app.post('/admin/course/traineevideoprogress', async (req, res) => {
  try {
    const { course_id, chapter_id } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`SELECT 
      enrollments.*,
      users_info.*,
      video_progress.*
    FROM enrollments
    LEFT JOIN users_info
      ON users_info.id = enrollments.student_id
    LEFT JOIN video_progress
      ON video_progress.user_id = enrollments.student_id
      AND video_progress.course_id = $1
      AND video_progress.chapter_id = $2
    WHERE enrollments.course_id = $1
    ORDER BY users_info.surname ASC;`, [course_id, chapter_id])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//quizprogress
app.post('/admin/course/traineequizprogress', async (req, res) => {
  try {
    const { course_id, chapter_id } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`
        SELECT 
          enrollments.*,
          users_info.*,
          quiz_progress.*
          
        FROM enrollments
        LEFT JOIN users_info
          ON users_info.id = enrollments.student_id
        LEFT JOIN quiz_progress
          ON quiz_progress.user_id = enrollments.student_id 
          AND quiz_progress.chapter_id = $1
        WHERE enrollments.course_id = $2
        ORDER BY users_info.surname ASC;`, [chapter_id, course_id])
    const quizLength = await db.query(`SELECT * FROM quizzes
      JOIN questions
      ON questions.quiz_id = quizzes.id
      WHERE quizzes.chapter_id = $1`, [chapter_id])

    res.status(200).json({ success: true, message: 'succesful query', data: result.rows, quizLength: quizLength.rows.length })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//iamgeprogress
app.post('/admin/course/traineeimageprogress', async (req, res) => {
  try {
    const { course_id, chapter_id } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`SELECT 
      enrollments.*,
      users_info.*,
      image_progress.*
    FROM enrollments
    LEFT JOIN users_info
      ON users_info.id = enrollments.student_id
    LEFT JOIN image_progress
      ON image_progress.user_id = enrollments.student_id
      AND image_progress.course_id = $1
      AND image_progress.chapter_id = $2
    WHERE enrollments.course_id = $1
    ORDER BY users_info.surname ASC;`, [course_id, chapter_id])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//render the data in to excel
app.post('/admin/:course/excelrender', async (req, res) => {
  try {
    const { course } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const chapter = await db.query(`SELECT * FROM chapters
            WHERE course_id = $1
            ORDER BY order_index ASC`, [course]);
    const trainee = await db.query(`SELECT 
            enrollments.*,
            users_info.*
            FROM enrollments
            LEFT JOIN users_info
            ON users_info.id = enrollments.student_id
            WHERE enrollments.course_id = $1
            ORDER BY users_info.surname ASC;`, [course])

    const videoProgress = await db.query(`SELECT 
                enrollments.*,
                users_info.*,
                video_progress.*
            FROM enrollments
            LEFT JOIN users_info
                ON users_info.id = enrollments.student_id
            JOIN video_progress
                ON video_progress.user_id = enrollments.student_id
            WHERE enrollments.course_id = $1
            ORDER BY users_info.surname ASC;`, [course])
    const quizProgress = await db.query(`SELECT 
                enrollments.*,
                users_info.*,
                quiz_progress.*
            FROM enrollments
            LEFT JOIN users_info
                ON users_info.id = enrollments.student_id
            JOIN quiz_progress
                ON quiz_progress.user_id = enrollments.student_id
            WHERE enrollments.course_id = $1
            ORDER BY users_info.surname ASC;`, [course])
    const imageProgress = await db.query(`SELECT 
                enrollments.*,
                users_info.*,
                image_progress.*
            FROM enrollments
            LEFT JOIN users_info
                ON users_info.id = enrollments.student_id
            LEFT JOIN image_progress
                ON image_progress.user_id = enrollments.student_id
                
            WHERE enrollments.course_id = $1`, [course])

    res.json({ chapter: chapter.rows, trainee: trainee.rows, video_progress: videoProgress.rows, quiz_progress: quizProgress.rows, image_progress: imageProgress.rows })
  } catch (error) {
    res.json({ success: false, error })
  }
})


app.post("/admin/dashboard/logout", (req, res, next) => {

  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "No active session found" });
  }

  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Failed to destroy session" });

      res.clearCookie("connect.sid");
      return (res.json({ message: "Successfully logged out", redirectTo: "/" }));
    });
  });
});



//trainer
//trainer
//trainer
//trainer
//trainer
//trainer
//trainer
//trainer
//trainer
//trainer
//trainer
//trainer
//trainer
//trainer
//trainer
// login trainer side


// this will get all the data in your crediatials after you login 
app.get("/trainer/dashboard", async (req, res) => {

  try {
    if (req.isAuthenticated()) {
      if (req.user.role === "TRAINER") {
        const response = await db.query("SELECT * FROM users JOIN users_info ON users.id = users_info.id WHERE username = $1", [req.user.username])
        const TRAINEEcount = await db.query("SELECT * FROM users WHERE role = $1", ['TRAINEE']);

        const totalTrainee = TRAINEEcount.rows

        res.json({ success: true, user: response.rows[0], totalTrainee: totalTrainee.length, })
      } else {
        return res.json({ success: false, message: 'role is invalid' })
      }

    } else {
      res.json({ success: false })
    }
  } catch (err) {
    res.status(400).json({ message: err })
  }



});
app.post("/trainer/course/enroll", async (req, res) => {

  try {
    const { courseId, studentId } = req.body;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM users WHERE id = $1`
    const values = [studentId]
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      if (result.rows[0].role === 'TRAINER') {
        res.status(401).json({ success: false, message: 'Access denied. Your user role does not satisfy the enrollment criteria for this course.' })
      }
      const query1 = 'INSERT INTO enrollments (course_id, student_id) VALUES ($1, $2) RETURNING *'
      const values2 = [courseId, studentId]
      const response = await db.query(query1, values2)
      res.status(200).json({ success: true, message: 'success enrollment', data: response.rows })
    } else {
      res.status(200).json({ success: false, message: 'unsuccess enrollment there ', data: result.rows })
    }


  } catch (error) {
    res.status(400).json({ success: false, messsage: 'failed enrollment please check', error: error })
  }
})
//create course
app.post("/trainer/course/createcourse", async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ succes: false, message: "Unauthorized" })
    }
    if (req.user.role !== "TRAINER") {
      res.status(403).json({ succes: false, messsage: "invalid role" })
    }
    const response = await db.query(
      `INSERT INTO courses (title, description, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
      [title, description, req.user.id]
    );

    if (response.rows.length === 0) {
      return res.status(500).json({ success: false, message: "Course creation failed" });
    } else {
      const courseId = response.rows[0].id;
      const userId = req.user.id;

      const response1 = await db.query(
        `INSERT INTO course_trainers (course_id, trainer_id)
       VALUES ($1, $2)
       RETURNING *`,
        [courseId, userId]
      );
      console.log(response1)

      return res.status(200).json({
        success: true,
        courseData: response.rows[0],
        trainerAssignData: response1.rows[0]
      });
    }



  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
});
//fetch the data courses
app.get("/trainer/course", async (req, res) => {

  try {

    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const query = `SELECT * FROM course_trainers JOIN courses ON courses.id = course_trainers.course_id WHERE trainer_id = $1`
    const values = [req.user.id]
    const response = await db.query(query, values)
    res.status(200).json({ success: true, data: response.rows })

  } catch (error) {
    res.status(400).json({ success: error })
  }
});
//create chapter
app.post("/trainer/course/addchapter", async (req, res) => {
  const { course_id, chapter_name, description, chapter_no } = req.body
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(403).json({ success: false, message: 'invalid role' })
    }

    // const courseIdInt =parseInt(course_id);
    // const orderIndex = parseInt(chapter_no)
    const date = new Date();
    const time = date.toLocaleTimeString();
    const response = await db.query(
      "INSERT INTO chapters (course_id, title, description, order_index, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING * ",
      [course_id, chapter_name, description, chapter_no, time]
    )
    res.status(200).json({ success: true, data: response.rows[0] })


  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
});
//fetch chapter
app.post("/trainer/course/chapter", async (req, res) => {
  const { course_Id } = req.body
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = 'SELECT * FROM courses JOIN chapters ON courses.id = chapters.course_id WHERE courses.id = $1'
    const response = await db.query(query, [course_Id]);
    res.status(200).json({ success: true, data: response.rows, chapterLength: response.rows.length })

  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
})
//edit the title and description of chapter
app.put("/trainer/course/editchapter", async (req, res) => {
  try {
    const { title, description, courseId, chapterId } = req.body;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `
      UPDATE chapters 
      SET title = $1, description = $2
      WHERE id = $3 AND course_id = $4
      RETURNING *;
    `;

    const result = await db.query(query, [title, description, chapterId, courseId]);

    res.json({ success: true, event: result.rows });
  } catch (error) {
    res.json({ success: false, message: error });
  }

});
//edit chapter index order
app.put('/trainer/chapter/reorder', async (req, res) => {
  const { orderedChapters } = req.body; // array of {id, order_index}
  try {
    for (const chapter of orderedChapters) {
      await db.query(
        'UPDATE chapters SET order_index = $1 WHERE id = $2',
        [chapter.order_index, chapter.id]
      );
    }
    res.json({ message: 'Chapters reordered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update chapter order' });
  }
});

//delete chapter
app.delete("/trainer/chapter/deletechapter/:chapterId", async (req, res) => {
  try {
    const { chapterId } = req.params
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    await db.query('DELETE FROM chapters WHERE id = $1', [chapterId])
    res.json({ success: true, message: 'Done deleting' });
  } catch (error) {
    res.json({ success: false, message: error });
  }
})

//certificate upload
app.post("/trainer/chapter/addcertificate", async (req, res) => {

  try {
    const { courseId, chapterId } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `INSERT INTO certificate ( is_certificate,chapter_id,course_id) VALUES ($1, $2, $3) RETURNING*`
    const value = [true, chapterId, courseId]
    const result = await db.query(query, value);

    if (result.rows.length === 1) {
      res.json({ success: true, message: 'success gathering your data', data: result.rows })
    } else {
      res.json({ success: false, messsage: 'there no video or quiz added yet', data: result.rows })
    }

  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});
app.post("/trainer/chapter/getcertificate", async (req, res) => {

  try {
    const { courseId, chapterId } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM certificate WHERE course_id = $1 AND chapter_id = $2`
    const value = [courseId, chapterId]
    const result = await db.query(query, value);
    console.log(result.rows.length)
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'success gathering your data', data: result.rows })
    } else {
      res.json({ success: false, messsage: 'there no video or quiz added yet', data: result.rows })
    }

  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});


app.post("/trainer/chapter/mediaitems", async (req, res) => {

  try {
    const { courseId, chapterId } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM chapters JOIN video_items ON chapters.id = video_items.chapter_id WHERE chapters.course_id = $1 AND video_items.chapter_id = $2`
    const value = [courseId, chapterId]
    const result = await db.query(query, value);

    if (result.rows.length === 1) {
      res.json({ success: true, message: 'success gathering your data', data: result.rows })
    } else {
      res.json({ success: false, messsage: 'there no video or quiz added yet', data: result.rows })
    }

  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});

// fetching the first data inside the chapter so if you open the course it will appear automatically 
app.post("/trainer/chapter/chapterfirstitem", async (req, res) => {
  try {
    const { courseId } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM chapters JOIN video_items ON chapters.id = video_items.chapter_id WHERE chapters.course_id = $1 AND video_items.order_index = $2`
    const value = [courseId, 1]
    const result = await db.query(query, value);

    if (result.rows.length === 1) {
      res.json({ success: true, message: 'success gathering your data', data: result.rows })
    } else {
      res.json({ success: false, messsage: 'there no video or quiz added yet', data: result.rows })
    }

  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});

//this upload the video
app.post("/trainer/chapter/uploadvideo", uploadVideo.single("video"), async (req, res) => {
  //const activityNumber = req.params;
  try {
    const { title, course_id, order_index, chapter_id } = req.body;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    if (!req.file) {
      return res.status(400).json({ succes: false, message: "No file uploaded" })
    }



    const query = 'INSERT INTO video_items ( title, source_url, order_index, required,created_at, course_id, chapter_id , item_type) VALUES ($1, $2, $3, $4, now(), $5, $6, $7) RETURNING*'
    const values = [title, req.file.path, order_index, false, course_id, chapter_id, 'VIDEO']
    //const response = await db.query("INSERT INTO video_items ( title, item_type, source_url, order_index, required,created_at, course_id, chapter_id) VALUES ('title', 'VIDEO', 'dfasdfasdf', 1, True, now(), 2, 25)")
    const response = await db.query(query, values)
    res.json({ success: true, message: `File received successfully`, data: response })
  } catch (error) {
    res.json({ success: false, message: 'Failed Uploading' })
  }
});
// this is to upload image 
app.post('/trainer/chapter/upload-image', uploadImage.single('image'), async (req, res) => {
  try {
    const { title, course_id, order_index, chapter_id } = req.body;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    if (!req.file) {
      return res.status(400).json({ succes: false, message: "No file uploaded" })
    }
    const query = 'INSERT INTO video_items ( title, source_url, order_index, required,created_at, course_id, chapter_id, item_type) VALUES ($1, $2, $3, $4, now(), $5, $6, $7) RETURNING*'
    const values = [title, req.file.path, order_index, true, course_id, chapter_id, "IMAGE"]
    const response = await db.query(query, values)
    res.json({ success: true, message: `File received successfully`, data: response.rows })
    console.log(response)
  } catch (error) {
    res.json({ success: false, message: 'Failed Uploading' })
  }
});
//to create a quiz
app.post("/trainer/chapter/createquiz", async (req, res) => {
  const { chapter_id, title, questions } = req.body;

  try {

    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const quizResult = await db.query(
      "INSERT INTO quizzes (chapter_id, title) VALUES ($1, $2) RETURNING *",
      [chapter_id, title]
    );
    const quizId = quizResult.rows[0].id;

    for (const q of questions) {
      const questionResult = await db.query(
        "INSERT INTO questions (quiz_id, question_text, type, correct_answer) VALUES ($1, $2, $3, $4) RETURNING id",
        [quizId, q.question_text, q.type, q.correct_answer || null]
      );
      const questionId = questionResult.rows[0].id;

      if (q.type === "multiple_choice" && q.choices) {
        for (const c of q.choices) {
          await db.query(
            "INSERT INTO choices (question_id, choice_text, is_correct) VALUES ($1, $2, $3)",
            [questionId, c.choice_text, c.is_correct]
          );
        }
      }
    }

    res.status(201).json({ message: "Quiz created successfully", quizId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

//this is to fetch data or the question inside the database
app.post("/trainer/chapter/quiz", async (req, res) => {
  const { chapterId } = req.body;
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const quizzes = await db.query(
      "SELECT quizzes.id AS quiz_id, quizzes.chapter_id, questions.id AS question_id, questions.question_text, questions.type, questions.correct_answer, choices.id AS choice_id, choices.choice_text, choices.is_correct FROM quizzes JOIN questions ON quizzes.id = questions.quiz_id LEFT JOIN choices ON questions.id = choices.question_id WHERE quizzes.chapter_id = $1 ORDER BY questions.id, choices.id",
      [chapterId]
    );

    if (quizzes.rows.length > 1) {
      res.json({ success: true, data: quizzes.rows });
    } else (
      res.json({ success: false, message: 'there is no quiz yet' })
    )

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error fetching quizzes" });
  }
});
//this is to delete the quiz inside the chapter
app.delete("trainer/chapter/deletequiz", async (req, res) => {
  try {
    const quizId = req.body.quizId
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query('DELETE FROM quizzes WHERE id = $1 RETURNING *', [quizId]);
    if (result.rows.length < 0) {
      res.status(400).json({ success: false, message: 'there is no any quizzes available in this chapter', quizzes: result.rows[0] })
    } else {
      res.status(200).json({ success: true, message: 'success deleting the the quizzes', quizzes: result.rows[0] })
    }
  } catch (error) {
    res.status(400).json({ success: false, message: `there is a error in query section ${error}` })
  }
});
// deleting cotent inside the 
app.delete("/trainer/course/deletecontent", async (req, res) => {
  try {
    const { isVideo, isQuiz, videoData, quizData } = req.body
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }

    if (isVideo) {
      const result = await cloudinary.uploader.destroy(
        videoData.source_url,
        { resource_type: "video" } // ← important kapag video
      );
      const result1 = await cloudinary.uploader.destroy(
        videoData.source_url,
        { resource_type: "image" });
      const result2 = await db.query('DELETE FROM video_items WHERE id = $1', [videoData.id])
    }

    if (isQuiz) {

      const result1 = await db.query('DELETE FROM quizzes WHERE id = $1', [quizData[0].quiz_id])
    }
    console.log(isVideo, isQuiz, quizData, videoData)
    res.json({ success: true })
  } catch (error) {
    res.json({ success: false, message: error })
  }
});

//comments in the video 
app.get("/trainer/:videoId/comments", async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(
      `SELECT 
        comments.id,
        comments.video_item_id,
        comments.user_id,
        comments.content,
        comments.created_at,
        users_info.first_name,
        users_info.surname
      FROM comments
      JOIN users_info 
      ON users_info.id = comments.user_id
      WHERE comments.video_item_id = $1
      ORDER BY comments.created_at DESC`,
      [videoId]
    );

    if (result.rows.length < 0) {
      res.json({ success: true, message: 'there is a comment', data: result.rows });
    } else {
      res.json({ success: false, message: 'there is no comment yet', data: result.rows });
    }

  } catch (error) {
    res.json(error)
  }

});
app.post("/trainer/:videoId/comments", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `INSERT INTO comments (video_item_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [videoId, req.user.id, content]
    );

    res.json(result.rows[0]);
  } catch (error) {
    req.json(error)
  }

});
app.post("/trainer/video/deletecomment", async (req, res) => {
  try {
    const { commentId } = req.body;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "unauthorized access" });
    }

    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: "invalid role" });
    }

    const result = await db.query(
      `DELETE FROM comments
       WHERE id = $1
       RETURNING *`,
      [commentId]
    );

    res.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    res.json({ success: false, error });
  }
});


//calendar todo list 
app.post("/trainer/calendar/events", async (req, res) => {

  try {
    const { event_date, text, color } = req.body;

    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `
      INSERT INTO calendar_events (user_id, event_date, text, color)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await db.query(query, [req.user.id, event_date, text, color]);

    res.json({ success: true, event: result.rows[0] });
  } catch (error) {
    res.json({ success: false, message: error });
  }

});
app.get("/trainer/calendar/events", async (req, res) => {
  try {

    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `SELECT * FROM calendar_events WHERE user_id = $1 ORDER BY event_date ASC`,
      [req.user.id]
    );

    res.json({ success: true, events: result.rows });
  } catch (error) {
    res.json({ success: false, message: error });
  }

});

app.delete("/trainer/calendar/events/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `DELETE FROM calendar_events WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    res.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    res.json({ success: false, message: error });
  }

});

//trainee Progress
app.post('/trainer/course/traineeprogress', async (req, res) => {
  try {
    const { course_id } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`SELECT * FROM enrollments
    JOIN users_info
    ON users_info.id = enrollments.student_id
    WHERE course_id = $1
    ORDER BY users_info.surname ASC;`, [course_id])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//video progress
app.post('/trainer/course/traineevideoprogress', async (req, res) => {
  try {
    const { course_id, chapter_id } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`SELECT 
      enrollments.*,
      users_info.*,
      video_progress.*
    FROM enrollments
    LEFT JOIN users_info
      ON users_info.id = enrollments.student_id
    LEFT JOIN video_progress
      ON video_progress.user_id = enrollments.student_id
      AND video_progress.course_id = $1
      AND video_progress.chapter_id = $2
    WHERE enrollments.course_id = $1
    ORDER BY users_info.surname ASC;`, [course_id, chapter_id])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//quizprogress
app.post('/trainer/course/traineequizprogress', async (req, res) => {
  try {
    const { course_id, chapter_id } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`
        SELECT 
          enrollments.*,
          users_info.*,
          quiz_progress.*
          
        FROM enrollments
        LEFT JOIN users_info
          ON users_info.id = enrollments.student_id
        LEFT JOIN quiz_progress
          ON quiz_progress.user_id = enrollments.student_id 
          AND quiz_progress.chapter_id = $1
        WHERE enrollments.course_id = $2
        ORDER BY users_info.surname ASC;`, [chapter_id, course_id])
    const quizLength = await db.query(`SELECT * FROM quizzes
      JOIN questions
      ON questions.quiz_id = quizzes.id
      WHERE quizzes.chapter_id = $1`, [chapter_id])

    res.status(200).json({ success: true, message: 'succesful query', data: result.rows, quizLength: quizLength.rows.length })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//iamgeprogress
app.post('/trainer/course/traineeimageprogress', async (req, res) => {
  try {
    const { course_id, chapter_id } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`SELECT 
      enrollments.*,
      users_info.*,
      image_progress.*
    FROM enrollments
    LEFT JOIN users_info
      ON users_info.id = enrollments.student_id
    LEFT JOIN image_progress
      ON image_progress.user_id = enrollments.student_id
      AND image_progress.course_id = $1
      AND image_progress.chapter_id = $2
    WHERE enrollments.course_id = $1
    ORDER BY users_info.surname ASC;`, [course_id, chapter_id])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//render the data in to excel
app.post('/trainer/:course/excelrender', async (req, res) => {
  try {
    const { course } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const chapter = await db.query(`SELECT * FROM chapters
            WHERE course_id = $1
            ORDER BY order_index ASC`, [course]);
    const trainee = await db.query(`SELECT 
            enrollments.*,
            users_info.*
            FROM enrollments
            LEFT JOIN users_info
            ON users_info.id = enrollments.student_id
            WHERE enrollments.course_id = $1
            ORDER BY users_info.surname ASC;`, [course])

    const videoProgress = await db.query(`SELECT 
                enrollments.*,
                users_info.*,
                video_progress.*
            FROM enrollments
            LEFT JOIN users_info
                ON users_info.id = enrollments.student_id
            JOIN video_progress
                ON video_progress.user_id = enrollments.student_id
            WHERE enrollments.course_id = $1
            ORDER BY users_info.surname ASC;`, [course])
    const quizProgress = await db.query(`SELECT 
                enrollments.*,
                users_info.*,
                quiz_progress.*
            FROM enrollments
            LEFT JOIN users_info
                ON users_info.id = enrollments.student_id
            JOIN quiz_progress
                ON quiz_progress.user_id = enrollments.student_id
            WHERE enrollments.course_id = $1
            ORDER BY users_info.surname ASC;`, [course])
    const imageProgress = await db.query(`SELECT 
                enrollments.*,
                users_info.*,
                image_progress.*
            FROM enrollments
            LEFT JOIN users_info
                ON users_info.id = enrollments.student_id
            LEFT JOIN image_progress
                ON image_progress.user_id = enrollments.student_id
                
            WHERE enrollments.course_id = $1`, [course])

    res.json({ chapter: chapter.rows, trainee: trainee.rows, video_progress: videoProgress.rows, quiz_progress: quizProgress.rows, image_progress: imageProgress.rows })
  } catch (error) {
    res.json({ success: false, error })
  }
})


//log out trainer side
app.post("/trainer/dashboard/logout", (req, res, next) => {

  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "No active session found" });
  }

  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Failed to destroy session" });

      res.clearCookie("connect.sid");
      return (res.json({ message: "Successfully logged out", redirectTo: "/" }));
    });
  });
});

//trainee
//trainee
//trainee
//trainee
//trainee
//trainee
//trainee
//trainee
//trainee
//trainee
//trainee
//trainee

//login for trainee
app.post("/trainee/login", passport.authenticate('local'), (req, res) => {
  try {
    if (req.user.role === "TRAINEE") {
      res.json({ success: true, redirectTo: "/trainee/dashboard" })
    } else {
      res.json({ success: false, message: "role is invalid" })
    }
  } catch (error) {
    console.log(error)
  }

})
//certificate upload
app.post("/trainee/chapter/getcertificate", async (req, res) => {

  try {
    const { courseId, chapterId } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM certificate WHERE course_id = $1 AND chapter_id = $2`
    const value = [courseId, chapterId]
    const result = await db.query(query, value);
    console.log(result.rows.length)
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'success gathering your data', data: result.rows })
    } else {
      res.json({ success: false, messsage: 'there no video or quiz added yet', data: result.rows })
    }

  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});


// //getting a certain data of users
app.get("/trainee/dashboard", async (req, res) => {

  try {
    if (req.isAuthenticated()) {
      if (req.user.role === "TRAINEE") {
        const response = await db.query("SELECT role, username, users.id, first_name, surname FROM users JOIN users_info ON users.id = users_info.id WHERE username = $1", [req.user.username])

        res.json({ success: true, data: response.rows[0] })
      } else {
        return res.json({ success: false, message: 'role is invalid' })
      }

    } else {
      res.json({ success: false })
    }
  } catch (err) {
    res.status(400).json({ message: err })
  }
});

//part is to scan the enrolled course and load it into trainee course
app.get("/trainee/course", async (req, res) => {

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = "SELECT * FROM enrollments JOIN users ON users.id = enrollments.student_id JOIN courses ON courses.id = enrollments.course_id WHERE users.id = $1"
    const value = [req.user.id];

    const result = await db.query(query, value)
    if (result.rows.length === 0) {
      res.status(400).json({ success: false, message: 'your not enrolled yet' })
    } else {
      res.status(200).json({ success: true, message: 'your enrolled already', data: result.rows })
    }

  } catch (error) {
    res.json({ success: false, messsage: `unsuccessful query there is an error ${error} ` })
  }
});

//to fetch show the available chapter in the course
app.get("/trainee/course/:courseId", async (req, res) => {
  const { courseId } = req.params
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = 'SELECT * FROM courses JOIN chapters ON courses.id = chapters.course_id WHERE courses.id = $1'
    const response = await db.query(query, [courseId]);
    res.status(200).json({ success: true, data: response.rows, chapterLength: response.rows.length })

  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
});

// fetching the data inside the chapter so if you open or click the course it will appear automatically 
//course chapters.jsx
app.get("/trainee/course/:chapterindex/:courseId", async (req, res) => {
  try {
    const { chapterindex, courseId } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }


    const query1 = `SELECT * FROM chapters 
      JOIN quizzes
      ON quizzes.chapter_id = chapters.id
      WHERE chapters.course_id = $1 AND chapters.order_index = $2`
    const value1 = [courseId, chapterindex]
    const quizItems = await db.query(query1, value1)

    const query2 = `SELECT * FROM chapters 
      JOIN video_items 
      ON chapters.id = video_items.chapter_id 
      WHERE chapters.course_id = $1 AND chapters.order_index = $2`
    const value2 = [courseId, chapterindex]
    const videoItems = await db.query(query2, value2);

    const query3 = `SELECT *FROM chapters
      WHERE chapters.course_id = $1 AND chapters.order_index = $2`
    const value3 = [courseId, chapterindex]
    const chapterInfo = await db.query(query3, value3);

    console.log(quizItems.rows.length, videoItems.rows.length)
    if (quizItems.rows.length === 0 && videoItems.rows.length === 0) {
      return res.json({
        success: false,
        message: "No video or quiz added yet.",
        chapterInfo: chapterInfo.rows,
        data: {
          quiz: quizItems.rows,
          video: videoItems.rows
        }
      });
    }
    // Success
    return res.json({
      success: true,
      message: "Success gathering your data",
      chapterInfo: chapterInfo.rows,
      data: {
        quiz: quizItems.rows,
        video: videoItems.rows
      }
    });


  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});


// fetch the first item
app.post("/trainee/chapter/mediaitems", async (req, res) => {

  try {
    const { courseId, chapterId } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM chapters JOIN video_items ON chapters.id = video_items.chapter_id WHERE chapters.course_id = $1 AND video_items.chapter_id = $2`
    const value = [courseId, chapterId]
    const result = await db.query(query, value);

    if (result.rows.length === 1) {
      res.json({ success: true, message: 'success gathering your data', data: result.rows })
    } else {
      res.json({ success: false, messsage: 'there no video or quiz added yet', data: result.rows })
    }

  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});

// fetching the first data inside the chapter so if you open the course it will appear automatically 
app.post("/trainee/chapter/chapterfirstitem", async (req, res) => {
  try {
    const { courseId } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM chapters JOIN video_items ON chapters.id = video_items.chapter_id WHERE chapters.course_id = $1 AND video_items.order_index = $2`
    const value = [courseId, 1]
    const result = await db.query(query, value);

    if (result.rows.length === 1) {
      res.json({ success: true, message: 'success gathering your data', data: result.rows })
    } else {
      res.json({ success: false, messsage: 'there no video or quiz added yet', data: result.rows })
    }

  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});
// fetch the quiz
app.post("/trainee/chapter/quiz", async (req, res) => {
  const { chapterId } = req.body;
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const quizzes = await db.query(
      `SELECT 
        quizzes.id AS quiz_id, 
        quizzes.chapter_id, 
        questions.id AS question_id, 
        questions.question_text, questions.type, 
        questions.correct_answer, choices.id AS choice_id, 
        choices.choice_text, choices.is_correct 
      FROM quizzes 
        JOIN questions 
        ON quizzes.id = questions.quiz_id 
        LEFT JOIN choices ON questions.id = choices.question_id 
      WHERE quizzes.chapter_id = $1 ORDER BY questions.id, choices.id`,
      [chapterId]
    );

    if (quizzes.rows.length > 1) {
      res.json({ success: true, data: quizzes.rows });
    } else (
      res.json({ success: false, message: 'there is no quiz yet' })
    )

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error fetching quizzes" });
  }
});
//send data into database
app.post("/trainee/quiz/answer", async (req, res) => {
  try {
    const { quiz_id, chapter_id, course_id, score, percentage, tempResults } = req.body;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'unauthorized access' });
    }

    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' });
    }
    console.log(tempResults)
    const query = `INSERT INTO quiz_progress (user_id, quiz_id, chapter_id, course_id, score, percentage, created_at) 
                  VALUES($1, $2, $3, $4, $5, $6, now()) RETURNING *`;
    const values = [req.user.id, quiz_id, chapter_id, course_id, score, percentage];
    const result = await db.query(query, values);

    for (const item of tempResults) {
      const query1 = `INSERT INTO quiz_progress_answers 
                      (question_id, chapter_id, course_id, user_answer, is_correct, question, correct_answer, user_id)
                      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
      const values2 = [
        item.question_id,
        chapter_id,
        course_id,
        item.userAnswer,
        item.isCorrect,
        item.question,
        item.correctAnswer,
        req.user.id
      ];

      await db.query(query1, values2);
    }


    res.status(200).json({ success: true, message: 'successful adding your answer', data: result.rows[0] });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post("/trainee/quiz/quizprogress", async (req, res) => {
  try {
    const { chapter_id } = req.body;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'unauthorized access' });
    }

    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' });
    }

    const result = await db.query(
      `SELECT * FROM quiz_progress_answers
      WHERE chapter_id = $1 AND user_id = $2  `,
      [chapter_id, req.user.id]   // use logged-in user
    );

    res.status(200).json({
      success: true,
      message: 'quiz progress fetched',
      data: result.rows
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post("/trainee/:videoId/completed", async (req, res) => {
  try {
    const { is_completed, } = req.body
    const { videoId } = req.params
    await db.query(
      'UPDATE video_progress SET is_completed = $1 WHERE user_id = $2 AND video_id = $3',
      [is_completed, req.user.id, videoId,]
    );
    res.status(200).json({ success: true, message: 'success updating the is completed' })
  } catch (error) {
    res.status(400).json({ success: false, message: 'unsuccess updating the is completed' })
  }
});
app.post("/trainee/:imageId/progressimage", async (req, res) => {
  try {
    const { chapterId, courseId } = req.body;
    const { imageId } = req.params;

    // Authentication check
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "unauthorized access" });
    }

    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: "invalid role" });
    }

    // Insert or update (one record per user/image)
    const result = await db.query(
      `INSERT INTO image_progress (user_id, chapter_id, course_id, video_id, is_completed)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, video_id)
       DO UPDATE SET is_completed = EXCLUDED.is_completed
       RETURNING *;`,
      [req.user.id, chapterId, courseId, imageId, true]
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated image progress",
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Failed to update image progress" });
  }
});




//SAVE VIDEO PROGRESS
app.post("/trainee/:videoId/progress", async (req, res) => {

  try {
    const { videoId } = req.params;
    const { duration_seconds, chapter_id, course_id, is_completed } = req.body;

    // AUTH CHECK
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'unauthorized access' });
    }

    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' });
    }

    const userId = req.user.id;

    // UPSERT (insert/update)
    const query = `
      INSERT INTO video_progress (user_id, video_id, chapter_id, course_id, duration_seconds, is_completed)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, video_id)
      DO UPDATE SET duration_seconds = EXCLUDED.duration_seconds, updated_at = NOW()
      RETURNING *;
    `;

    const result = await db.query(query, [
      userId,
      videoId,
      chapter_id,
      course_id,
      duration_seconds,
      is_completed
    ]);

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "DB error" });
  }
});


// GET VIDEO PROGRESS
app.get("/trainee/:videoId/progress", async (req, res) => {
  try {
    const { videoId } = req.params;

    // AUTH CHECK
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'unauthorized access' });
    }

    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' });
    }

    const userId = req.user.id;

    const query = `
      SELECT duration_seconds, is_completed
      FROM video_progress 
      WHERE user_id = $1 AND video_id = $2;
    `;

    const result = await db.query(query, [userId, videoId]);
    console.log(result.rows)
    res.json({
      duration_seconds: result.rows.length > 0 ? result.rows[0].duration_seconds : 0, is_completed: result.rows[0].is_completed
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ duration_seconds: 0 });
  }
});

// app.post("/trainee/:videoId/progress", async (req, res) => {
//   try {
//     const { videoId } = req.params;
//     const { duration_seconds, chapter_id, course_id } = req.body;

//     if (!req.isAuthenticated()) {
//       return res.status(401).json({ success: false, message: "unauthorized access" });
//     }

//     if (req.user.role !== "TRAINEE") {
//       return res.status(401).json({ success: false, message: "invalid role" });
//     }

//     const userId = req.user.id;

//     // 1. Get total video duration
//     const videoData = await db.query(
//       "SELECT duration_total_seconds FROM video_items WHERE id = $1",
//       [videoId]
//     );

//     if (videoData.rows.length === 0) {
//       return res.status(404).json({ success: false, message: "Video not found" });
//     }

//     const totalDuration = videoData.rows[0].duration_total_seconds;

//     // 2. Check if already completed (so it becomes permanent)
//     const existing = await db.query(
//       "SELECT is_completed FROM video_progress WHERE user_id = $1 AND video_id = $2",
//       [userId, videoId]
//     );

//     let isCompleted = false;

//     if (existing.rows.length > 0 && existing.rows[0].is_completed === true) {
//       // Already completed → permanent, keep TRUE
//       isCompleted = true;
//     } else {
//       // Not completed before → calculate
//       isCompleted = duration_seconds >= totalDuration;
//     }

//     // 3. UPSERT with permanent completion
//     const query = `
//       INSERT INTO video_progress (user_id, video_id, chapter_id, course_id, duration_seconds, is_completed)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       ON CONFLICT (user_id, video_id)
//       DO UPDATE SET
//         duration_seconds = EXCLUDED.duration_seconds,
//         is_completed = video_progress.is_completed OR EXCLUDED.is_completed,
//         updated_at = NOW()
//       RETURNING *;
//     `;

//     const result = await db.query(query, [
//       userId,
//       videoId,
//       chapter_id,
//       course_id,
//       duration_seconds,
//       isCompleted
//     ]);

//     res.json({ success: true, data: result.rows[0] });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "DB error" });
//   }
// });






//comments
app.get("/trainee/:videoId/comments", async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(
      `SELECT 
        comments.id,
        comments.video_item_id,
        comments.user_id,
        comments.content,
        comments.created_at,
        users_info.first_name,
        users_info.surname
      FROM comments
      JOIN users_info 
      ON users_info.id = comments.user_id
      WHERE comments.video_item_id = $1
      ORDER BY comments.created_at DESC`,
      [videoId]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: 'there is a comment', data: result.rows, userId: req.user.id });
    } else {
      res.json({ success: false, message: 'there is no comment yet', data: result.rows });
    }

  } catch (error) {
    res.json(error)
  }

});
app.post("/trainee/:videoId/comments", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `INSERT INTO comments (video_item_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [videoId, req.user.id, content]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    req.json(error)
  }

});

app.post("/trainee/video/deletecomment", async (req, res) => {
  try {
    const { commentId } = req.body;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "unauthorized access" });
    }

    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: "invalid role" });
    }

    const result = await db.query(
      `DELETE FROM comments
       WHERE id = $1
       RETURNING *`,
      [commentId]
    );

    res.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    res.json({ success: false, error });
  }
});

app.get("/trainee/:commentsId/reply", async(req, res)=>{
  try {
    const {commentsId} = req.params;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `SELECT 
        replies.id,
        replies.comments_id,
        replies.user_id,
        replies.content,
        replies.created_at,
        users_info.first_name,
        users_info.surname
      FROM replies
      JOIN users_info 
      ON users_info.id = replies.user_id
      WHERE replies.comments_id = $1
      ORDER BY replies.created_at DESC`,
      [commentsId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.json({ success: false, error });
  }
})
app.post("/trainee/:commentsId/reply", async (req, res) => {
  try {
    const { commentsId } = req.params;
    const { content  } = req.body;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `INSERT INTO replies (comments_id, content, created_at, user_id)
      VALUES ($1, $2,now(), $3)
      RETURNING *`, 
      [commentsId, content, req.user.id])

     res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    req.json(error)
  }
});
app.post("/trainee/dashboard/logout", (req, res, next) => {

  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "No active session found" });
  }
  if (req.user.role !== "TRAINEE") {
    return res.status(401).json({ success: false, message: "invalid role" });
  }

  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Failed to destroy session" });

      res.clearCookie("connect.sid");
      return (res.json({ message: "Successfully logged out", redirectTo: "/" }));
    });
  });
});










passport.use(new Strategy(async function verify(username, password, cb) {
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];


      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log("Error comparing passwords:", err);
        } else {
          if (result) {
            return cb(null, user)
          } else {
            return cb(null, false, { message: "Incorrect Password" })

          }
        };
      });
    } else {
      return cb("User not found");
    };
  } catch (err) {
    return cb("error handling", err);
  };
}))



passport.serializeUser((user, cb) => {
  cb(null, user);

});

passport.deserializeUser((user, cb) => {
  cb(null, user)

});

app.listen(port, () => {
  console.log(`now listening in port :${port} http://localhost:${port}`)
})