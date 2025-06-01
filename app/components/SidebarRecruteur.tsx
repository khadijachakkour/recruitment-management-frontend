import { useState } from "react";
import { Home, Users, Settings, Bell, Building, Menu, X, Briefcase } from "lucide-react";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

interface SidebarRecruteurProps {
  isSidebarOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export default function Sidebar({ isSidebarOpen, onToggle }: SidebarRecruteurProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // Track which dropdown is open

  const toggleSidebar = () => {
    onToggle(!isSidebarOpen);
  };

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu); // Toggle the dropdown
  };

  return (
    <aside
      className={`fixed z-[1100] top-0 left-0 h-full bg-white border-r shadow-md transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}>
      {/* Header avec hamburger */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          {isSidebarOpen && <h1 className="text-2xl font-bold" style={{ color: "#007bff" }}>SmartHire</h1>}
        </div>

        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-blue-600 transition-colors">
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2 space-y-1 text-sm font-medium">
        <Link
          href="/Recruteur/Dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
          <Home size={18} /> {isSidebarOpen && <span>Dashboard</span>}
        </Link>
        {/* Job Offers */}
        <div className="navbar__dropdown">
          <button
            onClick={() => toggleDropdown("jobOffers")}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
            <span className="flex items-center gap-3">
              <Building size={18} />
              {isSidebarOpen && <span>Job Offers</span>}
            </span>
            {isSidebarOpen && <span>{openDropdown === "jobOffers" ? "-" : "+"}</span>}
          </button>
          {isSidebarOpen && openDropdown === "jobOffers" && (
            <ul className="ml-6 space-y-1">
              <li>
                <Link
                  href="/Recruteur/Jobs/Create"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                  Create Offer
                </Link>
              </li>
              <li>
                <Link
                  href="/Recruteur/Jobs/ManageOffers"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                  Manage Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/Recruteur/Offers/Publish"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                  Multi-platform Publishing
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Applications */}
        <div className="navbar__dropdown">
          <button
            onClick={() => toggleDropdown("applications")}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
          >
            <span className="flex items-center gap-3">
              <Users size={18} />
              {isSidebarOpen && <span>Applications</span>}
            </span>
            {isSidebarOpen && <span>{openDropdown === "applications" ? "-" : "+"}</span>}
          </button>
          {isSidebarOpen && openDropdown === "applications" && (
            <ul className="ml-6 space-y-1">
              <li>
                <Link
                  href="/Recruteur/Applications/PreselectedApplication"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  Pre-selected Candidates
                </Link>
              </li>
              <li>
                <Link
                  href="/Recruteur/Applications/Shortlist"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  Shortlist Candidates
                </Link>
              </li>
              <li>
                <Link
                  href="/Recruteur/Applications/All"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  View Applications
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Departments */}
        <Link
          href="/Recruteur/Departments/List"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Building size={18} /> {isSidebarOpen && <span>Departments</span>}
        </Link>

        {/* Recruitment Management */}
        <Link
          href="/Recruteur/Recruitment-management"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Briefcase size={18} /> {isSidebarOpen && <span>Recruitment Management</span>}
        </Link>

     {/* Mon Profil */}
        <Link
          href="/Recruteur/Profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
          <FaUser size={18} /> {isSidebarOpen && <span>Profil</span>}
        </Link>
        {/* Notifications */}
        <Link
          href="/Recruteur/Notifications"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Bell size={18} /> {isSidebarOpen && <span>Notifications</span>}
        </Link>

        {/* Account Settings */}
        <Link
          href="/Recruteur/Account-settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Settings size={18} /> {isSidebarOpen && <span>Account Settings</span>}
        </Link>
      </nav>
    </aside>
  );
}