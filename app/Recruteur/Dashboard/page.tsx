'use client';

import {
  Briefcase,
  Users,
  CalendarClock,
  Trash2,
  Plus,
  Edit3,
  Settings,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Listbox } from '@headlessui/react';
import NavbarAdmin from '@/app/components/NavbarAdmin';

const filterOptions = ['All', 'Applications', 'Postings', 'Interviews'];

const RecruteurPage = () => {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => NProgress.done(), 500);
    return () => clearTimeout(timer);
  }, []);

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

  const filteredActivities = activities
    .filter((a) =>
      (selectedFilter === 'All' || a.type === selectedFilter) &&
      a.text.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
    <NavbarAdmin/>
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex">

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-10 py-6 bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-30 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Recruiter 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Manage candidates, jobs, and interviews with ease</p>
          </div>
          <ProfileCard />
        </header>

        <main className="flex-1 px-6 sm:px-10 py-10">
          {/* Search & Settings */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search candidates, jobs, interviews..."
              className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>

          {/* Cards */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Candidates" value="120" icon={<Users className="w-8 h-8 text-blue-600" />} subtitle="Total registered" />
            <Card title="Job Postings" value="8" icon={<Briefcase className="w-8 h-8 text-purple-600" />} subtitle="Currently active" />
            <Card title="Interviews" value="5" icon={<CalendarClock className="w-8 h-8 text-green-600" />} subtitle="Scheduled this week" />
          </section>

          {/* Chart */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidate Growth</h2>
            <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="candidates" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Filterable Activities */}
          <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
              <Listbox value={selectedFilter} onChange={setSelectedFilter}>
                <div className="relative w-48">
                  <Listbox.Button className="w-full py-2 px-4 border rounded-lg shadow-sm bg-white text-sm text-gray-700">
                    {selectedFilter}
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filterOptions.map((opt) => (
                      <Listbox.Option
                        key={opt}
                        value={opt}
                        className={({ active }) =>
                          `cursor-pointer px-4 py-2 text-sm ${
                            active ? 'bg-blue-100' : ''
                          }`
                        }
                      >
                        {opt}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <ul className="space-y-3">
              {filteredActivities.map((activity, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-white/80 backdrop-blur p-4 rounded-xl border border-gray-200 hover:shadow-md transition"
                >
                  <span className="text-gray-700 font-medium">✔️ {activity.text}</span>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </main>

        {/* Floating Buttons */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
          <FloatingButton icon={<Plus className="w-6 h-6" />} bg="bg-blue-600" hover="hover:bg-blue-700" />
          <FloatingButton icon={<Edit3 className="w-6 h-6" />} bg="bg-yellow-500" hover="hover:bg-yellow-600" />
          <FloatingButton icon={<Trash2 className="w-6 h-6" />} bg="bg-red-600" hover="hover:bg-red-700" />
        </div>

      
      </div>
    </div>
    </>
  );
};

const ProfileCard = () => (
  <div className="flex items-center gap-4 bg-white/80 backdrop-blur border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
    <img
      src="https://i.pravatar.cc/40?img=23"
      alt="Recruiter Avatar"
      className="w-10 h-10 rounded-full object-cover"
    />
    <div className="text-sm">
      <p className="font-medium text-gray-900">Khadija Chakkour</p>
      <p className="text-gray-500 text-xs">Senior Recruiter</p>
    </div>
  </div>
);

const Card = ({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: string;
}) => (
  <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-3xl font-bold text-blue-700 mt-2">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      {icon}
    </div>
  </div>
);

const FloatingButton = ({
  icon,
  bg,
  hover,
}: {
  icon: React.ReactNode;
  bg: string;
  hover: string;
}) => (
  <button className={`${bg} ${hover} p-4 rounded-full shadow-lg text-white transition`}>
    {icon}
  </button>
);

export default RecruteurPage;
