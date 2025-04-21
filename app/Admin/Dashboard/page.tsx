"use client"; 
import { useEffect, useState } from "react"; 
import axios from "axios"; 
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie 
} from "recharts"; 
import { motion } from "framer-motion"; 
import { Bell, Users, PlusCircle, FileText, BarChart2 } from "lucide-react"; 
import AdminLayout from "@/AdminLayout"; 

const dataLine = [ 
  { name: "1", value: 2 }, 
  { name: "2", value: 4 }, 
  { name: "3", value: 3 }, 
  { name: "4", value: 6 }, 
  { name: "5", value: 5 }, 
  { name: "6", value: 8 } 
]; 

const dataBar = [ 
  { name: "Jan", value: 3 }, 
  { name: "Feb", value: 6 }, 
  { name: "Mar", value: 2 }, 
  { name: "Apr", value: 7 } 
]; 

const dataPie = [ 
  { name: "Recruiters", value: 400 }, 
  { name: "Managers", value: 300 }, 
  { name: "HR Staff", value: 300 } 
]; 

export default function AdminDashboard() { 

  const [roleCounts, setRoleCounts] = useState<{ [key: string]: number }>({}); 
  const [loading, setLoading] = useState(true); 
  const [userId, setUserId] = useState<string | null>(null);
  const [company, setCompany] = useState<any>(null);


  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/users/userId", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
  
        setUserId(data.userId);
  
        // 👇 Appel pour les statistiques de rôles
        const roleRes = await axios.get(`http://localhost:4000/api/users/count-by-role/${data.userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setRoleCounts(roleRes.data);
  
        // 👇 Appel pour les infos d'entreprise
        const companyRes = await axios.get(`http://localhost:5000/api/companies/by-admin/${data.userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setCompany(companyRes.data);
        
      } catch (error) {
        console.error("Error fetching admin or company data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);
  
  const roleLabels = ["Recruiters", "Managers", "HR"];
  const keyMap: { [label: string]: string } = { Recruiters: "Recruteur", Managers: "Manager", HR: "RH" };

  return (
    <AdminLayout>
      <main className="p-6 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Bell size={22} className="text-blue-600 cursor-pointer" />
            <span className="font-semibold text-gray-800">Admin Dashboard</span>
          </div>
        </div>

        {/* Welcome Box */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl shadow-lg p-6 flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-all">            Edit Profile
          </button>
        </div>

        {company && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white p-6 rounded-xl shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
    <div className="flex items-center gap-4">
      <img
        src={company.logo|| "/images/default-companylogo.png"}
        alt="Company Logo"
        className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
      />
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{company.name}</h3>
        <p className="text-sm text-gray-600">
          {company.industry === "Other" ? company.otherIndustry : company.industry} • {company.companySize}
        </p>
      </div>
    </div>

    <div className="flex gap-3 mt-4 sm:mt-0">
      <button
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        onClick={() => window.location.href = "/Admin/Company-profile"}
      >
        View Profile
      </button>
      <button
        className="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-all"
        onClick={() => window.location.href = "/Admin/Edite-CompanyProfile"}
      >
        Edit
      </button>
    </div>
  </motion.div>
)}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {roleLabels.map((label) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-5 rounded-xl shadow-lg text-center"
            >
              <Users size={28} className="text-blue-600 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-gray-700">{label}</h4>
              <p className="text-2xl text-gray-900 font-bold">
                {loading ? "..." : roleCounts[keyMap[label] || label] || 0}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts and Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Users</h3>
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="border-b bg-gray-100 text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {[["John Doe", "Recruiter"], ["Jane Smith", "Manager"], ["Alice Johnson", "HR Staff"]].map(
                  ([name, role]) => (
                    <tr key={name} className="hover:bg-gray-50 border-b">
                      <td className="p-2">{name}</td>
                      <td className="p-2">{role}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Recruitment Statistics</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dataLine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar and Pie Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataBar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Recruitment Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={dataPie} dataKey="value" nameKey="name" outerRadius={80} fill="#3b82f6" label />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-yellow-600 transition-all"
            >
              <Users size={18} /> View Recruitments
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-purple-600 transition-all"
            >
              <Users size={18} /> Manage Users
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-700 transition-all"
            >
              <FileText size={18} /> View Reports
            </motion.button>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
