import React from "react";
import Image from "next/image";
import { Bell, Search } from "lucide-react";

interface AdminHeaderProps {
  adminProfile?: { firstName?: string; lastName?: string };
  sidebarOpen?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ adminProfile, sidebarOpen = true }) => (
  <header
    className="w-full flex items-center justify-between bg-white/80 backdrop-blur-xl fixed top-0 left-0 z-30 px-8 py-2 border-b border-gray-100 shadow transition-all duration-300"
    style={{
      boxShadow: '0 2px 16px 0 rgba(30, 64, 175, 0.04)',
      width: sidebarOpen ? 'calc(100% - 12rem)' : '100%', // 12rem = 192px, matches w-48 sidebar
      left: sidebarOpen ? '12rem' : 0,
      transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
      minHeight: '73px',
      height: '73px'
    }} 
    >
    <div className="flex items-center gap-4">
      <div className="relative w-[420px] ml-32">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search"
          className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base w-full shadow-sm"
        />
      </div>
    </div>
    <div className="flex items-center gap-4">
      {/* Notification Icon - Modern Style */}
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 via-white to-indigo-100 shadow group border border-blue-200"
        style={{ minWidth: 0 }}
        aria-label="Notifications">
        <Bell className="w-6 h-6 text-blue-600 group-hover:text-indigo-700" strokeWidth={2.2} />
        {/* Badge notification count, no animation, always visible */}
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-tr from-pink-500 to-orange-400 rounded-full border-2 border-white shadow-lg z-10">
          3
        </span>
      </button>
      <button
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2.5 py-1.5 shadow-sm hover:shadow-md hover:bg-blue-50 transition group"
        style={{ minWidth: 0 }}
        onClick={() => window.location.href = "/Admin/Profile"}>
        <span className="relative flex items-center justify-center w-9 h-9">
          {adminProfile && adminProfile.firstName && adminProfile.lastName ? (
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg uppercase bg-gradient-to-br from-blue-500 to-indigo-500 text-white border-2 border-blue-200 group-hover:border-blue-400 transition shadow">
              {adminProfile.firstName[0]}
              {adminProfile.lastName[0]}
            </span>
          ) : (
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg uppercase bg-gray-300 text-white border-2 border-blue-200 group-hover:border-blue-400 transition shadow">
              <Image src="/images/default-avatar.png" alt="Avatar Admin" width={36} height={36} className="rounded-full" />
            </span>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
        </span>
        <span className="flex flex-col items-start min-w-0">
          <span className="font-semibold text-blue-900 text-base leading-tight truncate max-w-[100px]">My Account</span>
        </span>
        <svg className="ml-2 w-4 h-4 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
    </div>
  </header>
);

export default AdminHeader;