import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import bcrypt from "bcrypt"
import env from 'dotenv'
import session from "express-session";
import passport from "passport";
import {Strategy} from "passport-local"

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

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // your React app's URL
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




app.post("/admin/registeraccount", async(req, res)=>{
    const {firstName, surname, contactNo, username, password, role } = req.body;   
    try{
        if(!req.isAuthenticated()){
          res.status(401).json({success: false, message: 'unauthorized access'})
        }
        if(req.user.role !== "SUPERADMIN"){
          res.status(401).json({success: false, message: 'invalid role'})
        }
        const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [username])

        if(checkResult.rows.length > 0){
            res.json({error: "Username already exists. Try logging in."})
        }else{
            if (password.length < 8) {

                res.json({error: "your password is too short"})
            }else{

                bcrypt.hash(password, saltRounds, async(err, hash)=>{
 
                    if(err){
                        res.json("Error hasing password:", err)
                    } else{
                        const usersRes = await db.query("INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *", [username, hash, role])
                
                        const users = usersRes.rows[0]
                        const userId = users.id
                        
                        const userInfoRes = await db.query("INSERT INTO users_info (id, first_name, surname, contact_no) VALUES ($1, $2, $3, $4) RETURNING *", [userId, firstName, surname, contactNo])
                        
                        res.json({success: true, message: "Account created"})
                    }
                })
            }
        }
    }catch(err){
        res.json({error: err.message })
    }
});


//admin
//admin
//admin 


// admin trainer login 

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

app.get("/admin/protectedroute", async( req, res)=>{
  try {
    if(!req.isAuthenticated()){
      res.status(401).json({success: false, message: 'Unauthorized'})
    }
    if(req.user.role !== "SUPERADMIN"){
      res.status(403).json({success: false , message: 'role is invalid'})
    }

    res.status(200).json({success: true, message: "success login"})
  } catch (error) {
    res.status(400).json({success: false, message: "Server error"})
  }
})
 

//fetching data
app.get("/admin/dashboard", async(req, res)=>{
    try{
      if(!req.isAuthenticated()){
        return res.status(401).json({success: false, message: 'Unauthorized'})
      }
      if(req.user.role !== "SUPERADMIN"){
        return res.status(403).json({success: false , message: 'Forbidden'})
      }

      const trainee = await db.query("SELECT * FROM users WHERE role = 'TRAINEE'");
      const trainer = await db.query("SELECT * FROM users WHERE role = 'TRAINER' ")
      const coursesResponse = await db.query("SELECT * FROM courses")
      res.status(200).json({
        success: true, 
        traineeCount: trainee.rows.length, 
        trainerCount:trainer.rows.length, 
        coursesCount: coursesResponse.rows.length 
      });

    }catch(err){
      res.status(500).json({message: err})
    }
});

//create course
app.post("/admin/course/createcourse", async(req, res)=>{
  const {title, description } = req.body;
 try {
  if(!req.isAuthenticated()){
    res.status(401).json({succes: false, message: "Unauthorized"})
  }
  if(req.user.role !== "SUPERADMIN"){
      res.status(403).json({succes: false, messsage:"invalid role"})
  }
    
  const response = await db.query(
    "INSERT INTO courses (title, description, created_by ) VALUES($1, $2, $3) RETURNING * ", 
    [title, description,req.user.id ])

  res.status(200).json({succes: true, data: response.rows })
 } catch (error) {
  res.status(400).json({ message: `unable to insert you data:  ${error}`, })
 }
});

//delete course
app.delete("/admin/coursedelete", async(req, res)=>{
  try {
    
  } catch (error) {
    
  }
})


//fethcing data for courses to appear to main
app.get("/admin/course", async(req, res)=>{

  try {
    if(!req.isAuthenticated()){
      res.status(401).json({success: false, messsage: 'unauthorized access' })
    }
    if(req.user.role !== "SUPERADMIN"){
      res.status(401).json({success: false, message: 'invalid role'})
    }

      const query = `SELECT * FROM courses `
      const response = await db.query(query)  
      res.status(200).json({data: response.rows})
    
  } catch (error) {
    res.status(400).json({success: error})
  }
});


