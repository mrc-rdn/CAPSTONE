import { useEffect, useState } from "react";
import { Users, BookOpen, GraduationCap, Activity } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../../../api";
import Table from './Table'

const StatCard = ({ title, value, subtitle, icon: Icon, gradient }) => (
  <div className={`rounded-2xl p-6 shadow-lg text-white ${gradient}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <h2 className="text-3xl font-bold mt-1">{value ?? "—"}</h2>
        {subtitle && <p className="text-xs mt-2 opacity-80">{subtitle}</p>}
      </div>
      <Icon className="w-10 h-10 opacity-80" />
    </div>
  </div>
);

export default function StatisticsCollection() {
  const [users, setUsers] = useState(null);
  const [trainee, settrainee] = useState(null);
  const [trainer, settrainer] = useState(null);
 
  const [enrollments, setEnrollments] = useState(null);
  const [publishCount, setPublishCount] = useState([]);
  const [progress, setProgress] = useState([])
  const [courses, setCourses] = useState([]);
  const [listData, setListData] = useState([])
  const [role, setRole] = useState("")

  useEffect(() => {
    const fetchData = async ()=>{

        const [fetchData, publish, traineeProgress, courses, masterlist] = await Promise.all([
            axios.get(`${API_URL}/admin/dashboard`, {withCredentials: true}),
            axios.get(`${API_URL}/admin/publishcountcourses`, {withCredentials: true}),
            axios.get(`${API_URL}/admin/MasterList/traineeprogress`, {withCredentials: true}),
            axios.get(`${API_URL}/admin/course`, {withCredentials: true}),
            axios.get(`${API_URL}/admin/MasterList?role=${role}`, {withCredentials: true}),
            ,])
        
        let trainee = fetchData.data.traineeCount
        let trainer = fetchData.data.trainerCount
        setUsers(trainee + trainer)
        settrainer(trainer)
        settrainee(trainee)
        setCourses(courses.data.data)
        setPublishCount(publish.data.data)
        setProgress(traineeProgress.data.data)
        setListData(masterlist.data.data)
    }

        fetchData()
    }, [role]);
    function getCompletionPercentagePerUser(data) {
    const users = {};

    data.forEach(item => {
      const userId = item.user_id;

      if (!users[userId]) {
        users[userId] = {
          user_id: userId,
          first_name: item.first_name,
          surname: item.surname,
          total: 0,
          done: 0
        };
      }

      users[userId].total += 1;

      if (item.is_done) {
        users[userId].done += 1;
      }
    });

    // Step 2: compute percentage
    return Object.values(users).map(user => ({
      ...user,
      percentage: Math.round((user.done / user.total) * 100)
    }));
  }
  let result = getCompletionPercentagePerUser(progress);

    const published = publishCount.filter(c => c.has_enrollments).length;
    const drafts = publishCount.filter(c => c.has_enrollments===false).length;
    const completed = result.filter(info=>info.percentage === 100  ).length;
    const ongoing = result.filter(info=>info.percentage !== 100  ).length

console.log(courses)

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-3">System statistics overview</h1>
      

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
            title="Total Users"
            value={users}
            subtitle={`${trainee || 0} students · ${trainer || 0} instructors`}
            icon={Users}
            gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
            />

            <StatCard
            title="Total Trainer"
            value={trainer}
            subtitle="Logged in today"
            icon={Activity}
            gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
            />
            <StatCard
            title="Total Trainee"
            value={trainee}
            subtitle={`${completed || 0} completed · ${ongoing || 0} ongoing`}
            icon={GraduationCap}
            gradient="bg-gradient-to-r from-pink-500 to-rose-600"
            />

            <StatCard
            title="Courses"
            value={courses.length}
            subtitle={`${published|| 0} published · ${drafts || 0} drafts`}
            icon={BookOpen}
            gradient="bg-gradient-to-r from-orange-500 to-amber-600"
            />

            
        </div>
        <select
            className="border rounded-lg px-3 py-2 m-3"
            value={role}
            onChange={e => setRole(e.target.value)}
        >
            <option value="">All Role</option>
            <option value="TRAINEE">Trainee</option>
            <option value="TRAINER">Trainer</option>
        </select>
        <select
            className="border rounded-lg px-3 py-2 m-3"
            value={status}
            onChange={e => setStatus(e.target.value)}
        >
            <option value="">All Status</option>
            <option value="published">Completed</option>
            <option value="draft">Ongoing</option>
        </select>
        <input  
            className="border rounded-lg px-3 py-2 m-3"
            type="text"
            placeholder="Search Course" />
        <select
            className="border rounded-lg px-3 py-2"
            value={status}
            onChange={e => setStatus(e.target.value)}
        >
            <option value="">All Courses</option>
            {courses.map((info, index)=>{ return (<option key={index} value={info.id}>{info.title}</option>)})}
            
            
        </select>
        <Table list={listData}/>
    </div>
  );
}
