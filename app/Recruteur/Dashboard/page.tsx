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
import { Users, Briefcase, CalendarClock, PlusCircle, MessageCircle } from 'lucide-react';
import RecruteurLayout from '@/RecruteurLayout';
import { useRouter } from 'next/navigation';

interface Department {
  id: number;
  name: string;
}
const RecruteurPage = () => {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [departments, setDepartments] = useState<Department[]>([]); // Typage explicite
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); 
  const [jobOffers, setJobOffers] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const filterOptions = ['All', 'Applications', 'Postings', 'Interviews'];

  const data = [
    { month: 'Jan', candidates: 40 },
    { month: 'Feb', candidates: 80 },
    { month: 'Mar', candidates: 65 },
    { month: 'Apr', candidates: 100 },
    { month: 'May', candidates: 120 },
  ];

  const activities = [
    { type: 'Applications', text: 'New application from Sarah for Product Designer' },
    { type: 'Postings', text: 'Updated posting: Backend Developer' },
    { type: 'Interviews', text: 'Scheduled interview with Mark – Tuesday 3PM' },
  ];

  const messages = [
    { sender: 'Carol Ferdina', text: 'Can we schedule a meeting tomorrow?' },
    { sender: 'Rob Dial', text: 'The candidate has confirmed the interview.' },
  ];

  const filteredActivities = activities.filter(
    (a) =>
      (selectedFilter === 'All' || a.type === selectedFilter) &&
      a.text.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/users/userId", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        if (data.userId) {
          const jobsRes = await axios.get(`http://localhost:8081/api/offers/by-recruiter/${data.userId}`);
          setJobOffers(jobsRes.data);
        }        
        setUserId(data.userId);
        const response = await axios.get(`http://localhost:5000/api/companies/user-departments/${data.userId}`); // Replace with your API endpoint
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <RecruteurLayout>
      <main className="p-6 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Recruiter</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage candidates, jobs, and interviews with ease
            </p>
          </div>
          <button
            onClick={() => router.push('/Recruteur/Jobs/Create')} 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105">
          <PlusCircle className="w-5 h-5" />
            Add New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 rounded-xl shadow-lg text-center border border-gray-200"
          >
            <Users size={28} className="text-blue-500 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-700">Applications</h4>
            <p className="text-2xl text-gray-900 font-bold">12.2K</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 rounded-xl shadow-lg text-center border border-gray-200"
          >
            <Briefcase size={28} className="text-purple-500 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-700">Shortlisted</h4>
            <p className="text-2xl text-gray-900 font-bold">11.1K</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 rounded-xl shadow-lg text-center border border-gray-200"
          >
            <CalendarClock size={28} className="text-green-500 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-700">On-Hold</h4>
            <p className="text-2xl text-gray-900 font-bold">6.8K</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 rounded-xl shadow-lg text-center border border-gray-200"
          >
            <MessageCircle size={28} className="text-yellow-500 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-700">Messages</h4>
            <p className="text-2xl text-gray-900 font-bold">24</p>
          </motion.div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Candidate Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="candidates" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Active Jobs</h3>
            <ul className="space-y-3">
              {activities.map((activity, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-transform transform hover:scale-105"
                >
                  <span className="text-gray-700 font-medium">{activity.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Departments Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Departments</h3>
          {loading ? (
            <p>Loading departments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.map((department, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-50 p-5 rounded-lg shadow-md text-center border border-gray-200 hover:shadow-lg transition-transform transform"
                >
                  <h4 className="text-lg font-semibold text-gray-700">{department.name}</h4>
                  <p className="text-2xl text-gray-900 font-bold">{department.id}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
{/* Job Offers Section */}
<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
  <h3 className="text-lg font-semibold mb-4 text-gray-800">Job Offers Created</h3>
  {jobOffers.length === 0 ? (
    <p className="text-gray-500">No job offers created yet.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobOffers.map((job: any) => (
        <motion.div
          key={job.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-50 p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-transform" >
          <h4 className="text-lg font-semibold text-blue-700">{job.title}</h4>
          <button
            onClick={() => router.push(`/Recruteur/Jobs/ViewJob/${job.id}`)}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                View Details
          </button>
        </motion.div>
      ))}
    </div>
  )}
</div>

        {/* Messages and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Messages</h3>
            <ul className="space-y-3">
              {messages.map((message, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-transform transform hover:scale-105"
                >
                  <div>
                    <h4 className="text-gray-800 font-medium">{message.sender}</h4>
                    <p className="text-gray-600 text-sm">{message.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activities</h3>
            <ul className="space-y-3">
              {filteredActivities.map((activity, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-transform transform hover:scale-105"
                >
                  <span className="text-gray-700 font-medium">{activity.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </RecruteurLayout>
  );
};

export default RecruteurPage;