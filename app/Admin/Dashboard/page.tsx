"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";
import { Home, Users, Settings, Bell, Building, PlusCircle, Menu } from "lucide-react";
import NavbarAdmin from '@/app/components/NavbarAdmin';

const data = [
  { name: "1", value: 2 },
  { name: "2", value: 4 },
  { name: "3", value: 3 },
  { name: "4", value: 6 },
  { name: "5", value: 5 },
  { name: "6", value: 8 }
];

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  //const [companyProfile, setCompanyProfile] = useState(null);  // State pour stocker le profil de l'entreprise
  //const [error, setError] = useState('');

  /*useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get('/api/companies/profile', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        });
        setCompanyProfile(response.data);  // On met à jour le profil de l'entreprise
      } catch (err) {
        setError("Erreur lors de la récupération du profil d'entreprise");
        console.error(err);
      }
    };

    fetchCompanyProfile();
  }, []);*/

  // Fonction pour basculer l'état du menu
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <NavbarAdmin />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-blue-900 text-white flex flex-col p-5 transition-transform duration-300 ${
            isSidebarOpen ? "transform-none" : "transform -translate-x-full"
          }`}
        >
          <button
            onClick={toggleSidebar}
            className="absolute top-5 left-5 text-white z-20 lg:hidden"
          >
            <Menu size={40} />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Home size={24} /> Admin Dashboard
          </h1>
          <nav className="mt-6 space-y-4">
            <Link href="#" className="flex items-center gap-2 text-blue-300 hover:text-white">
              <Home size={20} /> Dashboard
            </Link>
            <Link href="/Admin/Company-profile" className="flex items-center gap-2 hover:text-blue-300">
              <Building size={20} /> Company Profile
            </Link>
            <Link href="/Admin/Manage-users" className="flex items-center gap-2 hover:text-blue-300">
              <Users size={20} /> Manage Users
            </Link>
            <Link href="#" className="flex items-center gap-2 hover:text-blue-300">
              <Settings size={20} /> Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 mt-20"> {/* Added margin-top to avoid navbar overlap */}
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Bell size={24} className="text-gray-500 cursor-pointer" />
              <span className="font-semibold">Admin</span>
            </div>
          </header>

          {/* Company Overview */}
          <section className="mt-6 bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Edit Profile
              </button>
            </div>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white shadow-lg p-4 rounded-lg text-center">
              <Users size={32} className="mx-auto text-blue-600" />
              <h4 className="text-lg font-bold">Recruiters</h4>
              <p className="text-gray-600 text-xl">5</p>
            </div>
            <div className="bg-white shadow-lg p-4 rounded-lg text-center">
              <Users size={32} className="mx-auto text-blue-600" />
              <h4 className="text-lg font-bold">Managers</h4>
              <p className="text-gray-600 text-xl">12</p>
            </div>
            <div className="bg-white shadow-lg p-4 rounded-lg text-center">
              <Users size={32} className="mx-auto text-blue-600" />
              <h4 className="text-lg font-bold">HR Staff</h4>
              <p className="text-gray-600 text-xl">7</p>
            </div>
          </div>

          {/* Users & Statistics */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Users</h3>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Name</th>
                    <th className="p-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">John Doe</td>
                    <td className="p-2">Recruiter</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Jane Smith</td>
                    <td className="p-2">Manager</td>
                  </tr>
                  <tr>
                    <td className="p-2">Alice Johnson</td>
                    <td className="p-2">HR Staff</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Recruitment Statistics</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white shadow-lg p-6 rounded-lg mt-6">
            <h3 className="text-lg font-bold mb-4">Actions</h3>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Users size={20} /> View Recruitments
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Users size={20} /> Manage Users
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <PlusCircle size={20} /> Add Recruiter
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