//fetching data for chapter to appear according to your course
app.post("/admin/course/chapter", async(req, res)=>{
  const {course_Id} = req.body
  try {
    if(!req.isAuthenticated()){
      res.status(401).json({success: false, message: 'unauthorized access'})
    }
    if(req.user.role !== "SUPERADMIN"){
      res.status(401).json({success: false, message: 'invalid role'})
    }
    const query = 'SELECT * FROM courses JOIN chapters ON courses.id = chapters.course_id WHERE courses.id = $1'
    const response = await db.query(query,[course_Id]);
    res.status(200).json({success: true, data: response.rows, chapterLength: response.rows.length})

  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
}) 


//create chapter
app.post("/admin/course/addchapter", async(req, res)=>{
  const {course_id, chapter_name, description, chapter_no} = req.body
  try {
    if(!req.isAuthenticated()){
      res.status(401).json({success: false, message: 'unauthorized access'})
    }
    if(req.user.role !== "SUPERADMIN"){
      res.status(403).json({success: false, message: 'invalid role'})
    }

    // const courseIdInt =parseInt(course_id);
    // const orderIndex = parseInt(chapter_no)
    const date = new Date();
    const time = date.toLocaleTimeString();
    const response = await db.query(
      "INSERT INTO chapters (course_id, title, description, order_index, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING * ",
      [course_id, chapter_name, description, chapter_no, time ]
    )
    res.status(200).json({success: true, data: response.rows[0]})
     
      
    } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
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
app.delete("/admin/course/deletechapter", async(req, res)=>{
  try {
    
  } catch (error) {
    
  }
})


// to upload videos
app.post("/admin/chapter/uploadvideo", uploadVideo.single("video"), async (req, res) => {
  //const activityNumber = req.params;
 try {
    const {title, course_id, order_index, chapter_id} = req.body;
    if(!req.isAuthenticated()){
      return res.status(401).json({success: false, messsage: 'unauthorized access' })
    }
    if(req.user.role !== "SUPERADMIN"){
      return res.status(401).json({success: false, message: 'invalid role'})
    }
    if(!req.file){
      return res.status(400).json({succes: false, message: "No file uploaded"})
    }
    
    

    const query = 'INSERT INTO chapter_items ( title, item_type, source_url, order_index, required,created_at, course_id, chapter_id) VALUES ($1, $2, $3, $4, $5, now(), $6, $7) RETURNING*'
    const values = [ title, 'VIDEO', req.file.path, order_index , true, course_id, chapter_id  ]
    //const response = await db.query("INSERT INTO chapter_items ( title, item_type, source_url, order_index, required,created_at, course_id, chapter_id) VALUES ('title', 'VIDEO', 'dfasdfasdf', 1, True, now(), 2, 25)")
    const response = await db.query(query, values)
    res.json({success: true,  message: `File received successfully` , data: response})
 } catch (error) {
    res.json({success: false, message: 'Failed Uploading'})
 }
});

app.delete("/admin/deletevideo", async(req, res)=>{
  try {
    
    const result = await cloudinary.uploader.destroy(
    'elearning_videos/video_1760977544634_29c492c5-d1f5-4e88-bd1a-79b3a289b323.mp4',
  { resource_type: "video" } // ← important kapag video
);
    console.log(result)
  } catch (error) {
    console.log(error)
  }
});

//to create a quiz
app.post("/admin/chapter/createquiz", async (req, res) => {
  const { chapter_id, title, questions } = req.body;

  try {

     if(!req.isAuthenticated()){
      return res.status(401).json({success: false, messsage: 'unauthorized access' })
    }
    if(req.user.role !== "SUPERADMIN"){
      return res.status(401).json({success: false, message: 'invalid role'})
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
    if(!req.isAuthenticated()){
      return res.status(401).json({success: false, messsage: 'unauthorized access' })
    }
    if(req.user.role !== "SUPERADMIN"){
      return res.status(401).json({success: false, message: 'invalid role'})
    }
    const quizzes = await db.query(
      "SELECT quizzes.id AS quiz_id, quizzes.chapter_id, questions.id AS question_id, questions.question_text, questions.type, questions.correct_answer, choices.id AS choice_id, choices.choice_text, choices.is_correct FROM quizzes JOIN questions ON quizzes.id = questions.quiz_id LEFT JOIN choices ON questions.id = choices.question_id WHERE quizzes.chapter_id = $1 ORDER BY questions.id, choices.id",
      [chapterId]
    );

    if(quizzes.rows.length > 1){
      res.json({success: true , data:quizzes.rows});
    }else(
      res.json({success: false , message: 'there is no quiz yet'})
    )
    
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false , error: "Error fetching quizzes" });
  }
});


// this part is for getting the chapteritems to retrieve the video
app.post("/admin/chapter/chapteritems", async(req, res)=>{
  
  try {
    const {courseId, chapterId} = req.body
    if(!req.isAuthenticated()){
      res.status(401).json({success: false, messsage: 'unauthorized access' })
    }
    if(req.user.role !== "SUPERADMIN"){
      res.status(401).json({success: false, message: 'invalid role'})
    }
    const query = `SELECT * FROM chapters JOIN chapter_items ON chapters.id = chapter_items.chapter_id WHERE chapters.course_id = $1 AND chapter_items.chapter_id = $2`
    const value = [courseId, chapterId]
    const result = await db.query(query, value);
    
    if (result.rows.length === 1){
      res.json({success: true, message: 'success gathering your data', data: result.rows})
    }else{
      res.json({success: false ,messsage: 'there no video or quiz added yet', data: result.rows})
    }
    
  } catch (error) {
    res.json({success: false ,messsage: 'there no video or quiz added yet' })
  }
});

// fetching the first data inside the chapter so if you open the course it will appear automatically 
app.post("/admin/chapter/chapterfirstitem", async(req, res)=>{
  try {
    const {courseId} = req.body
    if(!req.isAuthenticated()){
      res.status(401).json({success: false, messsage: 'unauthorized access' })
    }
    if(req.user.role !== "SUPERADMIN"){
      res.status(401).json({success: false, message: 'invalid role'})
    }
    const query = `SELECT * FROM chapters JOIN chapter_items ON chapters.id = chapter_items.chapter_id WHERE chapters.course_id = $1 AND chapter_items.order_index = $2`
    const value = [courseId, 1]
    const result = await db.query(query, value);
    
    if (result.rows.length === 1){
      res.json({success: true, message: 'success gathering your data', data: result.rows})
    }else{
      res.json({success: false ,messsage: 'there no video or quiz added yet', data: result.rows})
    }
    
  } catch (error) {
    res.json({success: false ,messsage: 'there no video or quiz added yet' })
  }
});




//error
//error
//error

//enroll your trainer into the course
app.post("/admin/course/enroll", async(req, res)=>{
  
  try {
    const {courseId, studentId, studentName} = req.body;
    if(!req.isAuthenticated()){
      res.status(401).json({success: false, messsage: 'unauthorized access' })
    }
    if(req.user.role !== "SUPERADMIN"){
      res.status(401).json({success: false, message: 'invalid role'})
    }

    const query = 'INSERT INTO enrollments (course_id, student_id, batch) VALUES ($1, $2, $3)'
    const values = [courseId, studentId, studentName]
    const result = await db.query(query, values)
    
    res.json({success: true, message: 'success enrollment', data: result.rows})
    
    
  } catch (error) {
    res.status(400).json({success: false ,messsage: 'failed enrollment please check', error: error })
  }
})


app.post("/admin/dashboard/logout", (req, res, next) => {

  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "No active session found" });
  }

  req.logout( (err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Failed to destroy session" });

      res.clearCookie("connect.sid");
      return(res.json({ message: "Successfully logged out", redirectTo: "/" }));
    });
  });
});



