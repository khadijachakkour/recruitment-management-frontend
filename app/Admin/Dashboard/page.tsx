"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie
} from "recharts";
import { motion } from "framer-motion";
import {
  Bell, Users, PlusCircle
} from "lucide-react";
import AdminLayout from "@/AdminLayout";

const dataLine = [/* ... */];
const dataBar = [/* ... */];
const dataPie = [/* ... */];

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [roleCounts, setRoleCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [userId , setUserId ] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminIdAndCounts = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/users/userId", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });

        setUserId(data.userId );

        const response = await axios.get(`http://localhost:4000/api/users/count-by-role/${data.userId}`);
        setRoleCounts(response.data);
      } catch (error) {
        console.error("Error fetching adminId or role counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminIdAndCounts();
  }, []);

  const roleLabels = ["Recruiters", "Managers", "HR"];
  const keyMap: { [label: string]: string } = {
    Recruiters: "Recruteur",
    Managers: "Manager",
    HR: "RH"
  };

  return (
    <AdminLayout>
      <main className="p-6 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Bell size={22} className="text-gray-500 cursor-pointer" />
            <span className="font-semibold text-gray-700">Admin</span>
          </div>
        </div>

        {/* Welcome Box */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Welcome Back</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all">
            Edit Profile
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {roleLabels.map((label) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-5 rounded-xl shadow-sm text-center"
            >
              <Users size={28} className="text-blue-600 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-gray-700">{label}</h4>
              <p className="text-2xl text-gray-900 font-bold">
                {loading ? "..." : roleCounts[keyMap[label] || label] || 0}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts and tables – unchanged */}
        {/* ... */}
      </main>
    </AdminLayout>
  );
}
