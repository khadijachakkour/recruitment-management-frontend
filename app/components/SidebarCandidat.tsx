// components/SidebarCandidat.tsx
'use client';

import { useState } from "react";
import Link from "next/link";
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
import { useAuth } from "@/src/context/authContext";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarCandidat = ({ isOpen, toggle }: SidebarProps) => {
  const { logoutCandidat } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white border-r shadow-lg transition-all duration-300 ease-in-out z-40 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          {isOpen && <h2 className="text-2xl font-bold text-blue-600">Candidate</h2>}
        </div>
        <button
          onClick={toggle}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
      <nav className="mt-4 px-2 space-y-1 text-sm font-medium">
        <SidebarLink href="/Candidat/dashboard" icon={<Home size={18} />} text="Dashboard" isSidebarOpen={isOpen} />
        <SidebarLink href="/Candidat/Listoffres" icon={<Search size={18} />} text="Jobs" isSidebarOpen={isOpen} />
        <SidebarLink href="/applications" icon={<FileText size={18} />} text="Apply" isSidebarOpen={isOpen} />
        <SidebarLink href="/evaluations" icon={<Briefcase size={18} />} text="Evaluation" isSidebarOpen={isOpen} />
        <SidebarLink href="/candidature-status" icon={<User size={18} />} text="Tracking" isSidebarOpen={isOpen} />
        <SidebarLink href="/companies" icon={<Search size={18} />} text="Companies" isSidebarOpen={isOpen} />
        <SidebarLink href="/messages" icon={<MessageSquare size={18} />} text="Messaging" isSidebarOpen={isOpen} />
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={logoutCandidat}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors w-full"
        >
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

const SidebarLink = ({
  href,
  icon,
  text,
  isSidebarOpen,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  isSidebarOpen: boolean;
}) => (
  <Link href={href}>
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
      {icon}
      {isSidebarOpen && <span>{text}</span>}
    </div>
  </Link>
);

export default SidebarCandidat;