//trainer
//trainer
//trainer

// login trainer side


// this will get all the data in your crediatials after you login 
app.get("/trainer/dashboard", async(req, res)=>{
    
    try{
      if(req.isAuthenticated()){
        if(req.user.role === "TRAINER"){
          const response = await db.query("SELECT * FROM users JOIN users_info ON users.id = users_info.id WHERE username = $1",[req.user.username])
          const TRAINEEcount = await db.query("SELECT * FROM users WHERE role = $1", ['TRAINEE']);
          
          const totalTrainee = TRAINEEcount.rows
          
          res.json({success: true, user: response.rows[0], totalTrainee: totalTrainee.length ,})
        }else{
          return res.json({success: false , message: 'role is invalid'})
        }
        
      }else{
        res.json({success: false})
      }
    }catch(err){
      res.status(400).json({message: err})
    }
   
        
       
});
//
//log out trainer side
app.post("/trainer/dashboard/logout", (req, res, next) => {

  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "No active session found" });
  }

  req.logout( (err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Failed to destroy session" });

      res.clearCookie("connect.sid");
      return(res.json({ message: "Successfully logged out", redirectTo: "/" }));
    });
  });
});




//trainee
//trainee
//trainee

//login for trainee
app.post("/trainee/login",passport.authenticate('local'), (req, res)=>{
  try {
    if(req.user.role === "TRAINEE"){
      res.json({success: true, redirectTo: "/trainee/dashboard"})
    } else{
      res.json({success: false, message: "role is invalid"})
    }
  } catch (error) {
    console.log(error)
  }
  
})


