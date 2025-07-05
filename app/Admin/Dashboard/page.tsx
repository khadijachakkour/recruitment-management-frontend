"use client"; 

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Bell, Users, Target, Award, PlusCircle, Search, FileText, Activity, BriefcaseBusiness, Lock, UserCheck, Clock, TrendingUp, Trash2, Eye, PieChart, Shield,
  ArrowRight, Sparkles, CalendarDays } from "lucide-react";
import Swal from 'sweetalert2';
import type { Company } from "@/app/types/company";
import { BarChart, Bar, Cell, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import AdminHeader from "@/app/components/AdminHeader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const dataBar = [ 
  { name: "Jan", value: 3 }, 
  { name: "Feb", value: 6 }, 
  { name: "Mar", value: 2 }, 
  { name: "Apr", value: 7 } 
]; 

const recentActivities = [
  { action: 'New job posted', detail: 'Frontend Developer - Paris', time: '10 min ago', icon: BriefcaseBusiness },
  { action: 'Application received', detail: 'John Doe applied for Backend Dev', time: '25 min ago', icon: UserCheck },
  { action: 'Interview completed', detail: 'Sarah Smith - UX Designer', time: '1h ago', icon: Clock },
  { action: 'Offer accepted', detail: 'Marketing Manager position', time: '2h ago', icon: Award }
];

// Harmonisation des labels pour la distribution du recrutement
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

// Typage correct pour la distribution du recrutement
interface RecruitmentDistributionEntry {
  name: string;
  value: number;
}

