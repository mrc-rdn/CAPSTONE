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
import http from "http";    
import { Server } from "socket.io";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleGenAI } from "@google/genai";
env.config();


const app = express();
const port = 3000;
const saltRounds = parseInt(process.env.SALTED_ROUNDS);
const server = http.createServer(app);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});



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


const UploadProfile = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_Pic", // folder para sa images
    resource_type: "image", // importante para sa jpg/png/gif
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    public_id: (req, file) => `image_${Date.now()}_${file.originalname}`,
  },
});

const UploadImageProfile = multer({ storage: UploadProfile });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const frontendURL = process.env.NODE_ENV === "developmen"
  ? "https://capstone-deployment-seven.vercel.app"
  : "http://localhost:5173"

app.use(cors({
  origin: frontendURL,
  credentials: true,
}))



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

const io = new Server(server, {
  cors: { 
    origin: frontendURL,
    methods: ["GET", "POST"],
    credentials: true
  }
});
  
app.set("io", io);


function generateNumericId() {
  return Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);
}




// Automatic na babasahin nito ang process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: `
        SYSTEM RULES (STRICT):
        1. Role: E-Kabuhayan LMS Assistant (Parañaque PLRMO).
        2. Scope: E-Kabuhayan LMS, PLRMO training programs, and enrollment access only.
        3. Restriction: Kapag ang tanong ay labas sa system (hal. sports, general coding), magalang na tumanggi at ituro ang usapan pabalik sa E-Kabuhayan.
        4. Tone: Friendly Taglish.

        OFFERED PROGRAMS (COURSES):
        Dito lamang pwedeng mamili ang mga residente:
        - Food Processing
        - Pastry Making
        - Dressmaking
        - Electrical Work
        - Handicrafts

        UNIFIED ENROLLMENT & REGISTRATION PROCESS:
        - STEP 1: Pumunta sa official PLRMO Facebook Page (ito ang tanging paraan).
        - STEP 2: Ibigay ang personal details at piliin ang kursong nais (Food Processing, Pastry Making, etc.).
        - STEP 3: Ang PLRMO staff ang gagawa ng account para sa user.
        - STEP 4: Pagkatapos magawa ang account, doon pa lang pwedeng mag-login sa E-Kabuhayan LMS website para mag-aral.
        - Reminder: Walang "Sign Up" o "Self-Enroll" sa website dashboard. Lahat ay manual na ginagawa ng PLRMO.

        KNOWLEDGE BASE:
        - Ang E-Kabuhayan ay para sa upskilling at employment ng mga taga-Parañaque.
        - Features: Modular learning, quizzes, monitoring, at certification.
        - Access: FREE para sa registered residents.

        USER QUESTION: ${question}
      `,
    });

    res.json({ answer: response.text });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).send("AI error.");
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // 1️⃣ Hanapin ang user via email
  const userInfo = await db.query(
    "SELECT id FROM users_info WHERE email = $1",
    [email]
  );

  if (userInfo.rows.length === 0) {
    return res.json({ message: "Reset link sent if email exists" });
  }

  const userId = userInfo.rows[0].id;

  // 2️⃣ Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  // 3️⃣ Update users table using ID
  await db.query(
    `UPDATE users
     SET reset_token = $1,
         reset_token_expiry = $2
     WHERE id = $3`,
    [token, expiry, userId]
  );

  // 4️⃣ Send email
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"LMS Support" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      
      <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Transporter Notification</title>
                  <style>
                    body {
                      margin: 0;
                      padding: 0;
                      background-color: #FFF1CA;
                      font-family: Arial, sans-serif;
                    }
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #FFFFFF;
                      border-radius: 10px;
                      overflow: hidden;
                      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    }
                    .header {
                      background-color: #2D4F2B;
                      color: #FFF1CA;
                      padding: 20px;
                      text-align: center;
                      font-size: 24px;
                      font-weight: bold;
                    }
                    .body {
                      padding: 20px;
                      color: #2D4F2B;
                      line-height: 1.6;
                    }
                    .body h2 {
                      color: #708A58;
                    }
                    .button {
                      display: inline-block;
                      background-color: #FFB823;
                      color: #2D4F2B;
                      padding: 12px 25px;
                      margin: 20px 0;
                      border-radius: 5px;
                      text-decoration: none;
                      font-weight: bold;
                    }
                    .footer {
                      background-color: #708A58;
                      color: #FFF1CA;
                      text-align: center;
                      padding: 15px;
                      font-size: 14px;
                    }
                    @media screen and (max-width: 600px) {
                      .container {
                        width: 100% !important;
                        border-radius: 0;
                      }
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      E-KABUHAYAN Notification
                    </div>
                    <div class="body">
                      <h3>Password Reset</h3>
                      <p>Click the link below to change your password:</p>
                      <p>This link expires in 15 minutes.</p>
                      <a href="${resetLink}">${resetLink}</a>
                     
                    </div>
                    <div class="footer">
                      &copy; 2026 E-KABUHAYAN All rights reserved.
                    </div>
                  </div>
                </body>
                </html>
    `
  });

  res.json({ message: "Reset link sent" });
});




app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await db.query(
    `SELECT id FROM users
     WHERE reset_token = $1
     AND reset_token_expiry > NOW()`,
    [token]
  );

  if (user.rows.length === 0) {
    return res.status(400).json({
      message: "Invalid or expired link"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    `UPDATE users
     SET password = $1,
    reset_token = NULL,
    reset_token_expiry = NULL
     WHERE id = $2`,
    [hashedPassword, user.rows[0].id]
  );

  res.json({ message: "Password updated successfully" });
});



