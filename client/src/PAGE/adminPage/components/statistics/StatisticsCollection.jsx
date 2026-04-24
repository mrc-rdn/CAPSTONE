import { useEffect, useState } from "react";
import { Users, BookOpen, GraduationCap, ChevronDown, Activity, BarChart3 } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../../../api";
import Table from './Table';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-800/60 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none group hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Data</span>
    </div>
    <div>
      <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{value ?? "—"}</h2>
      {subtitle && <p className="text-[10px] mt-2 font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{subtitle}</p>}
    </div>
  </div>
);

export default function StatisticsCollection() {
  const [users, setUsers] = useState(null);
  const [trainee, settrainee] = useState(null);
  const [trainer, settrainer] = useState(null);
  const [publishCount, setPublishCount] = useState([]);
  const [progress, setProgress] = useState([]);
  const [courses, setCourses] = useState([]);
  const [listData, setListData] = useState([]);
  const [role, setRole] = useState("");
  const [courseId, setCourseId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, publishRes, progressRes, coursesRes, masterRes] = await Promise.all([
          axios.get(`${API_URL}/admin/dashboard`, { withCredentials: true }),
          axios.get(`${API_URL}/admin/publishcountcourses`, { withCredentials: true }),
          axios.get(`${API_URL}/admin/MasterList/traineeprogress`, { withCredentials: true }),
          axios.get(`${API_URL}/admin/course`, { withCredentials: true }),
          axios.get(`${API_URL}/admin/MasterList?role=${role}&course=${courseId}`, { withCredentials: true })
        ]);

        setUsers(dashRes.data.traineeCount + dashRes.data.trainerCount);
        settrainer(dashRes.data.trainerCount);
        settrainee(dashRes.data.traineeCount);
        setCourses(coursesRes.data.data);
        setPublishCount(publishRes.data.data);
        setProgress(progressRes.data.data);
        setListData(masterRes.data.data);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };
    fetchData();
  }, [role, courseId]);

  function getCompletionPercentagePerUser(data) {
    const usersObj = {};
    data.forEach(item => {
      const userId = item.user_id;
      if (!usersObj[userId]) {
        usersObj[userId] = { user_id: userId, courseTitle: item.title, first_name: item.first_name, surname: item.surname, total: 0, done: 0 };
      }
      usersObj[userId].total += 1;
      if (item.is_done) usersObj[userId].done += 1;
    });
    return Object.values(usersObj).map(user => ({
      ...user,
      percentage: Math.round((user.done / user.total) * 100)
    }));
  }

  // --- DATA CALCULATIONS ---
  const result = getCompletionPercentagePerUser(progress);
  const publishedCount = publishCount.filter(c => c.has_enrollments).length;
  const draftsCount = publishCount.filter(c => !c.has_enrollments).length;
  
  const completed = result.filter(info => info.percentage === 100).length;
  const ongoing = result.filter(info => info.percentage !== 100).length;
  const notStarted = Math.max(0, (trainee || 0) - completed - ongoing);

  // Define total before using it in calculations
  const total = completed + ongoing + notStarted;
  const percentage = total > 0 ? ((completed / total) * 100).toFixed(0) : 0;

  const pieData = [
    { id: 'Done', label: 'Done', value: completed, color: '#10b981' },
    { id: 'Active', label: 'Active', value: ongoing, color: '#3b82f6' },
    { id: 'None', label: 'None', value: notStarted, color: '#94a3b8' },
  ];

  const lineData = [{
    id: "growth",
    color: "#10b981",
    data: [
      { x: "Jan", y: 12 }, { x: "Feb", y: 24 }, { x: "Mar", y: 35 }, { x: "Apr", y: users || 0 }
    ]
  }];

  const barData = courses.slice(0, 5).map(c => ({
    course: c.title.length > 10 ? c.title.substring(0, 10) + '...' : c.title,
    enrolled: Math.floor(Math.random() * 30) + 5, // Mock enrollment data
  }));

  const chartTheme = {
    textColor: "#94a3b8",
    fontSize: 10,
    axis: { domain: { line: { stroke: "transparent" } }, ticks: { line: { stroke: "#e2e8f0", strokeWidth: 1 } } },
    grid: { line: { stroke: "#e2e8f0", strokeWidth: 1, strokeDasharray: "4 4" } }
  };

  const selectClass = "bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all appearance-none cursor-pointer";

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">System Performance</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time database analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className={selectClass} value={role} onChange={e => setRole(e.target.value)}>
              <option value="">All Roles</option>
              <option value="TRAINEE">Trainee</option>
              <option value="TRAINER">Trainer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select className={selectClass} value={courseId} onChange={e => setCourseId(e.target.value)}>
              <option value="">All Courses</option>
              {courses.map((info, index) => (
                <option key={index} value={info.id}>{info.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Platform Users" value={users} subtitle={`${trainee || 0} students · ${trainer || 0} instructors`} icon={Users} colorClass="bg-emerald-500" />
        <StatCard title="Enrollment Base" value={trainee} subtitle={`${completed} completed · ${ongoing} in progress`} icon={GraduationCap} colorClass="bg-blue-500" />
        <StatCard title="Course Library" value={courses.length} subtitle={`${publishedCount} published · ${draftsCount} drafts`} icon={BookOpen} colorClass="bg-amber-500" />
        
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-800/60 rounded-[2rem] p-5 shadow-xl flex items-center gap-4">
          <div className="w-24 h-24 relative shrink-0">
            <ResponsivePie data={pieData} innerRadius={0.75} padAngle={2} cornerRadius={4} colors={(d) => d.data.color} enableArcLinkLabels={false} enableArcLabels={false} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-black text-slate-800 dark:text-white leading-none">{percentage}%</span>
              <span className="text-[7px] font-black text-slate-400 uppercase">Rate</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            {pieData.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{item.label}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2 mb-8">
            <Activity className="w-4 h-4 text-emerald-500" /> User Growth Trend
          </h3>
          <div className="h-64">
            <ResponsiveLine
              data={lineData}
              theme={chartTheme}
              margin={{ top: 10, right: 10, bottom: 40, left: 30 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
              enableArea={true}
              areaOpacity={0.1}
              useMesh={true}
              colors={["#10b981"]}
              curve="catmullRom"
              pointSize={8}
              pointColor="#ffffff"
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
            />
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2 mb-8">
            <BarChart3 className="w-4 h-4 text-blue-500" /> Enrollment Metrics
          </h3>
          <div className="h-64">
            <ResponsiveBar
              data={barData}
              theme={chartTheme}
              keys={['enrolled']}
              indexBy="course"
              margin={{ top: 10, right: 10, bottom: 40, left: 30 }}
              padding={0.5}
              colors={["#3b82f6"]}
              borderRadius={6}
              labelSkipHeight={12}
              enableGridY={true}
              axisLeft={{ tickSize: 0, tickPadding: 10 }}
              axisBottom={{ tickSize: 0, tickPadding: 10 }}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] p-2">
         <Table list={listData} result={result} users={progress}/>
      </div>
    </div>
  );
}