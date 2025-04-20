"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  MessageSquare,
  Search,
  User,
  Home,
  LogOut,
  Menu,
  X,
  BarChart2,
  ClipboardList,
} from "lucide-react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useAuth } from "@/src/context/authContext";

const customStyle = `
#nprogress {
  pointer-events: none;
}
#nprogress .bar {
  background: #2563eb;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  border-radius: 2px;
}
`;

export default function DashboardCandidat() {
  const { logoutCandidat } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    NProgress.start();
    setTimeout(() => {
      NProgress.done();
    }, 800);
  }, []);

  return (
    <>
      <style>{customStyle}</style>

      <div className="flex min-h-screen bg-gray-100">
        {/* SIDEBAR */}
        <aside
          className={`fixed top-0 left-0 h-full bg-white border-r shadow-lg transition-all duration-300 ease-in-out z-40 ${
            isSidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              {isSidebarOpen && <h2 className="text-2xl font-bold text-blue-600">Candidate</h2>}
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
          <nav className="mt-4 px-2 space-y-1 text-sm font-medium">
            <SidebarLink href="/dashboard-candidat" icon={<Home size={18} />} text="Dashboard" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/jobs" icon={<Search size={18} />} text="Jobs" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/applications" icon={<FileText size={18} />} text="Apply" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/evaluations" icon={<Briefcase size={18} />} text="Evaluation" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/candidature-status" icon={<User size={18} />} text="Tracking" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/companies" icon={<Search size={18} />} text="Companies" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/messages" icon={<MessageSquare size={18} />} text="Messaging" isSidebarOpen={isSidebarOpen} />
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={logoutCandidat}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors w-full"
            >
              <LogOut size={18} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} p-6`}>
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold text-gray-800">Welcome, Candidate!</h2>
            <p className="text-gray-500 mt-2">Track your progress and manage your applications here.</p>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Applications Sent"
              value="24"
              icon={<ClipboardList size={32} className="text-blue-600" />}
            />
            <StatCard
              title="Interviews Scheduled"
              value="5"
              icon={<Briefcase size={32} className="text-green-600" />}
            />
            <StatCard
              title="Jobs Saved"
              value="12"
              icon={<BarChart2 size={32} className="text-yellow-600" />}
            />
          </div>

          {/* Cards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <DashboardCard
              title="Browse Jobs"
              icon={<Search size={28} />}
              description="Find jobs with our smart filters."
              link="/jobs"
            />
            <DashboardCard
              title="Apply for Jobs"
              icon={<FileText size={28} />}
              description="Send your CV and cover letter in just a few clicks."
              link="/applications"
            />
            <DashboardCard
              title="Evaluation"
              icon={<Briefcase size={28} />}
              description="Online tests and interviews."
              link="/evaluations"
            />
            <DashboardCard
              title="Application Tracking"
              icon={<User size={28} />}
              description="Track your applications in real-time."
              link="/candidature-status"
            />
            <DashboardCard
              title="Companies"
              icon={<Search size={28} />}
              description="View company profiles."
              link="/companies"
            />
            <DashboardCard
              title="Messaging"
              icon={<MessageSquare size={28} />}
              description="Chat with recruiters."
              link="/messages"
            />
            <DashboardCard
        title="Update Profile"
        icon={<User size={28} />}
        description="Edit your personal information and upload your CV."
        link="/Candidat/Profile" />
          </motion.div>
        </main>
      </div>
    </>
  );
}

function SidebarLink({
  href,
  icon,
  text,
  isSidebarOpen,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  isSidebarOpen: boolean;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
        {icon}
        {isSidebarOpen && <span>{text}</span>}
      </div>
    </Link>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  link,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <Link href={link}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 flex flex-col space-y-4 border border-gray-200"
      >
        <div className="text-blue-600">{icon}</div>
        <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </motion.div>
    </Link>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center space-x-4">
      <div className="p-4 bg-blue-50 rounded-full">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-2xl font-bold text-blue-600">{value}</p>
      </div>
    </div>
  );
}