"use client"; 
import { useEffect, useState } from "react"; 
import axios from "axios"; 
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Users, FileText, Search, PlusCircle, Eye, Trash2 } from "lucide-react";
import AdminLayout from "@/AdminLayout"; 
import Swal from 'sweetalert2';
import Image from "next/image";
import type { Company } from "@/app/types/company";

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  role: string[];
  departments: unknown[];
}
export default function AdminDashboard() { 

  const [roleCounts, setRoleCounts] = useState<{ [key: string]: number }>({}); 
  const [userId, setUserId] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [recruitmentDistribution, setRecruitmentDistribution] = useState(dataPie);
  const [loadingDistribution, setLoadingDistribution] = useState(true);
  const [errorDistribution, setErrorDistribution] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/userId`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setUserId(data.userId);

        const roleRes = await axios.get(`${API_BASE_URL}/api/users/count-by-role/${data.userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setRoleCounts(roleRes.data);
  
        const companyRes = await axios.get(`${API_BASE_URL}/api/companies/by-admin/${data.userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setCompany(companyRes.data);
        
        const usersRes = await axios.get(`${API_BASE_URL}/api/users/users`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setUsers(usersRes.data);
        setFilteredUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching admin or company data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);
  
useEffect(() => {
    const filtered = users.filter(user => {
      const fullName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`.toLowerCase()
        : user.username.toLowerCase();
      const roles = user.role.join(" ").toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) || roles.includes(searchQuery.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleRetry = async () => {
    setErrorDistribution(null);
    setLoading(true);
    try {
      const usersRes = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });
      setUsers(usersRes.data);
      setFilteredUsers(usersRes.data);
    } catch {
      setErrorDistribution("Erreur lors du chargement des données. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

 const handleDeleteUser = async (userId: string) => {
  const result = await Swal.fire({
    title: "Delete this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "small-swal",
    }
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });
      setUsers(users.filter(user => user.id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
      Swal.fire({
        title: "Deleted!",
        text: "The user has been deleted.",
        icon: "success",
        customClass: {
          popup: "small-swal",
        }
      });
    } catch {
      setErrorDistribution("Error occurred while deleting the user.");
      Swal.fire({
        title: "Error",
        text: "Failed to delete the user.",
        icon: "error",
        customClass: {
          popup: "small-swal",
        }
      });
    }
  }
};


  const getInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.username[0].toUpperCase();
  };

  const roleLabels = ["Recruiters", "Managers", "HR"];
  const keyMap: { [label: string]: string } = { Recruiters: "Recruteur", Managers: "Manager", HR: "RH" };

  useEffect(() => {
    const fetchRecruitmentDistribution = async () => {
      setLoadingDistribution(true);
      setErrorDistribution(null);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/statistics/recruitment-distribution`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setRecruitmentDistribution(data);
      } catch {
        setErrorDistribution("Erreur lors du chargement de la répartition des utilisateurs.");
      } finally {
        setLoadingDistribution(false);
      }
    };
    fetchRecruitmentDistribution();
  }, []);

  return (
    <AdminLayout>
      <main className="w-full min-h-screen font-sans bg-white px-2 sm:px-8 lg:px-16 pt-28 pb-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {userId && users.length > 0 && (() => {
              const adminUser = users.find(u => u.id === userId);
              if (!adminUser) return null;
              return (
                <div className="flex items-center gap-3 bg-white border border-blue-100 rounded-xl shadow-sm px-4 py-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 border-2 border-blue-200 overflow-hidden">
                    <Image
                      src={"/images/default-avatar.png"}
                      alt="Avatar Admin"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-blue-900 text-base">
                      {adminUser.firstName && adminUser.lastName
                        ? `${adminUser.firstName} ${adminUser.lastName}`
                        : adminUser.username}
                    </span>
                    <span className="text-xs text-gray-500">Administrateur</span>
                  </div>
                </div>
              );
            })()}
            <Bell size={22} className="text-blue-600 cursor-pointer animate-bounce-slow ml-6" />
            <span className="font-bold text-2xl text-gray-900 tracking-tight drop-shadow-sm">Admin Dashboard</span>
          </div>
        </div>

        {/* Welcome Box */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl shadow-xl p-8 flex justify-between items-center mb-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-white drop-shadow">Welcome Back</h2>
        </div>

        {company && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white p-4 rounded-2xl shadow-xl mb-9 flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-100">
    <div className="flex items-center gap-6">
      <Image
        src={company.companyLogo || "/images/default-companylogo.png"}
        alt="Company Logo"
        width={80}
        height={80}
        className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow-md"
      />
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{company.companyName}</h3>
        <p className="text-base text-gray-500 mt-1">
          {company.industry === "Other" ? company.otherIndustry : company.industry} • {company.companySize}
        </p>
      </div>
    </div>

    <div className="flex gap-4 mt-4 sm:mt-0">
      <button
        className="px-3 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow"
        onClick={() => window.location.href = "/Admin/Company-profile"}
      >
        View Profile
      </button>
      <button
        className="px-5 py-2 text-base bg-gray-100 text-blue-700 rounded-lg hover:bg-gray-200 transition-all font-semibold shadow"
        onClick={() => window.location.href = "/Admin/Edite-CompanyProfile"}
      >
        Edit
      </button>
    </div>
  </motion.div>
)}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 bg-white">
          {roleLabels.map((label) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-blue-100 to-white p-6 rounded-2xl shadow-lg text-center border border-blue-100 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex justify-center mb-2">
                <Users size={32} className="text-blue-600 bg-blue-100 rounded-full p-1 shadow" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-1 tracking-wide">{label}</h4>
              <p className="text-3xl text-blue-700 font-extrabold drop-shadow">
                {loading ? <span className="animate-pulse">...</span> : roleCounts[keyMap[label] || label] || 0}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts and Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-12 mb-4">
          <div className="col-span-2 bg-white via-white to-blue-50 p-10 rounded-3xl shadow-2xl border border-blue-200 relative overflow-hidden transition-all duration-300 hover:shadow-blue-200 border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">User Management</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-4 py-1.5 bg-blue-500 text-white rounded-xl hover:bg-blue-700 transition-all text-base font-semibold shadow-md"
                onClick={() => window.location.href = "/Admin/Manage-users"}
              >
                <PlusCircle size={18} />
                Add User
              </motion.button>
            </div>

            <div className="mb-4">
              <label htmlFor="search-users" className="sr-only">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  id="search-users"
                  type="text"
                  placeholder="Search by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base bg-gray-50 shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-8 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : errorDistribution ? (
              <div className="p-2 bg-red-100 text-red-700 rounded-xl flex items-center justify-between">
                <span>{errorDistribution}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-base hover:bg-red-700"
                  onClick={handleRetry}
                >
                  Retry
                </motion.button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center text-gray-400 text-lg">No users found. Try a different search term.</div>
            ) : (
              <AnimatePresence>
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-xl transition shadow-sm border border-gray-100"
                    >
                      <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg uppercase shadow">
                        {getInitials(user)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {user.role.length > 0 ? (
                            user.role.map((role) => (
                              <span
                                key={role}
                                className="px-2 py-0.5 bg-blue-500/90 text-white text-xs font-medium rounded-full shadow-sm border border-blue-200"
                              >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-xs rounded-full">
                              No Role
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-gray-400 hover:text-blue-600 transition"
                          onClick={() => window.location.href = `/Admin/User/${user.id}`}
                          title="View profile"
                        >
                          <Eye size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-gray-400 hover:text-red-600 transition"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>

          <div className="bg-white via-white to-blue-50 p-10 rounded-3xl shadow-2xl border border-blue-200 relative overflow-hidden transition-all duration-300 hover:shadow-blue-200 group col-span-2">
  <div className="flex items-center gap-3 mb-4">
    <div className="bg-blue-500/10 rounded-full p-2 shadow-inner">
      <PieChart width={28} height={28}>
        <Pie data={[{value:1}]} dataKey="value" cx="50%" cy="50%" outerRadius={12} fill="#3b82f6" />
      </PieChart>
    </div>
    <h3 className="text-xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
      Recruitment Distribution
      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full shadow-sm border border-blue-200">Live</span>
    </h3>
  </div>
  <div className="flex flex-col items-center justify-center">
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={recruitmentDistribution}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          innerRadius={40}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          labelLine={false}
          paddingAngle={3}
        >
          {(loadingDistribution ? dataPie : recruitmentDistribution).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <div className="flex justify-center gap-4 mt-4">
      {(loadingDistribution ? dataPie : recruitmentDistribution).map((entry, idx) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
          <span className="text-sm text-gray-700 font-medium">{entry.name}</span>
        </div>
      ))}
    </div>
    {loadingDistribution && <div className="text-center text-gray-400 text-sm mt-2">Chargement...</div>}
    {errorDistribution && <div className="text-center text-red-500 text-sm mt-2">{errorDistribution}</div>}
  </div>
</div>
        </div>

        {/* Graphique en barres : Candidatures par mois */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Candidatures par mois</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataBar} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888"/>
              <YAxis stroke="#888"/>
              <Tooltip/>
              <Bar dataKey="value" fill="url(#colorBar)" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Actions */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Actions</h3>
          <div className="flex flex-wrap gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-yellow-600 transition-all font-semibold shadow">
              <Users size={20} /> View Recruitments
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-purple-600 transition-all font-semibold shadow">
              <Users size={20} /> Manage Users
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-all font-semibold shadow">
              <FileText size={20} /> View Reports
            </motion.button>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}