// //getting a certain data of users
app.get("/trainee/dashboard", async(req, res)=>{
  
    try{
      if(req.isAuthenticated()){
        if(req.user.role === "TRAINEE"){
          const response = await db.query("SELECT role, username, users.id, first_name, surname FROM users JOIN users_info ON users.id = users_info.id WHERE username = $1",[req.user.username])

          res.json({success: true, data: response.rows[0]})
        }else{
          return res.json({success: false , message: 'role is invalid'})
        }
        
      }else{
        res.json({success: false})
      }
    }catch(err){
      res.status(400).json({message: err})
    }
});

//part is to scan the enrolled course and load it into trainee course
app.get("/trainee/course", async(req, res)=>{

  try {
    if(!req.isAuthenticated()){
    res.status(401).json({success: false, messsage: 'unauthorized access' })
    }
    if(req.user.role !== "TRAINEE"){
      res.status(401).json({success: false, message: 'invalid role'})
    }
    const query = "SELECT * FROM enrollments JOIN users ON users.id = enrollments.student_id JOIN courses ON courses.id = enrollments.course_id WHERE users.id = $1"
    const value = [req.user.id];

    const result = await db.query(query, value)
    if(result.rows.length === 0){
      res.status(400).json({success: false , message: 'your not enrolled yet'})
    }else{
      res.status(200).json({success: true , message: 'your enrolled already', data: result.rows})
    }
    
  } catch (error) {
    res.json({success: false ,messsage: `unsuccessful query there is an error ${error} ` })
  }
});

//to fetch show the available chapter in the course
app.post("/trainee/course/chapter", async(req, res)=>{
  const {course_Id} = req.body
  try {
    if(!req.isAuthenticated()){
      res.status(401).json({success: false, message: 'unauthorized access'})
    }
    if(req.user.role !== "TRAINEE"){
      res.status(401).json({success: false, message: 'invalid role'})
    }
    const query = 'SELECT * FROM courses JOIN chapters ON courses.id = chapters.course_id WHERE courses.id = $1'
    const response = await db.query(query,[course_Id]);
    res.status(200).json({success: true, data: response.rows, chapterLength: response.rows.length})

  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
}); 

//to fetch the items inside the chapter
app.post("/trainee/chapter/chapteritems", async(req, res)=>{
  
  try {
    const {courseId, chapterId} = req.body
    if(!req.isAuthenticated()){
      res.status(401).json({success: false, messsage: 'unauthorized access' })
    }
    if(req.user.role !== "SUPERADMIN"){
      res.status(401).json({success: false, message: 'invalid role'})
    }
    const query = `SELECT * FROM chapters JOIN chapter_items ON chapters.id = chapter_items.chapter_id WHERE chapters.course_id = $1 AND chapter_items.chapter_id = $2`
    const value = [courseId, chapterId]
    const result = await db.query(query, value);
    
    if (result.rows.length === 1){
      res.json({success: true, message: 'success gathering your data', data: result.rows})
    }else{
      res.json({success: false ,messsage: 'there no video or quiz added yet', data: result.rows})
    }
    
  } catch (error) {
    res.json({success: false ,messsage: 'there no video or quiz added yet' })
  }
});

app.post("/trainee/dashboard/logout", (req, res, next) => {

  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "No active session found" });
  }

  req.logout( (err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Failed to destroy session" });

      res.clearCookie("connect.sid");
      return(res.json({ message: "Successfully logged out", redirectTo: "/" }));
    });
  });
});









passport.use(new Strategy(async function verify(username, password, cb){
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        
    
        bcrypt.compare(password, user.password, (err, result)=> {
          if(err){
            console.log("Error comparing passwords:", err);
          }else {
            if(result){
              return cb(null, user)
            }else{
              return cb(null, false, {message: "Incorrect Password"}) 
              
            }
          };
        });
      } else {
        return cb("User not found");
      };
    }catch (err) {
      return cb("error handling", err);
    };
}))



passport.serializeUser((user, cb) =>{
  cb(null, user);
  
});

passport.deserializeUser((user, cb) =>{
  cb(null, user)
  
});

app.listen(port, ()=>{
    console.log(`now listening in port :${port} http://localhost:${port}`)
})