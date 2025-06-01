"use client";
import { useState, useEffect } from "react";
import Sidebar from "./app/components/SidebarRecruteur";
import { Search, LogOut } from 'lucide-react';
import { useAuth } from "@/src/context/authContext";
import axios from "axios";

export default function RecruteurLayout({ children, noSidebarMargin = false }: { children: React.ReactNode, noSidebarMargin?: boolean }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recruiterProfile, setRecruiterProfile] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const { logoutAdmin } = useAuth ? useAuth() : { logoutAdmin: () => {} };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await axios.get("http://localhost:4000/api/users/UserProfile", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setRecruiterProfile({
          firstName: data.firstName || data.first_name || '',
          lastName: data.lastName || data.last_name || '',
        });
      } catch {
        setRecruiterProfile(null);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
      {/* Main Content */}
      <div
        className="flex-1 min-h-screen w-full bg-white"
        style={{
          marginLeft: noSidebarMargin ? 0 : isSidebarOpen ? "16rem" : "4rem",
        }}>

        <header className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-md px-6 py-3 flex flex-row items-center justify-between shadow-lg border-b border-[#eaf6ff]">
          <div className="relative flex-1 flex justify-center">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                placeholder="Search an activity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2 rounded-xl border border-[#007bff] focus:outline-none focus:ring-2 focus:ring-[#00b4d8] text-base bg-white shadow-sm transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#007bff] pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-6 min-w-[320px] justify-end">
            <button className="relative p-2 hover:bg-blue-100 rounded-full transition ml-2">
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405M19 13V9a7 7 0 10-14 0v4L3 17h5m7 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2 hover:bg-blue-100 rounded-full transition ml-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </button>
            <div className="flex flex-col items-start justify-center">
              <span className="font-bold text-[#023e8a] text-base leading-tight">
                {recruiterProfile ? `${recruiterProfile.firstName} ${recruiterProfile.lastName}` : 'Recruiter'}
              </span>
              <span className="text-xs text-[#007bff] font-medium leading-tight">Recruiter</span>
            </div>
            <div
              className="bg-gradient-to-br from-[#007bff] to-[#00b4d8] text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl uppercase shadow-md cursor-pointer"
              onClick={() => window.location.href = '/Recruteur/Profile'}
              title="Voir le profil"
            >
              {recruiterProfile ? `${recruiterProfile.firstName?.[0] || ''}${recruiterProfile.lastName?.[0] || ''}` : 'RR'}
            </div>
            <button
              onClick={logoutAdmin}
              title="Logout"
              className="ml-2 p-2 rounded-full hover:bg-blue-100 transition flex items-center justify-center group">
              <LogOut className="w-6 h-6 text-gray-500 group-hover:text-[#007bff] transition" />
            </button>
          </div>
        </header>
        <div className="pt-36 relative z-10">{children}</div>
      </div>
    </div>
  );
}