import { useEffect, useState } from "react";
import { Users, BookOpen, GraduationCap, Activity } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../../../api";
import Table from './Table'
import { PieChart } from '@mui/x-charts/PieChart';
import { ResponsivePie } from '@nivo/pie';

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
  const [courseId, setCourseId] = useState("")
  const [courseData, setCourseData] = useState([])

  useEffect(() => {
    const fetchData = async ()=>{

        const [fetchData, publish, traineeProgress, courses, masterlist, courseMasterList] = await Promise.all([
            axios.get(`${API_URL}/admin/dashboard`, {withCredentials: true}),
            axios.get(`${API_URL}/admin/publishcountcourses`, {withCredentials: true}),
            axios.get(`${API_URL}/admin/MasterList/traineeprogress`, {withCredentials: true}),
            axios.get(`${API_URL}/admin/course`, {withCredentials: true}),
            axios.get(`${API_URL}/admin/MasterList?role=${role}&course=${courseId}`, {withCredentials: true})
            
            ])
        
        let trainee = fetchData.data.traineeCount
        let trainer = fetchData.data.trainerCount
        setUsers(trainee + trainer)
        settrainer(trainer)
        settrainee(trainee)
        setCourses(courses.data.data)
        setPublishCount(publish.data.data)
        setProgress(traineeProgress.data.data)
        setListData(masterlist.data.data)
        setCourseData(courseMasterList.data.data)
    }

        fetchData()
    }, [role, courseId]);
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
    const ongoing = result.filter(info=>info.percentage !== 100  ).length;
    const ongoingtrainee = result.filter(info=>info.done !== info.total)


  const notStarted = trainee - completed - ongoing;
  console.log(ongoingtrainee)
  const data = [
    { id: 'Completed', label: 'Completed', value: completed, color: '#00B894' },
    { id: 'Ongoing', label: 'Ongoing', value: ongoing, color: '#0984e3' },
    { id: 'Not Started', label: 'Not Started', value: notStarted, color: '#fd7e14' },
  ];

  const total = completed + ongoing + notStarted;
  const percentage = ((completed / total) * 100).toFixed(1);
console.log(courseId)
  return (
    <div className="p-5 bg-slate-100 min-h-screen">
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

            <div className="flex w-full ">
          {/* Donut Chart */}
          <div className="w-50 relative ">
            <ResponsivePie
              data={data}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              innerRadius={0.75} // donut thickness
              padAngle={0.5}
              cornerRadius={3}
              colors={(d) => d.data.color}
              enableArcLinkLabels={false}
              enableArcLabels={false}
              activeOuterRadiusOffset={8} // slice grows on hover
            />
            {/* Center percentage */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              {percentage}%
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
            {data.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '3px' }} />
                <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {((item.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

            
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
            className="border rounded-lg px-3 py-2"
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
        >
            <option value="">All Courses</option>
            {courses.map((info, index)=>{ return (<option key={index} value={info.id}>{info.title}</option>)})}
        </select>
        <Table list={listData}/>
    </div>
  );
}
