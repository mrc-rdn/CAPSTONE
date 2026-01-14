import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LandingPage from "./PAGE/homePage/landingPage.jsx"
import TraineeLoginPage from "./PAGE/homePage/TraineeLoginPage.jsx"
import TrainerLoginPage from "./PAGE/homePage/TrainerLoginPage.jsx"
import RoleChoicePage from './PAGE/homePage/RoleChoicePage.jsx'
import ForgotPassword from './PAGE/homePage/ForgotPasswordPage.jsx'
import ResetPassword from './PAGE/homePage/ResetPassword.jsx'

//this is for admin
import AdminProtectedRoute from "./PAGE/adminPage/components/routes/AdminProtectedRoute.jsx"
import AdminDashboard from './PAGE/adminPage/AdminDashboard.jsx'
import AdminCourse from './PAGE/adminPage/AdminCourse.jsx'
import CourseOverview from './PAGE/adminPage/CourseOverview.jsx'
import AdminMessages from './PAGE/adminPage/AdminMessages.jsx'
import CreateAcoount from './PAGE/adminPage/CreateAcoount.jsx'
import EditProfile from './PAGE/adminPage/EditProfile.jsx'
import MasterList from './PAGE/adminPage/MasterList.jsx'


//this is a protect route
import TRAINERProtectedRoute from './PAGE/TrainerPage/components/TRAINERProtectedRoute.jsx'
import TrainerDashboard from './PAGE/TrainerPage/TrainerDashboard.jsx'
import TrainerCourse from "./PAGE/TrainerPage/TrainerCourse.jsx"
import TrainerMessages from "./PAGE/TrainerPage/TrainerMessages.jsx"
import TrainerProfile from "./PAGE/TrainerPage/TrainerProfile.jsx"
import TrainerCourseOverview from './PAGE/TrainerPage/TrainerCourseOverview.jsx'
import TRAINEREditProfile from './PAGE/TrainerPage/EditProfile.jsx'

//this for trainee
import TraineeDashboard from "./PAGE/TraineePage/TraineeDashboard.jsx"
import TRAINEEProtectedRoute from "./PAGE/TraineePage/components/routes/TRAINEEProtectedRoute.jsx"
import TraineeCourse from "./PAGE/TraineePage/TraineeCourse.jsx";
import TraineeMessages from "./PAGE/TraineePage/TraineeMessages.jsx";
import TraineeCourseOverview from './PAGE/TraineePage/CourseOverview.jsx'
import TraineeEditProfile from './PAGE/TraineePage/EditProfile.jsx'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/role" element={<RoleChoicePage />} />
        <Route path="/trainee/login" element={<TraineeLoginPage />} />
        <Route path="/trainer/login" element={<TrainerLoginPage />} />
        <Route path="/trainer/ForgetPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        <Route path="/trainer/dashboard" element={<TRAINERProtectedRoute><TrainerDashboard/></TRAINERProtectedRoute>} />
        <Route path="/trainer/course" element={<TRAINERProtectedRoute><TrainerCourse/></TRAINERProtectedRoute>}/>
        <Route path="/trainer/messages" element={<TRAINERProtectedRoute><TrainerMessages/></TRAINERProtectedRoute>}/>
        <Route path="/trainer/profile" element={<TRAINERProtectedRoute><TrainerProfile /></TRAINERProtectedRoute>}/>
        <Route path='/trainer/course/:id/:courseTitle' element={<TRAINERProtectedRoute><TrainerCourseOverview /></TRAINERProtectedRoute>} />
        <Route path='/trainer/editprofile' element={<TRAINERProtectedRoute><TRAINEREditProfile /></TRAINERProtectedRoute>} />

        <Route path="/trainee/dashboard" element={<TRAINEEProtectedRoute><TraineeDashboard /></TRAINEEProtectedRoute>}/>
        <Route path="/trainee/Course" element={<TRAINEEProtectedRoute><TraineeCourse/></TRAINEEProtectedRoute>}/>
        <Route path="/trainee/messages" element={<TRAINEEProtectedRoute><TraineeMessages/></TRAINEEProtectedRoute>}/>
        <Route path='/trainee/course/:id/:courseTitle' element={<TRAINEEProtectedRoute><TraineeCourseOverview /></TRAINEEProtectedRoute>} />
        <Route path="/trainee/editprofile" element={<TRAINEEProtectedRoute><TraineeEditProfile /></TRAINEEProtectedRoute>} />

        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/course" element={<AdminProtectedRoute><AdminCourse /></AdminProtectedRoute>} />
        <Route path="/admin/statistics" element={<AdminProtectedRoute><MasterList /></AdminProtectedRoute>} />
        <Route path="/admin/messages" element={<AdminProtectedRoute><AdminMessages /></AdminProtectedRoute>} />
        <Route path="/admin/createaccount" element={<AdminProtectedRoute><CreateAcoount /></AdminProtectedRoute>} />
        <Route path="/admin/course/:id/:courseTitle" element={<AdminProtectedRoute> <CourseOverview /> </AdminProtectedRoute>}/>
        <Route path="/admin/editprofile" element={<AdminProtectedRoute><EditProfile /></AdminProtectedRoute>} />
      </Routes>
    </Router>
  )
}

