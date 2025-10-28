import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LandingPage from "./PAGE/homePage/landingPage"
import TraineeLoginPage from "./PAGE/homePage/TraineeLoginPage"
import TrainerLoginPage from "./PAGE/homePage/TrainerLoginPage"
import RoleChoicePage from './PAGE/homePage/RoleChoicePage'

//this is for admin
import AdminProtectedRoute from "./PAGE/adminPage/components/AdminProtectedRoute"
import AdminDashboard from './PAGE/adminPage/AdminDashboard'
import AdminCourse from './PAGE/adminPage/AdminCourse'
import AdminMessages from './PAGE/adminPage/AdminMessages'
import CreateAcoount from './PAGE/adminPage/CreateAcoount'


//this is a protect route
import TRAINERProtectedRoute from './PAGE/TrainerPage/components/TRAINERProtectedRoute'
import TrainerDashboard from './PAGE/TrainerPage/TrainerDashboard'
import TrainerMyBatch from "./PAGE/TrainerPage/TrainerMyBatch"
import TrainerMessages from "./PAGE/TrainerPage/TrainerMessages"
import TrainerProfile from "./PAGE/TrainerPage/TrainerProfile"

//this for trainee
import TraineeDashboard from "./PAGE/TraineePage/TraineeDashboard"
import TRAINEEProtectedRoute from "./PAGE/TraineePage/components/TRAINEEProtectedRoute"
import TraineeMyBatch from "./PAGE/TraineePage/TraineeMyBatch";
import TraineeMessages from "./PAGE/TraineePage/TraineeMessages";
import TraineeProfile from "./PAGE/TraineePage/TraineeProfile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/role" element={<RoleChoicePage />} />
        <Route path="/trainee/login" element={<TraineeLoginPage />} />
        <Route path="/trainer/login" element={<TrainerLoginPage />} />

        
        <Route path="/trainer/dashboard" element={<TRAINERProtectedRoute><TrainerDashboard/></TRAINERProtectedRoute>} />
        <Route path="/trainer/mybatch" element={<TRAINERProtectedRoute><TrainerMyBatch/></TRAINERProtectedRoute>}/>
        <Route path="/trainer/messages" element={<TRAINERProtectedRoute><TrainerMessages/></TRAINERProtectedRoute>}/>
        <Route path="/trainer/profile" element={<TRAINERProtectedRoute><TrainerProfile /></TRAINERProtectedRoute>}/>


        <Route path="/trainee/dashboard" element={<TRAINEEProtectedRoute><TraineeDashboard /></TRAINEEProtectedRoute>}/>
        <Route path="/trainee/mybatch" element={<TRAINEEProtectedRoute><TraineeMyBatch/></TRAINEEProtectedRoute>}/>
        <Route path="/trainee/messages" element={<TRAINEEProtectedRoute><TraineeMessages/></TRAINEEProtectedRoute>}/>
        <Route path="/trainee/profile" element={<TRAINEEProtectedRoute><TraineeProfile /></TRAINEEProtectedRoute>}/>

        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/modules" element={<AdminProtectedRoute><AdminCourse /></AdminProtectedRoute>} />
        <Route path="/admin/messages" element={<AdminProtectedRoute><AdminMessages /></AdminProtectedRoute>} />
        <Route path="/admin/createaccount" element={<AdminProtectedRoute><CreateAcoount /></AdminProtectedRoute>} />
      </Routes>
    </Router>
  )
}

