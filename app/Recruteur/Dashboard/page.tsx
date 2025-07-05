'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Users, Briefcase, CalendarClock, PlusCircle, MessageCircle, Loader2} from 'lucide-react';
import RecruteurLayout from '@/RecruteurLayout';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, Cell } from 'recharts';
import Select from 'react-select';
import { ApplicationModesIcons } from "../../components/ApplicationModesIcons";
import MessagesSection from '@/app/components/MessagesSection';

interface  Department {
  id: number;
  name: string;
}

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RecruteurPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null)
  const [jobOffers, setJobOffers] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [offersWithCounts, setOffersWithCounts] = useState<any[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<any[]>([]);
  const migrateTasks = (oldTasks: any[]): { text: string; done: boolean; createdAt: string }[] =>
  oldTasks.map(task => ({
    text: task.text,
    done: task.done,
    createdAt: task.createdAt ? new Date(task.createdAt).toISOString() : new Date().toISOString(),
  }));
  const [tasks, setTasks] = useState<{ text: string; done: boolean; createdAt: string }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recruiter_tasks');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return migrateTasks(parsed);
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [newTask, setNewTask] = useState('');
  const router = useRouter();


  const data = [
    { month: 'Jan', candidates: 40 },
    { month: 'Feb', candidates: 80 },
    { month: 'Mar', candidates: 65 },
    { month: 'Apr', candidates: 100 },
    { month: 'May', candidates: 120 },
  ];


const messages = [
  {
    id: 1,
    name: "Emily Johnson",
    role: "Frontend Developer",
    message: "Hi, I just submitted my application. Can you please confirm if it was received?",
    time: "2 hours ago",
  },
  {
    id: 2,
    name: "Liam Smith",
    role: "DevOps Engineer",
    message: "I'm interested in the position. Could you clarify if remote work is allowed?",
    time: "4 hours ago",
  },
  {
    id: 3,
    name: "Sophia Lee",
    role: "Data Analyst",
    message: "I had an interview last week and wanted to ask if there is any update regarding the next steps?",
    time: "1 day ago",
  },
  {
    id: 4,
    name: "Noah Brown",
    role: "Backend Developer",
    message: "Hello, I noticed that the job listing was updated. Is the salary range still the same?",
    time: "2 days ago",
  },
  {
    id: 5,
    name: "Olivia Davis",
    role: "Project Manager",
    message: "Just letting you know I will be unavailable for a call tomorrow. Can we reschedule?",
    time: "3 days ago",
  },
];

  const [offersCount, setOffersCount] = useState<number>(0);

  // Agenda widget state
  const [agendaInterviews, setAgendaInterviews] = useState<any[]>([]);
  const [selectedAgendaDay, setSelectedAgendaDay] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/userId`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        if (data.userId) {
          const jobsRes = await axios.get(`${API_BASE_URL}/api/offers/by-recruiter/${data.userId}`);
          setJobOffers(jobsRes.data);
        }
        setUserId(data.userId);
        const response = await axios.get(`${API_BASE_URL}/api/companies/user-departments/${data.userId}`);
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchOffersWithCounts = async () => {
      if (!userId) return;
      try {
        const offersRes = await axios.get(`${API_BASE_URL}/api/offers/by-recruiter/${userId}`);
        const offers = offersRes.data;
        const offersWithCounts = await Promise.all(
          offers.map(async (offer: any) => {
            try {
              const countRes = await axios.get(`${API_BASE_URL}/api/candidatures/count/by-offer/${offer.id}`);
              return { ...offer, candidatureCount: countRes.data.candidatureCount };
            } catch {
              return { ...offer, candidatureCount: 0 };
            }
          })
        );
        setOffersWithCounts(offersWithCounts);
      } catch (err) {
        setOffersWithCounts([]);
      }
    };

    const fetchOffersCount = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/offers/count-by-recruiter/${userId}`);
        setOffersCount(res.data.offerCount || 0);
      } catch {
        setOffersCount(0);
      }
    };

    const fetchAgendaInterviews = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/userId`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        if (data.userId) {
          const res = await axios.get(`${API_BASE_URL}/api/entretiens/recruteur/${data.userId}`);
          setAgendaInterviews(res.data);
        }
      } catch {
        setAgendaInterviews([]);
      } 
    };

    fetchDepartments();
    if (userId) {
      fetchOffersWithCounts();
      fetchOffersCount();
      fetchAgendaInterviews();
    }
  }, [userId]);

  const stats = [
    { icon: Users, title: 'Candidatures', value: '2', color: 'from-[#007bff] to-[#00b4d8]' },
    { icon: Briefcase, title: 'Shortlistés', value: '0', color: 'from-[#023e8a] to-[#007bff]' },
    { icon: CalendarClock, title: 'En attente', value: '2', color: 'from-[#4ea8de] to-[#007bff]' },
    { icon: MessageCircle, title: 'Messages', value: '24', color: 'from-[#00b4d8] to-[#caf0f8]' },
  ];

  // Persist tasks to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('recruiter_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([
        ...tasks,
        {
          text: newTask,
          done: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewTask('');
    }
  };
  const handleToggleTask = (idx: number) => {
    setTasks(tasks.map((task, i) => i === idx ? { ...task, done: !task.done } : task));
  };
  const handleDeleteTask = (idx: number) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const [editingTaskIdx, setEditingTaskIdx] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const handleEditTask = (idx: number) => {
    setEditingTaskIdx(idx);
    setEditingTaskText(tasks[idx].text);
  };
  const handleEditTaskSave = (idx: number) => {
    setTasks(tasks.map((task, i) => i === idx ? { ...task, text: editingTaskText } : task));
    setEditingTaskIdx(null);
    setEditingTaskText('');
  };

  function getFormattedDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  const [isMounted, setIsMounted] = useState(false);
  const [currentJobsPage, setCurrentJobsPage] = useState(1);
  const jobsPerPage = 3;
  const totalJobsPages = Math.ceil(jobOffers.length / jobsPerPage);
  const paginatedJobOffers = jobOffers.slice((currentJobsPage - 1) * jobsPerPage, currentJobsPage * jobsPerPage);
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) {
    return  <div className="flex justify-center items-center min-h-screen bg-white w-full">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>;}

  function getStartOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
  function getWeekDays() {
    const start = getStartOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }
  const weekDays = getWeekDays();

  // Filter interviews for selected day
  const agendaInterviewsForDay = (day: Date) =>
    agendaInterviews.filter(e => {
      if (!e.date) return false;
      const edate = new Date(e.date);
      return (
        edate.getFullYear() === day.getFullYear() &&
        edate.getMonth() === day.getMonth() &&
        edate.getDate() === day.getDate()
      );
    });

  return (
    <RecruteurLayout>
      <main className="w-full min-h-screen font-sans bg-white px-2 sm:px-8 lg:px-14 pb-14">
        <div className="h-8" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex justify-end">
          <button
            onClick={() => router.push('/Recruteur/Jobs/ChooseType')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#00b4d8] to-[#007bff] text-white px-7 py-3 rounded-full shadow-lg hover:from-[#4ea8de] hover:to-[#007bff] transition-transform transform hover:scale-105 font-semibold text-base drop-shadow-md">
            <PlusCircle className="w-5 h-5" />
            New offer
          </button>
        </motion.div>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-[#caf0f8] hover:shadow-xl transition-all flex flex-col items-center w-full py-8 px-4 group relative overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${stat.color} text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <h4 className="text-base font-semibold text-[#023e8a] mb-1 tracking-wide">{stat.title === 'Candidatures' ? 'Applications' : stat.title === 'Shortlistés' ? 'Shortlisted' : stat.title === 'En attente' ? 'Pending' : stat.title}</h4>
              <p className={`text-2xl font-extrabold tracking-tight ${
                stat.title === 'Candidatures' ? 'text-[#ff9800]' : 
                stat.title === 'Shortlistés' ? 'text-[#43a047]' : 
                stat.title === 'En attente' ? 'text-[#fbc02d]' : 
                stat.title === 'Messages' ? 'text-[#e53935]' : 
                'text-[#007bff]'
              }`}>{stat.value}</p>
            </motion.div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-16 w-full"
        >
          <div className="relative flex flex-col items-center">
            <h2 className="text-2xl font-extrabold text-blue-900 mb-8 flex items-center gap-3">
              {ApplicationModesIcons.sparkles}
              Application Review Modes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl">
              {/* Manual Review Card */}
              <motion.div
                whileHover={{ y: -6, scale: 1.03, boxShadow: '0 8px 32px 0 rgba(59,130,246,0.10)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-200 shadow-lg flex flex-col items-start gap-4 hover:shadow-2xl transition-all duration-200 h-full min-h-[340px] p-8 md:p-12 w-full max-w-xl mx-auto"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 rounded-full p-4 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {ApplicationModesIcons.manual}
                  </div>
                  <span className="text-blue-700 font-semibold text-base">Manual Review</span>
                </div>
                <h3 className="font-bold text-blue-900 text-2xl mb-2">Human-Driven Selection</h3>
                <p className="text-blue-700 text-base mb-4 leading-relaxed">Browse and manage all applications for an offer, without any automatic sorting. Perfect for a classic, human-driven selection process. You have full control over every application.</p>
                <a href="/Recruteur/Applications/All"
                  className="mt-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white px-7 py-2.5 rounded-full text-base font-semibold shadow hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200">
                  View All Applications
                </a>
              </motion.div>
              {/* AI Review Card */}
              <motion.div
                whileHover={{ y: -6, scale: 1.03, boxShadow: '0 8px 32px 0 rgba(16,185,129,0.10)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group bg-gradient-to-br from-white to-green-50 rounded-2xl border border-green-200 shadow-lg flex flex-col items-start gap-4 hover:shadow-2xl transition-all duration-200 h-full min-h-[340px] p-8 md:p-12 w-full max-w-xl mx-auto"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 rounded-full p-4 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {ApplicationModesIcons.ai}
                  </div>
                  <span className="text-green-700 font-semibold text-base">AI-Powered</span>
                </div>
                <h3 className="font-bold text-green-900 text-2xl mb-2">Smart & Fast with AI</h3>
                <p className="text-green-700 text-base mb-4 leading-relaxed">Let our AI sort and score applications by their match with the job offer. Instantly see the most relevant candidates and their matching score, saving you time and effort.</p>
                <a href="/Recruteur/Applications/PreselectedApplication"
                  className="mt-auto bg-gradient-to-r from-green-500 to-blue-500 text-white px-7 py-2.5 rounded-full text-base font-semibold shadow hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-200">
                  See AI Recommendations
                </a>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Chart and Top Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-[#caf0f8] w-full"
          >
            <h3 className="text-lg font-bold text-[#023e8a] mb-6">Applications trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                <XAxis dataKey="month" stroke="#1e40af" fontSize={13} />
                <YAxis stroke="#1e40af" fontSize={13} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(59,130,246,0.08)',
                    border: 'none',
                    backgroundColor: 'white',
                  }}
                />
                <Line type="monotone" dataKey="candidates" stroke="#2563eb" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
          {offersWithCounts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-xl border border-[#eaf6ff] w-full"
            >
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h3 className="text-lg font-bold text-[#023e8a] flex items-center gap-2 mb-0">
                  <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#007bff] to-[#00b4d8] mr-2"></span>
                  Applications per Offer
                </h3>
                <div className="w-full md:w-90">
                  <Select
                    isMulti
                    options={offersWithCounts.map(offer => ({ value: offer.id, label: offer.title }))}
                    value={selectedOffers}
                    onChange={(newValue) => setSelectedOffers([...newValue])}
                    placeholder="Filter offers..."
                    classNamePrefix="react-select"
                    styles={{
                      control: (base: any) => ({ ...base, borderColor: '#007bff', boxShadow: 'none', minHeight: 44 }),
                      multiValue: (base: any) => ({ ...base, backgroundColor: '#eaf6ff', color: '#007bff' }),
                      multiValueLabel: (base: any) => ({ ...base, color: '#007bff', fontWeight: 600 }),
                      option: (base: any, state: any) => ({ ...base, color: state.isSelected ? '#fff' : '#023e8a', backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#eaf6ff' : '#fff' }),
                    }}
                  />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={
                    (selectedOffers.length > 0
                      ? offersWithCounts.filter(offer => selectedOffers.some(sel => sel.value === offer.id))
                      : offersWithCounts
                    ).map(offer => ({ name: offer.title, count: offer.candidatureCount }))
                  }
                  margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                  barCategoryGap={30}
                  barGap={6}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eaf6ff" vertical={false} />
                  <XAxis dataKey="name" stroke="#007bff" fontSize={14} angle={-18} textAnchor="end" interval={0} height={60} tickLine={false} axisLine={{stroke:'#caf0f8'}} />
                  <YAxis stroke="#007bff" fontSize={14} allowDecimals={false} tickLine={false} axisLine={{stroke:'#caf0f8'}} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      boxShadow: '0 6px 24px rgba(0,123,255,0.08)',
                      border: 'none',
                      backgroundColor: '#f8fbff',
                      color: '#023e8a',
                      fontWeight: 600,
                    }}
                    cursor={{ fill: '#eaf6ff' }}
                  />
                  <Bar dataKey="count" radius={[12, 12, 0, 0]} minPointSize={2}>
                    {(selectedOffers.length > 0
                      ? offersWithCounts.filter(offer => selectedOffers.some(sel => sel.value === offer.id))
                      : offersWithCounts
                    ).map((offer, i) => (
                      <Cell key={`cell-${i}`} fill={i % 3 === 0 ? '#007bff' : i % 3 === 1 ? '#00b4d8' : '#4ea8de'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-2">
        {/* Departments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-[#caf0f8] mb-12 w-full">
          <h3 className="text-lg font-bold text-[#023e8a] mb-6">Departments</h3>
          {loading ? (
            <p className="text-[#00b4d8] text-base">Loading departments...</p>
          ) : error ? (
            <p className="text-red-500 text-base">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((department, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="bg-[#eaf6ff] p-6 rounded-xl border border-[#4ea8de] hover:bg-[#4ea8de] transition-transform transform hover:scale-[1.02] w-full shadow-sm"
                >
                  <h4 className="text-base font-semibold text-[#023e8a] mb-1">{department.name}</h4>
                  <p className="text-lg font-bold text-[#007bff]">{department.id}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      {/* Agenda Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-[#caf0f8] mb-12 w-full max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-[#023e8a] flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18"/></svg>
              Agenda (This week)
            </h3>
            <button
              onClick={() => router.push('/Recruteur/AgendaEntretien')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition text-sm"
            >
              View full agenda
            </button>
          </div>
          <div className="flex gap-2 justify-between">
            {weekDays.map((day, idx) => {
              const isToday = new Date().toDateString() === day.toDateString();
              const interviews = agendaInterviewsForDay(day);
              return (
                <div
                  key={idx}
                  className={`flex-1 flex flex-col items-center cursor-pointer rounded-lg px-2 py-2 border transition-all ${isToday ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-blue-200'} ${selectedAgendaDay === day.toDateString() ? 'ring-2 ring-blue-400' : ''}`}
                  onClick={() => setSelectedAgendaDay(day.toDateString())}
                >
                  <span className={`text-xs font-semibold mb-1 ${isToday ? 'text-blue-700' : 'text-gray-500'}`}>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className={`text-lg font-bold ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>{day.getDate()}</span>
                  {interviews.length > 0 && (
                    <span className="mt-1 text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-semibold">{interviews.length} interview{interviews.length > 1 ? 's' : ''}</span>
                  )}
                </div>
              );
            })}
          </div>
          {/* List interviews for selected day */}
          {selectedAgendaDay && (
            <div className="mt-6">
              <h4 className="text-base font-bold text-blue-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18"/></svg>
                Interviews on {new Date(selectedAgendaDay).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </h4>
              <ul className="space-y-2">
                {agendaInterviewsForDay(new Date(selectedAgendaDay)).length === 0 ? (
                  <li className="text-gray-400 text-sm">No interviews.</li>
                ) : (
                  agendaInterviewsForDay(new Date(selectedAgendaDay)).map((e, idx) => (
                    <li key={e.id || idx} className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 flex flex-col md:flex-row md:items-center gap-2">
                      <span className="font-semibold text-blue-900">{e.type === 'Visio' ? 'Video' : 'In-person'}</span>
                      <span className="text-gray-700">{e.candidate?.firstName} {e.candidate?.lastName}</span>
                      <span className="text-gray-500 text-xs">{e.date ? new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      <span className="text-gray-400 text-xs ml-auto">{e.lieu}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </motion.div>
        </div>

        {/* Tasks & Messages Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Tasks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-[#caf0f8] w-full"
          >
            <h3 className="text-lg font-bold text-[#023e8a] mb-6 flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#007bff] to-[#00b4d8] mr-2"></span>
              Tasks <span className="ml-2 text-sm text-gray-400">({tasks.length})</span>
            </h3>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 border border-[#007bff] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] text-base bg-white shadow-sm"
                onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }}
              />
              <button
                onClick={handleAddTask}
                className="flex items-center gap-2 bg-gradient-to-r from-[#00b4d8] to-[#007bff] text-white px-6 py-2 rounded-full font-semibold shadow hover:from-[#4ea8de] hover:to-[#007bff] transition-all text-base"
              >
                <PlusCircle className="w-5 h-5" /> Add
              </button>
            </div>
            {/* Séparation tâches en cours / terminées */}
            <div className="space-y-6">
              {/* Tâches en cours */}
              {tasks.filter(t => !t.done).length > 0 && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">In progress</div>
                  <ul className="space-y-3">
                    {tasks.map((task, idx) => !task.done && (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between bg-[#f8fbff] rounded-lg px-4 py-3 border border-[#eaf6ff] group hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleToggleTask(idx)}
                            className="accent-[#007bff] w-5 h-5 rounded-full border-2 border-[#007bff] focus:ring-2 focus:ring-[#00b4d8] transition"
                          />
                          {editingTaskIdx === idx ? (
                            <input
                              value={editingTaskText}
                              onChange={e => setEditingTaskText(e.target.value)}
                              onBlur={() => handleEditTaskSave(idx)}
                              onKeyDown={e => { if (e.key === 'Enter') handleEditTaskSave(idx); }}
                              className="text-base border-b border-[#007bff] bg-transparent focus:outline-none px-1 py-0.5 min-w-[120px]"
                              autoFocus
                            />
                          ) : (
                            <span
                              className="text-base text-[#023e8a] font-medium cursor-pointer hover:underline"
                              onClick={() => handleEditTask(idx)}
                            >
                              {task.text}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 italic mr-2">{isMounted && task.createdAt ? getFormattedDate(task.createdAt) : ''}</span>
                          <button
                            onClick={() => handleDeleteTask(idx)}
                            className="text-red-500 hover:text-red-700 font-bold text-lg px-2 opacity-70 hover:opacity-100 transition"
                            title="Delete task"
                          >
                            ×
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Tâches terminées */}
              {tasks.filter(t => t.done).length > 0 && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Completed</div>
                  <ul className="space-y-3">
                    {tasks.map((task, idx) => task.done && (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between bg-[#eaf6ff] rounded-lg px-4 py-3 border border-[#caf0f8] group opacity-70 hover:opacity-100 transition"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleToggleTask(idx)}
                            className="accent-[#43a047] w-5 h-5 rounded-full border-2 border-[#43a047] focus:ring-2 focus:ring-[#43a047] transition"
                          />
                          {editingTaskIdx === idx ? (
                            <input
                              value={editingTaskText}
                              onChange={e => setEditingTaskText(e.target.value)}
                              onBlur={() => handleEditTaskSave(idx)}
                              onKeyDown={e => { if (e.key === 'Enter') handleEditTaskSave(idx); }}
                              className="text-base border-b border-[#43a047] bg-transparent focus:outline-none px-1 py-0.5 min-w-[120px]"
                              autoFocus
                            />
                          ) : (
                            <span
                              className="text-base text-gray-400 line-through cursor-pointer hover:underline"
                              onClick={() => handleEditTask(idx)}
                            >
                              {task.text}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 italic mr-2">{isMounted && task.createdAt ? getFormattedDate(task.createdAt) : ''}</span>
                          <button
                            onClick={() => handleDeleteTask(idx)}
                            className="text-red-400 hover:text-red-700 font-bold text-lg px-2 opacity-60 hover:opacity-100 transition"
                            title="Delete task"
                          >
                            ×
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {tasks.length === 0 && (
                <div className="text-[#00b4d8] text-center py-8">No tasks yet.</div>
              )}
            </div>
          </motion.div>
          {/* Messages Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-[#caf0f8] w-full flex flex-col"
          >
           <MessagesSection />
          </motion.div>
        </div>

        {/* Job Offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-[#caf0f8] mb-12 w-full">
          <h3 className="text-lg font-bold text-[#023e8a] mb-6 flex items-center gap-3">
            Jobs
            <span className="ml-2 text-sm text-gray-400">({offersCount})</span>
          </h3>
          {jobOffers.length === 0 ? (
            <p className="text-[#00b4d8] text-base">No offer created yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedJobOffers.map((job: any, idx) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="bg-[#eaf6ff] p-6 rounded-xl border border-[#4ea8de] transition-transform transform hover:scale-[1.02] w-full flex flex-col justify-between shadow-sm"
                  >
                    <h4 className="text-base font-semibold text-[#023e8a] mb-2">{job.title}</h4>
                    <button
                      onClick={() => router.push(`/Recruteur/Jobs/ViewJob/${job.id}`)}
                      className="mt-4 w-full bg-gradient-to-r from-[#007bff] to-[#00b4d8] text-white py-2.5 rounded-full hover:from-[#4ea8de] hover:to-[#007bff] transition font-bold text-base shadow"
                    >
                      View details
                    </button>
                  </motion.div>
                ))}
              </div>
              {/* Pagination */}
              {totalJobsPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentJobsPage((p) => Math.max(1, p - 1))}
                    disabled={currentJobsPage === 1}
                    className={`px-3 py-1 rounded-full font-semibold text-[#007bff] border border-[#caf0f8] bg-white hover:bg-[#eaf6ff] transition disabled:opacity-50`}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalJobsPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentJobsPage(i + 1)}
                      className={`px-3 py-1 rounded-full font-semibold border ${currentJobsPage === i + 1 ? 'bg-gradient-to-r from-[#007bff] to-[#00b4d8] text-white' : 'text-[#007bff] border-[#caf0f8] bg-white hover:bg-[#eaf6ff]'} transition`}>
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentJobsPage((p) => Math.min(totalJobsPages, p + 1))}
                    disabled={currentJobsPage === totalJobsPages}
                    className={`px-3 py-1 rounded-full font-semibold text-[#007bff] border border-[#caf0f8] bg-white hover:bg-[#eaf6ff] transition disabled:opacity-50`}
                  >
                    Next
                  </button>
                </div>
              )}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => router.push('/Recruteur/Jobs/ManageOffers')}
                  className="bg-gradient-to-r from-[#00b4d8] to-[#007bff] text-white px-7 py-2.5 rounded-full font-semibold shadow hover:from-[#4ea8de] hover:to-[#007bff] transition-all">
                  Voir plus
                </button>
              </div>
            </>
          )}
        </motion.div>

       
      </main>
    </RecruteurLayout>
  );
};

export default RecruteurPage;