export default function AdminDashboard() { 

  const [roleCounts, setRoleCounts] = useState<{ [key: string]: number }>({}); 
  const [userId, setUserId] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [recruitmentDistribution, setRecruitmentDistribution] = useState<RecruitmentDistributionEntry[]>([]); 
  const [loadingDistribution, setLoadingDistribution] = useState(true);
  const [errorDistribution, setErrorDistribution] = useState<string | null>(null);
  const [offersCount, setOffersCount] = useState<number | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

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

        const offersCountRes = await axios.get(`${API_BASE_URL}/api/admin/dashboard/offers-count`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setOffersCount(offersCountRes.data.offerCount || 0);
        const offersRes = await axios.get(`${API_BASE_URL}/api/admin/dashboard/offers`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setOffers(offersRes.data);
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
        console.log("distribution",data);
        setRecruitmentDistribution(data);
      } catch {
        setErrorDistribution("Erreur lors du chargement de la répartition des utilisateurs.");
      } finally {
        setLoadingDistribution(false);
      }
    };
    fetchRecruitmentDistribution();
  }, []);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/UserProfile`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setAdminProfile(data);
      } catch (error) {
      }
    };
    fetchAdminProfile();
  }, []);

  // Fonction d'export PDF
  const handleExportPDF = async () => {
    const dashboard = document.getElementById("admin-dashboard-report");
    if (!dashboard) return;

    // Save original styles
    const originalHeight = dashboard.style.height;
    const originalOverflow = dashboard.style.overflow;
    dashboard.style.height = 'auto';
    dashboard.style.overflow = 'visible';
    window.scrollTo(0, 0); 

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use html2canvas to capture the full dashboard
    const canvas = await html2canvas(dashboard, { scale: 2, useCORS: true, windowWidth: dashboard.scrollWidth, windowHeight: dashboard.scrollHeight });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("admin-dashboard-report.pdf");

    dashboard.style.height = originalHeight;
    dashboard.style.overflow = originalOverflow; };

  // Section Job Statistics 
  const JobStatistics = () => (
    <section className="mb-10">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6 tracking-tight leading-tight drop-shadow-sm" style={{letterSpacing: '0.01em'}}>Job Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Employee */}
        <div className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm">
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100">
            <Users className="text-green-500" size={28} />
          </span>
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Total Employee</div>
            <div className="text-2xl font-extrabold text-green-700">{roleCounts.Recruteur + roleCounts.Manager + roleCounts.RH || 0}</div>
          </div>
        </div>
        {/* Total Offers */}
        <div className="flex items-center gap-4 bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm">
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100">
            <BriefcaseBusiness className="text-orange-500" size={28} />
          </span>
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Total Offers</div>
            <div className="text-2xl font-extrabold text-orange-700">{offersCount || 0}</div>
          </div>
        </div>
        {/* Job Applied */}
        <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
            <FileText className="text-blue-500" size={28} />
          </span>
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Job Applied</div>
            <div className="text-2xl font-extrabold text-blue-700">{12}</div>
          </div>
        </div>
      </div>
    </section>
  );  
  // Section Company Card (statique)
  const CompanyCard = () => (
    company && (
      <div
        className="relative bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl mb-10 transition-all duration-500 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Image
                src={company.companyLogo || "/images/default-companylogo.png"}
                alt="Company Logo"
                width={96}
                height={96}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <Award size={16} className="text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 mb-2">{company.companyName}</h3>
              <div className="flex items-center gap-3 text-slate-600">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {company.industry === "Other" ? company.otherIndustry : company.industry}
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-medium">{company.companySize}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-bold shadow-lg hover:shadow-xl"
              onClick={() => window.location.href = "/Admin/Company-profile"}>
              View Profile
            </button>
            <button
              className="px-6 py-3 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl hover:bg-white border border-slate-200 transition-all font-bold shadow-lg hover:shadow-xl"
              onClick={() => window.location.href = "/Admin/Edite-CompanyProfile"}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Section Quick Actions (statique)
  const QuickActions = () => (
    <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl mb-8">
      <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "View Recruitments", color: "from-amber-500 to-orange-500", icon: TrendingUp },
          { label: "Manage Users", color: "from-purple-500 to-pink-500", icon: Users },
          { label: "View Reports", color: "from-slate-600 to-slate-800", icon: FileText },
          { label: "My Profile", color: "from-blue-500 to-indigo-500", icon: Users }
        ].map((action, index) => (
          <button
            key={action.label}
            className={`relative bg-gradient-to-r ${action.color} text-white px-6 py-4 rounded-2xl transition-all font-bold shadow-lg hover:shadow-xl overflow-hidden group`}
            onClick={() => {
              if (action.label === "My Profile") window.location.href = "/Admin/Profile";
            }}>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative z-10 flex items-center gap-3">
              <action.icon size={20} />
              <span className="text-sm">{action.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>  
);

  // Section User Management
  const UserManagement = () => (
    <div className="col-span-2 bg-white via-white to-blue-50 p-10 rounded-3xl shadow-2xl border border-blue-200 relative overflow-hidden transition-all duration-300 hover:shadow-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">User Management</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-4 py-1.5 bg-blue-500 text-white rounded-xl hover:bg-blue-700 transition-all text-base font-semibold shadow-md"
          onClick={() => window.location.href = "/Admin/Manage-users"} >
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
            className="w-full pl-12 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base bg-gray-50 shadow-sm"/>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow border border-gray-100">
              <div className="w-14 h-14 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="flex gap-2 mt-2">
                  <div className="h-4 w-16 bg-gray-200 rounded-full" />
                  <div className="h-4 w-10 bg-gray-100 rounded-full" />
                </div>
              </div>
              <div className="flex gap-2 ml-auto">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
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
                className="flex items-center gap-4 p-4 bg-white hover:bg-blue-50 rounded-2xl transition shadow border border-gray-100 group relative"
              >
                <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg uppercase shadow overflow-hidden">
                  {getInitials(user)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-gray-900 truncate flex items-center gap-2">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username}
                    {user.role.includes('Admin') && (
                      <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow border border-blue-200">Admin</span>
                    )}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.role.length > 0 ? (
                      user.role.map((role) => (
                        <span
                          key={role}
                          className={`px-2 py-0.5 text-xs font-medium rounded-full shadow-sm border transition-all duration-200 ${role === 'Admin' ? 'bg-blue-600 text-white border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-200'}`}
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
                <div className="flex gap-2 ml-auto">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-400 hover:text-blue-600 transition p-2 rounded-full bg-blue-50 group-hover:bg-blue-100"
                    onClick={() => window.location.href = `/Admin/User/${user.id}`}
                    title="View profile">
                    <Eye size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-400 hover:text-red-600 transition p-2 rounded-full bg-red-50 group-hover:bg-red-100"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Delete">
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );

  // Section Job Applications by Month Chart
  const JobApplicationsChart = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-full">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Job Applied</h3>
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
  );

  // Section Recent Activity
  const RecentActivity = () => (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Activity className="text-blue-500" size={22} />
          Recent Activity
        </h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition">View All</button>
      </div>
    <div className="space-y-3">
      {recentActivities.map((activity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 }}
          className="flex items-start gap-3 p-3 hover:bg-blue-50/60 rounded-xl transition-colors">
          <div className="p-2 bg-blue-100 rounded-full">
            <activity.icon className="text-blue-600" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">{activity.action}</p>
            <p className="text-xs text-slate-600 truncate">{activity.detail}</p>
            <p className="text-xs text-slate-400">{activity.time}</p>
          </div>
        </motion.div>
        ))}
    </div>
      </motion.div>
  );

  // Section Job Offers
  const JobOffersSection = () => (
    <section className="relative py-0 px-0 mb-12">
      {/* Decorative background shapes */}
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-to-br from-blue-200/40 to-indigo-200/10 rounded-full blur-3xl opacity-60 -z-10 animate-pulse" />
      <div className="absolute -bottom-16 right-0 w-72 h-72 bg-gradient-to-tr from-orange-200/40 to-pink-200/10 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
      <div className="flex flex-col md:flex-row items-stretch rounded-3xl shadow-2xl border border-blue-100 overflow-hidden bg-white/80 backdrop-blur-xl">
        {/* Left: Summary Card (smaller width, compact style) */}
        <div className="flex flex-col justify-center items-center bg-gradient-to-b from-blue-700 via-blue-500 to-blue-400 md:w-1/4 w-full py-8 px-4 gap-2 text-center relative">
          {/* Animated Count */}
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }} className="text-4xl font-black text-white drop-shadow mb-0.5">
            {offersCount ?? 0}
          </motion.div>
          <div className="text-base font-semibold text-blue-100 mb-1 tracking-wide">Total Job Offers</div>
          <div className="text-xs text-blue-200 mb-2">All job offers posted by your company</div>
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            className="mt-1 px-4 py-1.5 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg font-bold shadow-lg hover:from-orange-500 hover:to-pink-600 transition-all text-sm tracking-wide"
            onClick={() => window.location.href = '/Admin/CompanyOffers'}
          >
            View All Offers
          </motion.button>
        </div>
        {/* Right: Offers Table (larger width) */}
        <div className="flex-1 bg-white/90 py-10 px-4 md:px-10 flex flex-col justify-center relative">
          {/* Floating header with badge */}
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2 tracking-tight drop-shadow-sm">
              <BriefcaseBusiness className="text-blue-400" size={26} />
              Company Job Offers
            </h3>
          </div>
          {offers.length === 0 ? (
            <div className="text-gray-400 text-center py-8 text-lg">No job offers found for your company.</div>
          ) : (
            <div className="rounded-2xl border border-blue-100 shadow-lg overflow-hidden bg-white/80">
              <ScrollableOffersTable offers={offers} />
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const MotivationFeaturesSection = () => (
    <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Welcome/Motivation Section */}
      <div
        className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border border-slate-200/60 rounded-2xl p-8 overflow-hidden group hover:border-blue-300/50 transition-all duration-300"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-indigo-600/[0.04] opacity-60" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/8 to-cyan-400/8 rounded-full blur-2xl" />
        {/* Floating Icon */}
        <div className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50">
          <Shield className="text-blue-600 w-6 h-6" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <BriefcaseBusiness className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Welcome, Administrator
              </h2>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed mb-8 font-medium">
            Access all administration tools to efficiently manage your teams, job offers, and optimize your recruitment processes.
          </p>
          {/* Stats Highlight */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="text-emerald-600 w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Optimized efficiency</p>
                  <p className="text-xs text-slate-500">Full use of features</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">+30%</p>
                <p className="text-xs text-slate-500">Recruitment performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div
        className="relative bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Sparkles className="text-slate-600 w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Key Features
            </h3>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            Updated
          </span>
        </div>
        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {[
            {
              icon: Users,
              title: "User Management",
              description: "Full administration of accounts",
              color: "blue",
              bgColor: "bg-blue-50"
            },
            {
              icon: BriefcaseBusiness,
              title: "Job Offers",
              description: "Catalog of available positions",
              color: "indigo",
              bgColor: "bg-indigo-50"
            },
            {
              icon: FileText,
              title: "Analytics",
              description: "Detailed metrics and reports",
              color: "emerald",
              bgColor: "bg-emerald-50"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-xl p-4 border border-${feature.color}-200/30 hover:border-${feature.color}-300/50 transition-all duration-200 group cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-white rounded-lg shadow-sm border border-${feature.color}-200/30 group-hover:shadow-md transition-all duration-200`}>
                  <feature.icon className={`text-${feature.color}-600 w-4 h-4`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-${feature.color}-900 text-sm`}>
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <ArrowRight className={`text-${feature.color}-400 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1`} />
              </div>
            </div>
          ))}
        </div>
        {/* CTA Button */}
        <button
          className="w-full px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group"
          onClick={() => window.location.href = '/Admin/Manage-users'}
        >
          <span>Explore all features</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </section>
  );

  // Section Recruitment Distribution (PieChart)
  const RecruitmentDistributionSection = () => (
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
          paddingAngle={3}>
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
  );

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50" id="admin-dashboard-report" style={{ zoom: 0.85 }}>
      <SidebarAdmin isSidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}
        style={{ minWidth: 0 }}>
        <AdminHeader sidebarOpen={sidebarOpen} adminProfile={adminProfile} />
        <main className="pl-[46px] pr-8 pt-24 pb-10">
          <div className="flex justify-end mb-4 gap-2 relative">
            <button
              onClick={() => setShowCalendar(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded-lg font-semibold shadow hover:bg-blue-50 transition-all"
              title="Show Calendar"
              type="button"
            >
              <CalendarDays size={18} /> Calendar
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all"
              title="Exporter le dashboard en PDF"
              type="button"
            >
              <FileText size={18} /> Export PDF
            </button>
            {/* Calendar Modal */}
            {showCalendar && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div ref={calendarRef} className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] max-w-full relative animate-fadeIn">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-lg font-bold"
                    onClick={() => setShowCalendar(false)}
                    title="Close"
                  >
                    ×
                  </button>
                  <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <CalendarDays size={20} /> Calendar
                  </h3>
                  <CalendarComponent />
                </div>
              </div>
            )}
          </div>
          {/* Section 1: Welcome/Motivation & Features */}
          <div className="mb-12">
            <MotivationFeaturesSection />
          </div>
          {/* Section 2: Job Statistics */}
          <div className="mb-12">
            <JobStatistics />
          </div>
          {/* Section 3: Company Card */}
          <div className="mb-12">
            <CompanyCard />
          </div>
          {/* Section 4: Quick Actions */}
          <div className="mb-12">
            <QuickActions />
          </div>
          {/* Section 5: User Management & Recruitment Distribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
            <div className="w-full">
              <UserManagement />
            </div>
            <div className="w-full">
              <RecruitmentDistributionSection />
            </div>
          </div>
          {/* Section 6: Applications by month & Recent Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
            <div className="w-full">
              <JobApplicationsChart />
            </div>
            <div className="w-full">
              <RecentActivity />
            </div>
          </div>
          {/* Section 7: Job Offers */}
          <div className="mb-12">
            <JobOffersSection />
          </div>
        </main>
      </div>
    </div>
  );
}

function ScrollableOffersTable({ offers }: { offers: any[] }) {
  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'location', label: 'Location' },
    { key: 'created', label: 'Created' },
  ];
  const rowHeight = 56; 
  const maxVisibleRows = 3;
  const maxHeight = rowHeight * maxVisibleRows;

  if (offers.length > 2) {
    return (
      <div className="overflow-x-auto">
        {/* Header table */}
        <table className="min-w-full text-sm text-left border border-blue-100 rounded-t-xl overflow-hidden shadow-lg table-fixed">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-blue-700 text-base w-1/4">Title</th>
              <th className="px-6 py-3 font-semibold text-blue-700 text-base w-1/4">Location</th>
              <th className="px-6 py-3 font-semibold text-blue-700 text-base w-1/4">Created</th>
            </tr>
          </thead>
        </table>
        {/* Scrollable body table */}
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 border-x border-b border-blue-100 rounded-b-xl" style={{ maxHeight: `${maxHeight}px` }}>
          <table className="min-w-full text-sm text-left table-fixed">
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-t border-blue-100 hover:bg-blue-50 transition group">
                  <td className="px-6 py-3 font-semibold text-gray-900 group-hover:text-blue-700 transition-all w-1/4">{offer.title}</td>
                  <td className="px-6 py-3 text-gray-700 w-1/4">{offer.location}</td>
                  <td className="px-6 py-3 text-gray-500 w-1/4">{new Date(offer.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <table className="min-w-full text-sm text-left border border-blue-100 rounded-xl overflow-hidden shadow-lg">
      <thead className="bg-blue-50">
        <tr>
          <th className="px-6 py-3 font-semibold text-blue-700 text-base">Title</th>
          <th className="px-6 py-3 font-semibold text-blue-700 text-base">Location</th>
          <th className="px-6 py-3 font-semibold text-blue-700 text-base">Created</th>
          <th className="px-6 py-3 font-semibold text-blue-700 text-base">Status</th>
        </tr>
      </thead>
      <tbody>
        {offers.map((offer) => (
          <tr key={offer.id} className="border-t border-blue-100 hover:bg-blue-50 transition group">
            <td className="px-6 py-3 font-semibold text-gray-900 group-hover:text-blue-700 transition-all">{offer.title}</td>
            <td className="px-6 py-3 text-gray-700">{offer.location}</td>
            <td className="px-6 py-3 text-gray-500">{new Date(offer.createdAt).toLocaleDateString()}</td>
            <td className="px-6 py-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm border transition-all duration-200 ${offer.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-200 text-gray-500 border-gray-300'}`}>
                {offer.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// CalendarComponent definition (simple calendar for modal)
function CalendarComponent() {
  // For simplicity, use native input type="date" for now
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="date"
        defaultValue={today}
        className="border border-blue-200 rounded-lg px-4 py-2 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none shadow-sm"
      />
      <span className="text-xs text-gray-400">Select a date</span>
    </div>
  );
}