//resgiter account of trainer and trainee
app.post("/admin/registeraccount", async (req, res) => {
  const { firstName, surname, contactNo, username, password, role, color, shade } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [username])
    const checkEmail = await db.query("SELECT * FROM users_info WHERE email = $1", [contactNo])

    if (checkResult.rows.length > 0 ) {
      res.json({ success: false, error: "Username already exists. Try logging in." })
    }else if(checkEmail.rows.length > 0){
      res.json({ success: false, error: "Email already exists. Try logging in." })
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

            const userInfoRes = await db.query("INSERT INTO users_info (id, first_name, surname, email, color, shades) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [userId, firstName, surname, contactNo, color, shade])
              await transporter.sendMail({
              from: `"LMS Support" <${process.env.GMAIL_USER}>`,
              to: contactNo,
              subject: "Accout Created",
              html: `
               <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Transporter Notification</title>
                  <style>
                    body {
                      margin: 0;
                      padding: 0;
                      background-color: #FFF1CA;
                      font-family: Arial, sans-serif;
                    }
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #FFFFFF;
                      border-radius: 10px;
                      overflow: hidden;
                      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    }
                    .header {
                      background-color: #2D4F2B;
                      color: #FFF1CA;
                      padding: 20px;
                      text-align: center;
                      font-size: 24px;
                      font-weight: bold;
                    }
                    .body {
                      padding: 20px;
                      color: #2D4F2B;
                      line-height: 1.6;
                    }
                    .body h2 {
                      color: #708A58;
                    }
                    .button {
                      display: inline-block;
                      background-color: #FFB823;
                      color: #2D4F2B;
                      padding: 12px 25px;
                      margin: 20px 0;
                      border-radius: 5px;
                      text-decoration: none;
                      font-weight: bold;
                    }
                    .footer {
                      background-color: #708A58;
                      color: #FFF1CA;
                      text-align: center;
                      padding: 15px;
                      font-size: 14px;
                    }
                    @media screen and (max-width: 600px) {
                      .container {
                        width: 100% !important;
                        border-radius: 0;
                      }
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      E-KABUHAYAN Notification
                    </div>
                    <div class="body">
                      <h2>Hello ${firstName} ${surname}, you are a ${role}!</h2>
                      <p>We would like to inform you that your account has been created. Please log in to access your account.</p>
                      <p><strong>Username:</strong> ${username}</p>
                      <p><strong>Password:</strong>${password} </p>
                      <a href="${frontendURL}" class="button">Login</a>
                      <p>Thank you for your inquiry</p
                    </div>
                    <div class="footer">
                      &copy; 2026 E-KABUHAYAN All rights reserved.
                    </div>
                  </div>
                </body>
                </html>

              `
            });

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

// Create chat between 2 users



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
    const trainer = await db.query("SELECT * FROM users WHERE role = 'TRAINER' ");
    const userInfo = await db.query("SELECT * FROM users_info WHERE id = $1", [req.user.id])
    const coursesResponse = await db.query("SELECT * FROM courses")
    const username = await db.query("SELECT * FROM users WHERE id = $1 ",[req.user.id])
    res.status(200).json({
      success: true,
      traineeCount: trainee.rows.length,
      trainerCount: trainer.rows.length,
      coursesCount: coursesResponse.rows.length, 
      usersInfo: userInfo.rows[0],
      username: req.user.username,
      color:userInfo.rows[0].color,
      shade:userInfo.rows[0].shades

    });

  } catch (err) {
    res.status(500).json({ message: err })
  }
});

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
//delete the data inside
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
//fetching data for upcoming event for a month 
app.post('/admin/dashboard/upcomingschedule', async(req,res)=>{
  
  try {
    const {date1, date2} = req.body
   
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM calendar_events WHERE user_id = $1 AND event_date >= $2 AND event_date <  $3`
    const values = [ req.user.id, date1, date2]

    const result = await db.query(query, values)
    res.json({success: true, data: result.rows})
    
  } catch (error) {
    
  }
})

app.post('/admin/EditProfile/UploadProfile', UploadImageProfile.single('image'), async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    if (!req.file) {
      return res.status(400).json({ succes: false, message: "No file uploaded" })
    }
    const query = 'UPDATE users_info SET profile_pic = $1 WHERE id = $2'
    const values = [req.file.path, req.user.id]
    const response = await db.query(query, values)
    res.json({ success: true, message: `File received successfully`, data: response.rows })
    console.log(response)
  } catch (error) {
    res.json({ success: false, message: 'Failed Uploading' })
  }
});
app.post("/admin/edituserinfo", async (req, res) => {
  const { firstName, surname, contactNo, password } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [req.user.username])

    if (checkResult.rows.length < 0) {
      res.json({ success: false, error: "Username already exists." })
    } else {
      if (password.length < 8) {

        res.json({ error: "your password is too short" })
      } else {

        bcrypt.hash(password, saltRounds, async (err, hash) => {

          if (err) {
            res.json("Error hasing password:", err)
          } else {
            const usersRes = await db.query("UPDATE users SET password = $1 WHERE id = $2", [ hash, req.user.id])

            

            const userInfoRes = await db.query(
              `UPDATE users_info 
                SET first_name = $1, 
                surname = $2, 
                email = $3
              WHERE id = $4`, [ firstName, surname, contactNo, req.user.id])

            res.json({ success: true, message: "Account created" })
          }
        })
      }
    }
  } catch (err) {
    res.json({ error: err.message })
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

//fetch the data on your course how many enrolled on your course
app.get("/admin/:courseId/enrolled", async(req, res)=>{
  const {courseId} = req.params
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM enrollments WHERE course_id = $1`
    const value = [courseId]
    const response = await db.query(query,value)
    res.status(200).json({ success: true, data: response.rows })

  } catch (error) {
    res.status(400).json({ success: error })
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
// to upload image
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

//delete content
app.delete("/admin/course/deletecontent", async (req, res) => {
  try {
    const { isVideo, isQuiz, isCertificate,isText, videoData, quizData, certificateData, textData } = req.body
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

    if(isCertificate){
      const certificate = await db.query(`DELETE FROM certificate WHERE id = $1`, [certificateData[0].id])
    }
    if(isText){
      await db.query(`DELETE FROM text_editor WHERE id = $1`, [textData[0].id])
    }
    console.log(isVideo, isQuiz,isCertificate, quizData, videoData, certificateData)
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
        u.first_name,
        u.surname,
        u.profile_pic,
        u.color,
        u.shades
      FROM comments
      JOIN users_info AS u
      ON u.id = comments.user_id
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
        u.first_name,
        u.surname,
        u.profile_pic,
        u.color,
        u.shades
      FROM replies
      JOIN users_info As u
      ON u.id = replies.user_id
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

app.post("/admin/deletereply/:replyId", async (req,res)=>{
  try {
    const { replyId } = req.params;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `DELETE FROM replies WHERE id = $1`, 
      [replyId])

     res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    req.json(error)
  }
})

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


//posting text editor 
app.post('/admin/texteditor', async (req, res) => {
    const { title, courseId, chapterId, content } = req.body;
    try {
      if (!req.isAuthenticated()) {
        res.status(401).json({ success: false, messsage: 'unauthorized access' })
      }
      if (req.user.role !== "SUPERADMIN") {
        res.status(401).json({ success: false, message: 'invalid role' })
      }
        const result = await db.query(
            'INSERT INTO text_editor (user_id, course_id , chapter_id , title, content) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, courseId,  chapterId,  title, content]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving post');
    }
});
//get the data fo text presenter
app.get('/admin/texteditor/:courseId/:chapterId', async (req, res) => {
  const { courseId, chapterId } = req.params;
    try {
      if (!req.isAuthenticated()) {
        res.status(401).json({ success: false, messsage: 'unauthorized access' })
      }
      if (req.user.role !== "SUPERADMIN") {
        res.status(401).json({ success: false, message: 'invalid role' })
      }
        const result = await db.query('SELECT * FROM text_editor WHERE course_id = $1 AND chapter_id = $2', [courseId, chapterId]);
        if(result.rows.length > 0 ){
          res.json({ success: true, data: result.rows });
        }else{
          res.json({ success: false });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching posts');
    }
  }
);

//certificate upload
app.post("/admin/chapter/addcertificate", async (req, res) => {

  try {
    const { courseId, chapterId, title } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `INSERT INTO certificate ( is_certificate,chapter_id,course_id, title) VALUES ($1, $2, $3, $4) RETURNING*`
    const value = [true, chapterId, courseId, title]
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
app.get("/admin/:courseId/:chapterId/getcertificate", async (req, res) => {

  try {
    const { courseId, chapterId } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
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



//trainee info
app.get('/admin/:courseId/trainee', async (req, res) => {
  try {
    const { courseId } = req.params
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
    ORDER BY users_info.surname ASC;`, [courseId])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//video progress
app.get('/admin/:courseId/:chapterId/traineevideoprogress', async (req, res) => {
  try {
    const { courseId, chapterId } = req.params
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
    ORDER BY users_info.surname ASC;`, [courseId, chapterId])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//quizprogress
app.get('/admin/:courseId/:chapterId/traineequizprogress', async (req, res) => {
  try {
    const { courseId, chapterId } = req.params
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
        ORDER BY users_info.surname ASC;`, [chapterId, courseId])
    const quizLength = await db.query(`SELECT * FROM quizzes
      JOIN questions
      ON questions.quiz_id = quizzes.id
      WHERE quizzes.chapter_id = $1`, [chapterId])

    res.status(200).json({ success: true, message: 'succesful query', data: result.rows, quizLength: quizLength.rows.length })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//iamgeprogress
app.get('/admin/:courseId/:chapterId/traineeimageprogress', async (req, res) => {
  try {
    const { courseId, chapterId } = req.params
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
    ORDER BY users_info.surname ASC;`, [courseId, chapterId])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//render the data in to excel
app.post('/admin/:courseId/excelrender', async (req, res) => {
  try {
    const { courseId } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

       const result = await db.query(`
      SELECT 
        ucp.user_id,
        ucp.chapter_id,
		chapters.title,
        ucp.is_done,
        ui.first_name,
        ui.surname
      FROM user_chapter_progress ucp
      JOIN users_info ui ON ui.id = ucp.user_id
	 JOIN chapters ON ucp.chapter_id = chapters.id
      WHERE ucp.course_id = $1
        
      ORDER BY chapters.order_index ASC
    `, [courseId, ]);

    res.json({ success: true, data: result.rows });

  } catch (error) {
    res.json({ success: false, error })
  }
});

app.get('/admin/MasterList', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'unauthorized access' })
    }

    if (req.user.role !== "SUPERADMIN") {
      return res.status(403).json({ success: false, message: 'invalid role' })
    }

    const role = req.query.role || null
    const courseId = req.query.course || null
    const result = await db.query(`
      SELECT 
        u.id,
        ui.first_name,
        ui.surname,
        u.role,
        ui.profile_pic,
        ui.color,
        ui,shades,
        COALESCE(e.course_id, c.id) AS course_id
      FROM users u
      JOIN users_info ui 
        ON u.id = ui.id
      LEFT JOIN enrollments e 
        ON u.id = e.student_id
      LEFT JOIN courses c
        ON c.created_by = u.id
      WHERE
        ($1::text IS NULL OR u.role = $1::text)
        AND ($2::int IS NULL OR e.course_id = $2::int OR c.id = $2::int)
      ORDER BY ui.surname ASC;
    `, [role, courseId])

    res.json({ success: true, data: result.rows })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'error query' })
  }
})



app.get('/admin/MasterList/traineeprogress', async (req, res) => {
  try {
    const { courseId } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

       const result = await db.query(`
      SELECT 
        ucp.user_id,
        ucp.course_id,
        c.title,
        ucp.chapter_id,
		   
        ucp.is_done,
        ui.first_name,
        ui.surname
        
      FROM user_chapter_progress ucp
      JOIN users_info ui ON ui.id = ucp.user_id
      JOIN courses c ON c.id = ucp.course_id 
	    
      ORDER BY ui.surname ASC
    `,);

    res.json({ success: true, data: result.rows });

  } catch (error) {
    res.json({ success: false, error })
  }
});

// traine user progress chapter
app.get("/admin/traineeprogress/:courseId/:chapterId", async(req, res)=>{
  try {
    const { courseId, chapterId } = req.params;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`
      SELECT 
        ucp.id, 
        ucp.user_id, 
        ucp.course_id, 
        ucp.course_id, 
        ucp.is_done,
	      ui.first_name, 
        ui.surname  
      FROM user_chapter_progress AS ucp
      JOIN users_info AS ui
        ON ui.id = ucp.user_id
      WHERE course_id = $1 AND chapter_id = $2
      ORDER BY surname ASC`, [courseId, chapterId])
    return res.json({success:true, data: result.rows})
  } catch (error) {
    res.json({ success: false, error })
  }
}),

app.get('/admin/publishcountcourses', async (req, res) => {
  try {
    const { courseId, chapterId } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`
      SELECT
        c.id,
        c.title,
        EXISTS (
          SELECT 1
          FROM enrollments e
          WHERE e.course_id = c.id
        ) AS has_enrollments
      FROM courses c;`)
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});

app.get("/admin/announcement/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `SELECT a.id, a.course_id, a.user_id, 
          a.title, a.message, a.created_at, 
          u.first_name, u.surname ,u.color, u.shades,
          u.profile_pic FROM announcements  AS a
        JOIN users_info AS u
        ON u.id = a.user_id
        WHERE course_id = $1
        ORDER BY created_at DESC `,
      [courseId]
    );
    res.json(result.rows);
    
  } catch (error) {
    res.json({ success: false, error })
  }
  
});

// POST a new notification (from admin or system)
app.post("/admin/announcement", async (req, res) => {
  try {
    const {courseId, title, message } = req.body;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(`
      INSERT INTO announcements
      (user_id, course_id, title, message, read, created_at)
      VALUES ($1, $2, $3, $4, false, NOW())
      RETURNING *
      `,
      [req.user.id,courseId,title,message]
    );
    res.json(result.rows[0]);
    
  } catch (error) {
    res.json({ success: false, error })
  }
 
});

app.delete("/admin/announcement/delete/:id", async(req, res)=>{
  try {
    const {id} = req.params
    if (!req.isAuthenticated()) {
        res.status(401).json({ success: false, messsage: 'unauthorized access' })
      }
      if (req.user.role !== "SUPERADMIN") {
        res.status(401).json({ success: false, message: 'invalid role' })
      }

      await db.query(
      "DELETE FROM announcements WHERE id = $1",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });

  } catch (error) {
     console.error(err);
        res.status(500).send('Error saving post');
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
app.get("/trainer/protectedroute", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(403).json({ success: false, message: 'role is invalid' })
    }

    res.status(200).json({ success: true, message: "success login" })
  } catch (error) {
    res.status(400).json({ success: false, message: "Server error" })
  }
})

// this will get all the data in your crediatials after you login 
app.get("/trainer/dashboard", async (req, res) => {

  try {
    if (req.isAuthenticated()) {
      if (req.user.role === "TRAINER") {
        const response = await db.query("SELECT * FROM users JOIN users_info ON users.id = users_info.id WHERE username = $1", [req.user.username])
        const TRAINEEcount = await db.query("SELECT * FROM users WHERE role = $1", ['TRAINEE']);

        const totalTrainee = TRAINEEcount.rows
        const userInfo = await db.query("SELECT * FROM users_info WHERE id = $1", [req.user.id])
       

        res.json({ success: true, 
          user: response.rows[0],
          usersInfo:userInfo.rows[0], 
          username: req.user.username,
          totalTrainee: totalTrainee.length, 
          color:userInfo.rows[0].color,
          shade:userInfo.rows[0].shades})



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
app.post('/trainer/dashboard/upcomingschedule', async(req,res)=>{
  
  try {
    const {date1, date2} = req.body
   
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM calendar_events WHERE user_id = $1 AND event_date >= $2 AND event_date <  $3`
    const values = [ req.user.id, date1, date2]

    const result = await db.query(query, values)
    res.json({success: true, data: result.rows})
    
  } catch (error) {
    
  }
})

app.post('/trainer/EditProfile/UploadProfile', UploadImageProfile.single('image'), async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    if (!req.file) {
      return res.status(400).json({ succes: false, message: "No file uploaded" })
    }
    const query = 'UPDATE users_info SET profile_pic = $1 WHERE id = $2'
    const values = [req.file.path, req.user.id]
    const response = await db.query(query, values)
    res.json({ success: true, message: `File received successfully`, data: response.rows })
    console.log(response)
  } catch (error) {
    res.json({ success: false, message: 'Failed Uploading' })
  }
});
app.post("/trainer/edituserinfo", async (req, res) => {
  const { firstName, surname, contactNo, password } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [req.user.username])

    if (checkResult.rows.length < 0) {
      res.json({ success: false, error: "Username already exists." })
    } else {
      if (password.length < 8) {

        res.json({ error: "your password is too short" })
      } else {

        bcrypt.hash(password, saltRounds, async (err, hash) => {

          if (err) {
            res.json("Error hasing password:", err)
          } else {
            const usersRes = await db.query("UPDATE users SET password = $1 WHERE id = $2", [ hash, req.user.id])

            

            const userInfoRes = await db.query(
              `UPDATE users_info 
                SET first_name = $1, 
                surname = $2, 
                email = $3
              WHERE id = $4`, [ firstName, surname, contactNo, req.user.id])

            res.json({ success: true, message: "Account created" })
          }
        })
      }
    }
  } catch (err) {
    res.json({ error: err.message })
  }
});

//create course
app.post("/trainer/course/createcourse", async (req, res) => {
  const { title, description, image } = req.body;
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

//fetch the data courses to appear in trainer side this appear where you are assigned to
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

//fetch the data on your course how many enrolled on your course
app.get("/trainer/:courseId/enrolled", async(req, res)=>{
  const {courseId} = req.params
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM enrollments WHERE course_id = $1`
    const value = [courseId]
    const response = await db.query(query,value)
    res.status(200).json({ success: true, data: response.rows })

  } catch (error) {
    res.status(400).json({ success: error })
  }
})
//fetching chapters data to appear according to your course
app.get("/trainer/course/:courseId", async (req, res) => {
  const { courseId } = req.params
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = 'SELECT * FROM courses JOIN chapters ON courses.id = chapters.course_id WHERE courses.id = $1 ORDER BY order_index ASC'
    const response = await db.query(query, [courseId]);
    res.status(200).json({ success: true, data: response.rows, chapterLength: response.rows.length })

  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
})

// fetching the data inside the chapter so if you open or click the course it will appear automatically 
//course chapters.jsx
app.get("/trainer/course/:chapterindex/:courseId", async (req, res) => {
  try {
    const { chapterindex, courseId } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
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
//create chapter
app.post("/trainer/course/addchapter", async (req, res) => {
  const { courseId, chapterName, description, chapterIndex } = req.body
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
      [courseId, chapterName, description, chapterIndex, time]
    )
    res.status(200).json({ success: true, data: response.rows[0] })


  } catch (error) {
    res.status(400).json({ message: `unable to insert you data:  ${error}`, })
  }
});

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
    const query = 'INSERT INTO video_items ( title, source_url, required,created_at, course_id, chapter_id , item_type) VALUES ($1, $2, $3, now(), $4, $5, $6) RETURNING*'
    const values = [title, req.file.path, false, course_id, chapter_id, 'VIDEO']
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
    if (!req.file.path) {
      return res.status(400).json({ success: false, message: "No file uploaded" })
    }
    const query = 'INSERT INTO video_items ( title, source_url, required,created_at, course_id, chapter_id, item_type) VALUES ($1, $2, $3,now(), $4,  $5, $6) RETURNING*'
    const values = [title, req.file.path, true, course_id, chapter_id, "IMAGE"]
    const response = await db.query(query, values)
    res.json({ success: true, message: `File received successfully`, data: response.rows })
    console.log(response)
  } catch (error) {
    res.json({ success: false, message: 'Failed Uploading' })
  }
});

//delete content
app.delete("/trainer/course/deletecontent", async (req, res) => {
  try {
    const { isVideo, isQuiz, isCertificate,isText, videoData, quizData, certificateData, textData } = req.body
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

    if(isCertificate){
      const certificate = await db.query(`DELETE FROM certificate WHERE id = $1`, [certificateData[0].id])
    }
    if(isText){
      await db.query(`DELETE FROM text_editor WHERE id = $1`, [textData[0].id])
    }
    console.log(isVideo, isQuiz,isCertificate, quizData, videoData, certificateData)
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
        u.first_name,
        u.surname,
        u.profile_pic,
        u.color,
        u.shades
      FROM comments
      JOIN users_info AS u
      ON u.id = comments.user_id
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
app.post("/trainer/deletecomment", async (req, res) => {
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

app.get("/trainer/:commentsId/reply", async(req, res)=>{
  try {
    const {commentsId} = req.params;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `SELECT 
        replies.id,
        replies.comments_id,
        replies.user_id,
        replies.content,
        replies.created_at,
        u.first_name,
        u.surname,
        u.profile_pic,
        u.color,
        u.shades
      FROM replies
      JOIN users_info AS u
      ON u.id = replies.user_id
      WHERE replies.comments_id = $1
      ORDER BY replies.created_at DESC`,
      [commentsId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.json({ success: false, error });
  }
})
app.post("/trainer/:commentsId/reply", async (req, res) => {
  try {
    const { commentsId } = req.params;
    const { content  } = req.body;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
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
app.post("/trainer/deletereply/:replyId", async (req,res)=>{
  try {
    const { replyId } = req.params;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `DELETE FROM replies WHERE id = $1`, 
      [replyId])

     res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    req.json(error)
  }
})

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

// this part is for getting the chapteritems to retrieve the video
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
      res.json({ success: false, messsage: 'there no video added yet', data: result.rows })
    }

  } catch (error) {
    res.json({ success: false, messsage: 'there no video or quiz added yet' })
  }
});


//posting text editor 
app.post('/trainer/texteditor', async (req, res) => {
    const { title, courseId, chapterId, content } = req.body;
    try {
      if (!req.isAuthenticated()) {
        res.status(401).json({ success: false, messsage: 'unauthorized access' })
      }
      if (req.user.role !== "TRAINER") {
        res.status(401).json({ success: false, message: 'invalid role' })
      }
        const result = await db.query(
            'INSERT INTO text_editor (user_id, course_id , chapter_id , title, content) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, courseId,  chapterId,  title, content]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving post');
    }
});
//get the data fo text presenter
app.get('/trainer/texteditor/:courseId/:chapterId', async (req, res) => {
  const { courseId, chapterId } = req.params;
    try {
      if (!req.isAuthenticated()) {
        res.status(401).json({ success: false, messsage: 'unauthorized access' })
      }
      if (req.user.role !== "TRAINER") {
        res.status(401).json({ success: false, message: 'invalid role' })
      }
        const result = await db.query('SELECT * FROM text_editor WHERE course_id = $1 AND chapter_id = $2', [courseId, chapterId]);
        if(result.rows.length > 0 ){
          res.json({ success: true, data: result.rows });
        }else{
          res.json({ success: false });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching posts');
    }
  }
);

//certificate upload
app.post("/trainer/chapter/addcertificate", async (req, res) => {

  try {
    const { courseId, chapterId, title } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `INSERT INTO certificate ( is_certificate,chapter_id,course_id, title) VALUES ($1, $2, $3, $4) RETURNING*`
    const value = [true, chapterId, courseId, title]
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
app.get("/trainer/:courseId/:chapterId/getcertificate", async (req, res) => {

  try {
    const { courseId, chapterId } = req.params
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


//enrol
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

//trainee info
app.get('/trainer/:courseId/trainee', async (req, res) => {
  try {
    const { courseId } = req.params
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
    ORDER BY users_info.surname ASC;`, [courseId])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//video progress
app.get('/trainer/:courseId/:chapterId/traineevideoprogress', async (req, res) => {
  try {
    const { courseId, chapterId } = req.params
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
    ORDER BY users_info.surname ASC;`, [courseId, chapterId])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//quizprogress
app.get('/trainer/:courseId/:chapterId/traineequizprogress', async (req, res) => {
  try {
    const { courseId, chapterId } = req.params
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
        ORDER BY users_info.surname ASC;`, [chapterId, courseId])
    const quizLength = await db.query(`SELECT * FROM quizzes
      JOIN questions
      ON questions.quiz_id = quizzes.id
      WHERE quizzes.chapter_id = $1`, [chapterId])

    res.status(200).json({ success: true, message: 'succesful query', data: result.rows, quizLength: quizLength.rows.length })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
//iamgeprogress
app.get('/trainer/:courseId/:chapterId/traineeimageprogress', async (req, res) => {
  try {
    const { courseId, chapterId } = req.params
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
    ORDER BY users_info.surname ASC;`, [courseId, chapterId])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});

//render the data in to excel
app.post('/trainer/:courseId/excelrender', async (req, res) => {
  try {
    const { courseId } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

       const result = await db.query(`
      SELECT 
        ucp.user_id,
        ucp.chapter_id,
		chapters.title,
        ucp.is_done,
        ui.first_name,
        ui.surname
      FROM user_chapter_progress ucp
      JOIN users_info ui ON ui.id = ucp.user_id
	 JOIN chapters ON ucp.chapter_id = chapters.id
      WHERE ucp.course_id = $1
        
      ORDER BY chapters.order_index ASC
    `, [courseId, ]);

    res.json({ success: true, data: result.rows });

  } catch (error) {
    res.json({ success: false, error })
  }
});

// traine user progress chapter
app.get("/trainer/traineeprogress/:courseId/:chapterId", async(req, res)=>{
  try {
    const { courseId, chapterId } = req.params;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`
      SELECT 
        ucp.id, 
        ucp.user_id, 
        ucp.course_id, 
        ucp.course_id, 
        ucp.is_done,
	      ui.first_name, 
        ui.surname  
      FROM user_chapter_progress AS ucp
      JOIN users_info AS ui
        ON ui.id = ucp.user_id
      WHERE course_id = $1 AND chapter_id = $2
      ORDER BY surname ASC`, [courseId, chapterId])
    return res.json({success:true, data: result.rows})
  } catch (error) {
    res.json({ success: false, error })
  }
}),

app.get('/trainer/publishcountcourses', async (req, res) => {
  try {
    const { courseId, chapterId } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`
      SELECT
        c.id,
        c.title,
        EXISTS (
          SELECT 1
          FROM enrollments e
          WHERE e.course_id = c.id
        ) AS has_enrollments
      FROM courses c;`)
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});

app.get("/trainer/announcement/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `SELECT a.id, a.course_id, a.user_id, 
          a.title, a.message, a.created_at, 
          u.first_name, u.surname ,u.color, u.shades,
          u.profile_pic FROM announcements  AS a
        JOIN users_info AS u
        ON u.id = a.user_id
        WHERE course_id = $1
        ORDER BY created_at DESC `,
      [courseId]
    );
    res.json(result.rows);
    
  } catch (error) {
    res.json({ success: false, error })
  }
  
});

// POST a new notification (from admin or system)
app.post("/trainer/announcement", async (req, res) => {
  try {
    const {courseId, title, message } = req.body;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(`
      INSERT INTO announcements
      (user_id, course_id, title, message, read, created_at)
      VALUES ($1, $2, $3, $4, false, NOW())
      RETURNING *
      `,
      [req.user.id,courseId,title,message]
    );
    res.json(result.rows[0]);
    
  } catch (error) {
    res.json({ success: false, error })
  }
 
});

app.delete("/trainer/announcement/delete/:id", async(req, res)=>{
  try {
    const {id} = req.params
    if (!req.isAuthenticated()) {
        res.status(401).json({ success: false, messsage: 'unauthorized access' })
      }
      if (req.user.role !== "TRAINER") {
        res.status(401).json({ success: false, message: 'invalid role' })
      }

      await db.query(
      "DELETE FROM announcements WHERE id = $1",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });

  } catch (error) {
     console.error(err);
        res.status(500).send('Error saving post');
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
      res.json({ success: true, redirectTo: "/trainee/dashboard" , user: req.user.username})
    } else {
      res.json({ success: false, message: "role is invalid" })
    }
  } catch (error) {
    console.log(error)
  }

})



// //getting a certain data of users
app.get("/trainee/dashboard", async (req, res) => {

  try {
    if (req.isAuthenticated()) {
      if (req.user.role === "TRAINEE") {
        //const response = await db.query("SELECT role, username, users.id, first_name, surname FROM users JOIN users_info ON users.id = users_info.id WHERE username = $1", [req.user.username])
        const userInfo = await db.query("SELECT * FROM users_info WHERE id = $1", [req.user.id])
        //res.json({ success: true, data: response.rows[0], usersInfo:userInfo.rows, user: req.user.username })

        
        res.status(200).json({
          success: true,
          usersInfo: userInfo.rows[0],
          username: req.user.username,
          color:userInfo.rows[0].color,
          shade:userInfo.rows[0].shades

        });
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


//calendar todo list 
app.post("/trainee/calendar/events", async (req, res) => {

  try {
    const { event_date, text, color } = req.body;

    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
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
app.get("/trainee/calendar/events", async (req, res) => {
  try {

    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
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
//delete the data inside
app.delete("/trainee/calendar/events/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
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
//fetching data for upcoming event for a month 
app.post('/trainee/dashboard/upcomingschedule', async(req,res)=>{
  
  try {
    const {date1, date2} = req.body
   
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const query = `SELECT * FROM calendar_events WHERE user_id = $1 AND event_date >= $2 AND event_date <  $3`
    const values = [ req.user.id, date1, date2]

    const result = await db.query(query, values)
    res.json({success: true, data: result.rows})
    
  } catch (error) {
    
  }
})
// edit profile and user info 
app.post('/trainee/EditProfile/UploadProfile', UploadImageProfile.single('image'), async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    if (!req.file) {
      return res.status(400).json({ succes: false, message: "No file uploaded" })
    }
    const query = 'UPDATE users_info SET profile_pic = $1 WHERE id = $2'
    const values = [req.file.path, req.user.id]
    const response = await db.query(query, values)
    res.json({ success: true, message: `File received successfully`, data: response.rows })
    console.log(response)
  } catch (error) {
    res.json({ success: false, message: 'Failed Uploading' })
  }
});
app.post("/trainee/edituserinfo", async (req, res) => {
  const { firstName, surname, contactNo, password } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [req.user.username])

    if (checkResult.rows.length < 0) {
      res.json({ success: false, error: "Username already exists." })
    } else {
      if (password.length < 8) {

        res.json({ error: "your password is too short" })
      } else {

        bcrypt.hash(password, saltRounds, async (err, hash) => {

          if (err) {
            res.json("Error hasing password:", err)
          } else {
            const usersRes = await db.query("UPDATE users SET password = $1 WHERE id = $2", [ hash, req.user.id])

            

            const userInfoRes = await db.query(
              `UPDATE users_info 
                SET first_name = $1, 
                surname = $2, 
                email = $3
              WHERE id = $4`, [ firstName, surname, contactNo, req.user.id])

            res.json({ success: true, message: "Account created" })
          }
        })
      }
    }
  } catch (err) {
    res.json({ error: err.message })
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
    const query = 'SELECT * FROM courses JOIN chapters ON courses.id = chapters.course_id WHERE courses.id = $1 ORDER BY order_index ASC'
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

//certificate fetch 
app.get("/trainee/course/:courseId/:chapterId/getcertificate", async (req, res) => {

  try {
    const { courseId, chapterId } = req.params
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

// fetch the first item
app.post("/trainee/course/chapter/mediaitems", async (req, res) => {

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

app.get('/trainee/texteditor/:courseId/:chapterId', async (req, res) => {
  const { courseId, chapterId } = req.params;
    try {
      if (!req.isAuthenticated()) {
        res.status(401).json({ success: false, messsage: 'unauthorized access' })
      }
      if (req.user.role !== "TRAINEE") {
        res.status(401).json({ success: false, message: 'invalid role' })
      }
        const result = await db.query('SELECT * FROM text_editor WHERE course_id = $1 AND chapter_id = $2', [courseId, chapterId]);
        if(result.rows.length > 0 ){
          res.json({ success: true, data: result.rows });
        }else{
          res.json({ success: false });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching posts');
    }
  });
// fetch the quiz questions
app.post("/trainee/course/chapter/quiz", async (req, res) => {
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
//send data into database this is the ansers of user it will save into quiz
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

// this to fetch all the answers in quiz
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

    
    if(result.rows.length > 0 ){
      res.status(200).json({
      success: true,
      message: 'quiz progress fetched',
      data: result.rows
    });
    }else{
      res.status(200).json({
      success: false,
      message: 'there is no progress yet',
      data: result.rows
    });
    }

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
      `INSERT INTO video_progress (user_id, chapter_id, course_id, video_id, is_completed)
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


// GET VIDEO PROGRESS and duration to make the video save where they stop to watch and fetch 
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
    const hasProgress = result.rows.length > 0;

    res.json({
      duration_seconds: hasProgress ? Number(result.rows[0].duration_seconds) : 0,
      is_completed: hasProgress ? result.rows[0].is_completed : false
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ duration_seconds: 0 });
  }
});


//video progress 
app.post('/trainee/course/traineevideoprogress', async (req, res) => {
  try {
    const { course_id, chapter_id } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(`SELECT * FROM video_progress
      WHERE course_id = $1 AND chapter_id = $2  AND user_id = $3`,
      [course_id, chapter_id, req.user.id]) 

    
    if(result.rows.length > 0){
      res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
    }else{
      res.status(200).json({ success: false, message: 'unsuccesful query',data: result.rows })
    }
    
  
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});

//quizprogress
app.post('/trainee/course/traineequizprogress', async (req, res) => {
  try {
    const { course_id, chapter_id } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`
      SELECT * FROM quiz_progress
      WHERE course_id = $1 AND chapter_id = $2 ANd user_id = $3`, [ course_id, chapter_id, req.user.id])
      
    if(result.rows.length > 0){
      res.status(200).json({ success: true, message: 'succesful query' , data: result.rows})
    }else{
      res.status(200).json({ success: false, message: 'unsuccesful query', data: result.rows })
    }

    
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});

//iamgeprogress
app.post('/trainee/course/traineeimageprogress', async (req, res) => {
  try {
    const { courseId, chapterId } = req.body
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
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
    ORDER BY users_info.surname ASC;`, [courseId, chapterId])
    res.status(200).json({ success: true, message: 'succesful query', data: result.rows })
  } catch (error) {
    res.status(400).json({ success: false, message: 'error query' })
  }
});
  
app.get('/trainee/:course/progress', async (req, res) => {
  try {
    const { course } = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

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
});

//progress dito ay hinahanda mmo ung user na pag tracking data so dito ni reready mo ung user na pasok ung mga availabale chapter at di nya pa tapos na chapter 
app.get('/trainee/chapterprogress/:courseId/loader' , async(req, res)=>{
  try {
    const {courseId, chapterId} = req.params
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    
   
    const result = await db.query(
        `
        INSERT INTO user_chapter_progress
          (user_id, course_id, chapter_id, is_done, created_at)
        SELECT
          $1,
          ch.course_id,
          ch.id,
          false,
          now()
        FROM chapters ch
        WHERE ch.course_id = $2
        ON CONFLICT (user_id, course_id, chapter_id) DO NOTHING
         RETURNING *`,
        [req.user.id, courseId]
      );
    
      res.json({success:true, data: result.rows})
    


  } catch (error) {
    res.json({error: error})
  }
});

// dito tinatrack ko kung tama nak aunlock na bayung certain chapters dito ay collection kung baga na dito lahat ng chapters 
app.get('/trainee/chapterprogress/:courseId/unlocktracker' , async(req, res)=>{
  try {
    const {courseId, chapterId} = req.params
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const checkUser = await db.query(
      `SELECT
        chapters.id AS chapter_id,
        chapters.title,
        chapters.order_index,
        COALESCE(user_chapter_progress.is_done, false) AS is_done,

        CASE
          -- always unlocked ang first chapter
          WHEN chapters.order_index = 1 THEN true

          -- unlocked kung natapos ang previous chapter
          WHEN (
            SELECT user_chapter_progress.is_done
            FROM user_chapter_progress
            JOIN chapters AS previous_chapters
              ON previous_chapters.id = user_chapter_progress.chapter_id
            WHERE previous_chapters.course_id = chapters.course_id
              AND previous_chapters.order_index = chapters.order_index - 1
              AND user_chapter_progress.user_id = $1
            LIMIT 1
          ) = true
          THEN true

          ELSE false
        END AS is_unlocked

      FROM chapters
      LEFT JOIN user_chapter_progress
        ON user_chapter_progress.chapter_id = chapters.id
        AND user_chapter_progress.user_id = $1

      WHERE chapters.course_id = $2
      ORDER BY chapters.order_index;

      `,
      [req.user.id, courseId ]
    ); 

    
  res.json({success:true, data: checkUser.rows, message: 'already load the tracks data'})
    


  } catch (error) {
    res.json({error: error})
  }
});

// update pag tapos mo nayung chapters
app.post("/trainee/chapterprogress/:courseId/:chapterId", async(req, res)=>{
  try {
    const {courseId, chapterId} = req.params
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }

    const update = await db.query(
        `UPDATE user_chapter_progress
        SET
          is_done = true,
          completed_at = now()
        WHERE user_id = $1
          AND course_id = $2
          AND chapter_id = $3;`,
        [req.user.id, courseId, chapterId])
        res.json({success:true  ,data:update.rows})
  } catch (error) {
    res.json({error:error})
  }
});

app.get("/trainee/traineeprogress/:courseId", async(req, res)=>{
  try {
    const { courseId } = req.params;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const result = await db.query(`
      SELECT 
        ucp.id, 
        ucp.user_id, 
        ucp.course_id, 
        ucp.course_id, 
        ucp.is_done,
	      ui.first_name, 
        ui.surname  
      FROM user_chapter_progress AS ucp
      JOIN users_info AS ui
        ON ui.id = ucp.user_id
      WHERE course_id = $1 AND user_id = $2
      ORDER BY surname ASC`, [courseId, req.user.id])
    return res.json({success:true, data: result.rows})
  } catch (error) {
    res.json({ success: false, error })
  }
})

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
        u.first_name,
        u.surname,
        u.profile_pic,
        u.color,
        u.shades
      FROM comments
      JOIN users_info AS u 
      ON u.id = comments.user_id
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

app.post("/trainee/deletecomment", async (req, res) => {
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
        u.first_name,
        u.surname, 
        u.profile_pic,
        u.color,
        u.shades
      FROM replies
      JOIN users_info AS u
      ON u.id = replies.user_id
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

app.post("/trainee/deletereply/:replyId", async (req,res)=>{
  try {
    const { replyId } = req.params;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `DELETE FROM replies WHERE id = $1`, 
      [replyId])

     res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    req.json(error)
  }
})



//fetch anouncement (kinuka ung mga data announce data available in the course ) 

app.get("/trainee/announcement/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const result = await db.query(
      `SELECT a.id, a.course_id, a.user_id, 
          a.title, a.message, a.created_at, 
          u.first_name, u.surname ,u.color, u.shades,
          u.profile_pic FROM announcements  AS a
        JOIN users_info AS u
        ON u.id = a.user_id
        WHERE course_id = $1
        ORDER BY created_at DESC`,
      [courseId]
    );
    res.json(result.rows);
    
  } catch (error) {
    res.json({ success: false, error })
  }
  
});

//counting notification na hindi mo pa read
app.get("/admin/announcement/:courseId/notificaitons", async (req, res)=>{
  try {
    const {courseId} = req.params
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, messsage: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    const announcement = await db.query('SELECT * FROM announcements WHERE course_id = $1', [courseId])
    const notif = await db.query('SELECT * FROM notifications_announcement WHERE course_id = $1 AND user_id = $2', [courseId, req.user.id])
    
    let totalnotif = announcement.rows.length - notif.rows.length
   console.log("aaa", announcement.rows.length , notif.rows.length)

    res.json({success: true, totalNotif: totalnotif})

  } catch (error) {
    res.json({ success: false, error })
  }
})

//notifcation announcement eto ay pag post pag na read mo nayung announcement this a mark 
app.get("/trainee/announcement/:courseId/read-in", async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!req.isAuthenticated())
      return res.status(401).json({ success: false });

    if (req.user.role !== "TRAINEE")
      return res.status(403).json({ success: false });

    // 1️⃣ INSERT ALL UNREAD ANNOUNCEMENTS AS READ
   
      await db.query(
      `
      INSERT INTO notifications_announcement
        (user_id, announcement_id, is_read, course_id, created_at)
    SELECT
        $1,         -- user_id
        a.id,             -- announcement_id
        true,             -- is_read
        a.course_id::int, -- course_id cast to integer
        now()             -- created_at
    FROM announcements a
    WHERE a.course_id::int = $2
      AND NOT EXISTS (
        SELECT 1
        FROM notifications_announcement n
        WHERE n.user_id = $1
          AND n.announcement_id = a.id
      );
      `,
      [req.user.id, courseId]
    );

    res.json({success:true});

  } catch (error) {
    res.status(500).json({ success: false, error });
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



io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  // =========================
  // JOIN USER ROOM (NOTIF)
  // =========================
  socket.on("join-user", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User joined room: user_${userId}`);
  });

  // =========================
  // JOIN CHAT ROOM (MESSAGES / SEEN)
  // =========================
  socket.on("join-chat", (chatId) => {
    socket.join(`chat_${chatId}`);
    console.log(`Socket joined chat_${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});



//mmessage features on all role
// Create chat between 2 users
//admmin chats

// Mark messages as seen
app.get("/admin/message/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json({ success: true, data: [] });
  }

  try {
    // SAFETY CHECKS
    if (!req.user) {
      return res.status(401).json({ success: false, message: "not logged in" });
    }

    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false, message: "invalid role" });
    }

    const result = await db.query(
      `
      SELECT 
        u.id, 
        u.username, 
        u.role,
        ui.first_name, 
        ui.surname, 
        ui.color, 
        ui.shades, 
        ui.profile_pic 
      FROM users u
      JOIN users_info ui ON ui.id = u.id
      WHERE u.username ILIKE $1 AND u.username <> $2
      `,
      [`%${q}%`, req.user.username]
    );

    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/admin/addContact", async (req, res) => {
  const { user1_id, user2_id } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    
    const checkContacts2 = await db.query(`
      SELECT * FROM chats
      WHERE chats.user1_id = $1 AND chats.user2_id = $2;`, 
      [req.user.id, user2_id])
    
    if (checkContacts2.rows.length > 0){
      console.log('you already contact this person', checkContacts2.rows.length)
      return res.json({success:false, message: 'The contact person has already been added.'});
    }else{
      console.log('not contacted')
      const chat = await db.query(
        `INSERT INTO chats (user1_id, user2_id)
        VALUES ($1, $2)
        RETURNING *`,
        [req.user.id, user2_id]
      );
      return res.json({success:true, data:chat.rows[0]});
    }

    

    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all chats of a user
app.get("/admin/chats", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false });
    }

    if (req.user.role !== "SUPERADMIN") {
      return res.status(401).json({ success: false });
    }

    const chats = await db.query(
      `
      SELECT
        chats.id,
        chats.user1_id,
        chats.user2_id,

        ui.first_name  AS user1_firstname,
        ui.surname     AS user1_surname,
        ui.profile_pic AS user1_profile_pic,
        ui.color       AS user1_color,
        ui.shades      AS user1_shades,

        ui2.first_name  AS user2_firstname,
        ui2.surname     AS user2_surname,
        ui2.profile_pic AS user2_profile_pic,
        ui2.color       AS user2_color,
        ui2.shades      AS user2_shades,

        COUNT(
          CASE 
            WHEN m.is_seen = false 
            AND m.sender_id <> $1 
            THEN 1 
          END
        ) AS unread_count

      FROM chats
      JOIN users_info ui  ON ui.id  = chats.user1_id
      JOIN users_info ui2 ON ui2.id = chats.user2_id
      LEFT JOIN messages m ON m.chat_id = chats.id

      WHERE chats.user1_id = $1 OR chats.user2_id = $1

      GROUP BY
        chats.id,
        chats.user1_id,
        chats.user2_id,
        ui.first_name,
        ui.surname,
        ui.profile_pic,
        ui.color,
        ui.shades,
        ui2.first_name,
        ui2.surname,
        ui2.profile_pic,
        ui2.color,
        ui2.shades

      ORDER BY chats.id DESC
      `,
      [req.user.id]
    );

    res.json(chats.rows);
  } catch (err) {
    console.error("ADMIN CHATS ERROR:", err);
    res.status(500).json({ success: false });
  }
});


// Send message
app.post("/admin/sendMessage", async (req, res) => {
  const { chat_id, sender_id, message } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const msg = await db.query(
    `
    INSERT INTO messages (chat_id, sender_id, message, is_seen)
    VALUES ($1, $2, $3, false)
    RETURNING *
    `,
    [chat_id, req.user.id, message]
  );
  const chat = await db.query(
    `SELECT user1_id, user2_id FROM chats WHERE id = $1`,
    [chat_id]
  );

    const receiverId =
    chat.rows[0].user1_id === req.user.id
      ? chat.rows[0].user2_id
      : chat.rows[0].user1_id;

  io.to(`user_${receiverId}`).emit("new_notification", {
    chat_id
  });

    io.to(`chat_${chat_id}`).emit("receive_message", msg.rows[0]);

    io.to(`user_${receiverId}`).emit("new_notification", {
      chat_id
    });
    res.json(msg.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/admin/chats/:chatId/seen", async (req, res) => {
  const { chatId } = req.params;

  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false });
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    await db.query(
      `
      UPDATE messages
      SET is_seen = true
      WHERE chat_id = $1
      AND sender_id <> $2
      `,
      [chatId, req.user.id]
    );

    // 🔔 EMIT PARA MAG-REFRESH UNREAD COUNT
    io.to(`chat_${chatId}`).emit("seen_update", { chatId });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Get messages by chat
app.get("/admin/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "SUPERADMIN") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const messages = await db.query(
      `SELECT 
         m.id,
         u.first_name,
         m.message,
         m.created_at
       FROM messages m
       JOIN users_info AS u ON m.sender_id = u.id
       WHERE m.chat_id = $1
       ORDER BY m.created_at ASC`,
      [chatId]
    );

    res.json({success:true , data:messages.rows});
  } catch (err) {
    res.status(500).json({success:false, error: err.message });
  }
});



//trainer chats
app.get("/trainer/message/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json({ success: true, data: [] });
  }

  try {
    // SAFETY CHECKS
    if (!req.user) {
      return res.status(401).json({ success: false, message: "not logged in" });
    }

    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false, message: "invalid role" });
    }

    const result = await db.query(
      `
      SELECT 
        u.id, 
        u.username, 
        u.role,
        ui.first_name, 
        ui.surname, 
        ui.color, 
        ui.shades, 
        ui.profile_pic 
      FROM users u
      JOIN users_info ui ON ui.id = u.id
      WHERE u.username ILIKE $1 AND u.username <> $2
      `,
      [`%${q}%`, req.user.username]
    );

    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/trainer/addContact", async (req, res) => {
  const { user1_id, user2_id } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    if(req.user.id === user2_id){
      return res.json({success:false, message: 'forbidden '});
    }
    const checkContacts2 = await db.query(`
      SELECT * FROM chats
      WHERE chats.user1_id = $1 AND chats.user2_id = $2;`, 
      [req.user.id , user2_id])
    
    if (checkContacts2.rows.length > 0){
      console.log('you already contact this person', checkContacts2.rows.length)
      return res.json({success:false, message: 'The contact person has already been added.'});
    }else{
      console.log('not contacted')
      const chat = await db.query(
        `INSERT INTO chats (user1_id, user2_id)
        VALUES ($1, $2)
        RETURNING *`,
        [req.user.id, user2_id]
      );
      return res.json({success:true, data:chat.rows[0]});
    }


    res.json(chat.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all chats of a user
app.get("/trainer/chats", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false });
    }

    if (req.user.role !== "TRAINER") {
      return res.status(401).json({ success: false });
    }

    const chats = await db.query(
      `
      SELECT
        chats.id,
        chats.user1_id,
        chats.user2_id,

        ui.first_name  AS user1_firstname,
        ui.surname     AS user1_surname,
        ui.profile_pic AS user1_profile_pic,
        ui.color       AS user1_color,
        ui.shades      AS user1_shades,

        ui2.first_name  AS user2_firstname,
        ui2.surname     AS user2_surname,
        ui2.profile_pic AS user2_profile_pic,
        ui2.color       AS user2_color,
        ui2.shades      AS user2_shades,

        COUNT(
          CASE 
            WHEN m.is_seen = false 
            AND m.sender_id <> $1 
            THEN 1 
          END
        ) AS unread_count

      FROM chats
      JOIN users_info ui  ON ui.id  = chats.user1_id
      JOIN users_info ui2 ON ui2.id = chats.user2_id
      LEFT JOIN messages m ON m.chat_id = chats.id

      WHERE chats.user1_id = $1 OR chats.user2_id = $1

      GROUP BY
        chats.id,
        chats.user1_id,
        chats.user2_id,
        ui.first_name,
        ui.surname,
        ui.profile_pic,
        ui.color,
        ui.shades,
        ui2.first_name,
        ui2.surname,
        ui2.profile_pic,
        ui2.color,
        ui2.shades

      ORDER BY chats.id DESC
      `,
      [req.user.id]
    );

    res.json(chats.rows);
  } catch (err) {
    console.error("ADMIN CHATS ERROR:", err);
    res.status(500).json({ success: false });
  }
});


// Send message
app.post("/trainer/sendMessage", async (req, res) => {
  const { chat_id, sender_id, message } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const msg = await db.query(
    `
    INSERT INTO messages (chat_id, sender_id, message, is_seen)
    VALUES ($1, $2, $3, false)
    RETURNING *
    `,
    [chat_id, req.user.id, message]
  );
  const chat = await db.query(
    `SELECT user1_id, user2_id FROM chats WHERE id = $1`,
    [chat_id]
  );

    const receiverId =
    chat.rows[0].user1_id === req.user.id
      ? chat.rows[0].user2_id
      : chat.rows[0].user1_id;

  io.to(`user_${receiverId}`).emit("new_notification", {
    chat_id
  });

    io.to(`chat_${chat_id}`).emit("receive_message", msg.rows[0]);

    io.to(`user_${receiverId}`).emit("new_notification", {
      chat_id
    });
    res.json(msg.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/trainer/chats/:chatId/seen", async (req, res) => {
  const { chatId } = req.params;

  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false });
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    await db.query(
      `
      UPDATE messages
      SET is_seen = true
      WHERE chat_id = $1
      AND sender_id <> $2
      `,
      [chatId, req.user.id]
    );

    // 🔔 EMIT PARA MAG-REFRESH UNREAD COUNT
    io.to(`chat_${chatId}`).emit("seen_update", { chatId });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Get messages by chat
app.get("/trainer/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINER") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const messages = await db.query(
      `SELECT 
         m.id,
         u.first_name,
         m.message,
         m.created_at
       FROM messages m
       JOIN users_info AS u ON m.sender_id = u.id
       WHERE m.chat_id = $1
       ORDER BY m.created_at ASC`,
      [chatId]
    );

    res.json({success:true , data:messages.rows});
  } catch (err) {
    res.status(500).json({success:false , error: err.message });
  }
});



//trainee chats 
app.get("/trainee/message/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json({ success: true, data: [] });
  }

  try {
    // SAFETY CHECKS
    if (!req.user) {
      return res.status(401).json({ success: false, message: "not logged in" });
    }

    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false, message: "invalid role" });
    }

    const result = await db.query(
      `
      SELECT 
        u.id, 
        u.username, 
        u.role,
        ui.first_name, 
        ui.surname, 
        ui.color, 
        ui.shades, 
        ui.profile_pic 
      FROM users u
      JOIN users_info ui ON ui.id = u.id
      WHERE u.username ILIKE $1 AND u.username <> $2
      `,
      [`%${q}%`, req.user.username]
    );

    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/trainee/addContact", async (req, res) => {
  const { user1_id, user2_id } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    if(req.user.id === user2_id){
      return res.json({success:false, message: 'forbidden '});
    }
    const checkContacts2 = await db.query(`
      SELECT * FROM chats
      WHERE chats.user1_id = $1 AND chats.user2_id = $2;`, 
      [req.user.id , user2_id])
    
    if (checkContacts2.rows.length > 0){
      console.log('you already contact this person', checkContacts2.rows.length)
      return res.json({success:false, message: 'The contact person has already been added.'});
    }else{
      console.log('not contacted')
      const chat = await db.query(
        `INSERT INTO chats (user1_id, user2_id)
        VALUES ($1, $2)
        RETURNING *`,
        [req.user.id, user2_id]
      );
      return res.json({success:true, data:chat.rows[0]});
    }


    res.json(chat.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all chats of a user
app.get("/trainee/chats", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false });
    }

    if (req.user.role !== "TRAINEE") {
      return res.status(401).json({ success: false });
    }

    const chats = await db.query(
      `
      SELECT
        chats.id,
        chats.user1_id,
        chats.user2_id,

        ui.first_name  AS user1_firstname,
        ui.surname     AS user1_surname,
        ui.profile_pic AS user1_profile_pic,
        ui.color       AS user1_color,
        ui.shades      AS user1_shades,

        ui2.first_name  AS user2_firstname,
        ui2.surname     AS user2_surname,
        ui2.profile_pic AS user2_profile_pic,
        ui2.color       AS user2_color,
        ui2.shades      AS user2_shades,

        COUNT(
          CASE 
            WHEN m.is_seen = false 
            AND m.sender_id <> $1 
            THEN 1 
          END
        ) AS unread_count

      FROM chats
      JOIN users_info ui  ON ui.id  = chats.user1_id
      JOIN users_info ui2 ON ui2.id = chats.user2_id
      LEFT JOIN messages m ON m.chat_id = chats.id

      WHERE chats.user1_id = $1 OR chats.user2_id = $1

      GROUP BY
        chats.id,
        chats.user1_id,
        chats.user2_id,
        ui.first_name,
        ui.surname,
        ui.profile_pic,
        ui.color,
        ui.shades,
        ui2.first_name,
        ui2.surname,
        ui2.profile_pic,
        ui2.color,
        ui2.shades

      ORDER BY chats.id DESC
      `,
      [req.user.id]
    );

    res.json(chats.rows);
  } catch (err) {
    console.error("ADMIN CHATS ERROR:", err);
    res.status(500).json({ success: false });
  }
});


// Send message
app.post("/trainee/sendMessage", async (req, res) => {
  const { chat_id, sender_id, message } = req.body;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const msg = await db.query(
    `
    INSERT INTO messages (chat_id, sender_id, message, is_seen)
    VALUES ($1, $2, $3, false)
    RETURNING *
    `,
    [chat_id, req.user.id, message]
  );
  const chat = await db.query(
    `SELECT user1_id, user2_id FROM chats WHERE id = $1`,
    [chat_id]
  );

    const receiverId =
    chat.rows[0].user1_id === req.user.id
      ? chat.rows[0].user2_id
      : chat.rows[0].user1_id;

  io.to(`user_${receiverId}`).emit("new_notification", {
    chat_id
  });

    io.to(`chat_${chat_id}`).emit("receive_message", msg.rows[0]);

    io.to(`user_${receiverId}`).emit("new_notification", {
      chat_id
    });
    res.json(msg.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/trainee/chats/:chatId/seen", async (req, res) => {
  const { chatId } = req.params;

  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false });
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }

    await db.query(
      `
      UPDATE messages
      SET is_seen = true
      WHERE chat_id = $1
      AND sender_id <> $2
      `,
      [chatId, req.user.id]
    );

    // 🔔 EMIT PARA MAG-REFRESH UNREAD COUNT
    io.to(`chat_${chatId}`).emit("seen_update", { chatId });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
// Get messages by chat
app.get("/trainee/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ success: false, message: 'unauthorized access' })
    }
    if (req.user.role !== "TRAINEE") {
      res.status(401).json({ success: false, message: 'invalid role' })
    }
    const messages = await db.query(
      `SELECT 
         m.id,
         u.first_name,
         m.message,
         m.created_at
       FROM messages m
       JOIN users_info AS u ON m.sender_id = u.id
       WHERE m.chat_id = $1
       ORDER BY m.created_at ASC`,
      [chatId]
    );

    res.json({success:true , data:messages.rows});
  } catch (err) {
    res.status(500).json({success:false , error: err.message });
  }
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

server.listen(port, () => {
  console.log(`now listening in port :${port} http://localhost:${port}`)
})