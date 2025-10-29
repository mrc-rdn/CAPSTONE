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
    console.log(req.file.path)
    console.log(req.body)
    

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
})


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
    console.log(result.rows.length)
    if (result.rows.length === 1){
      res.json({success: true, message: 'success gathering your data', data: result.rows})
    }else{
      res.json({success: false ,messsage: 'there no video or quiz added yet', data: result.rows})
    }
    
  } catch (error) {
    res.json({success: false ,messsage: 'there no video or quiz added yet' })
  }
});

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
    console.log(result.rows.length)
    if (result.rows.length === 1){
      res.json({success: true, message: 'success gathering your data', data: result.rows})
    }else{
      res.json({success: false ,messsage: 'there no video or quiz added yet', data: result.rows})
    }
    
  } catch (error) {
    res.json({success: false ,messsage: 'there no video or quiz added yet' })
  }
})





// app.get("/admin/:chapter", async(req, res)=>{
//   const chapter_No = req.params 
//   try {
//     const query = `SELECT * FROM courses `
//   } catch (error) {
    
//   }
// })

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
})

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