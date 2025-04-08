"use client"; 
import Link from "next/link";
import "../styles/NavbarAdmin.css";
import { useAuth } from "@/src/context/authContext";

export default function NavbarAdmin() {
  const { isLoggedIn, userRoles, logoutAdmin } = useAuth();
  

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/Admin/Dashboard" className="navbar__logo">JobBox</Link>

        {!isLoggedIn && (
          <ul className="hidden md:flex space-x-6 navbar__nav">
            <li><Link href="/" className="navbar__nav-item">Find Jobs</Link></li>
            <li><Link href="/employers" className="navbar__nav-item">Employers</Link></li>
            <li><Link href="/candidates" className="navbar__nav-item">Candidates</Link></li>
            <li><Link href="/blog" className="navbar__nav-item">Blog</Link></li>
          </ul>
        )}
        <div className="navbar__button-container">
          {isLoggedIn && userRoles.includes("Admin") ? (
            <ul className="navbar__nav">
              <li><Link href="/Admin/Dashboard" className="navbar__nav-item">Dashboard</Link></li>
              <li><Link href="/Admin/User-management" className="navbar__nav-item">User Management</Link></li>
              <li><Link href="/Admin/Recruitment-management" className="navbar__nav-item">Recruitment Management</Link></li>
              <li><Link href="/Admin/Notifications" className="navbar__nav-item">Notifications</Link></li>
              <li><Link href="/Admin/Account-settings" className="navbar__nav-item">Account Settings</Link></li>
              <li>
                <button onClick={logoutAdmin} className="navbar__logout-btn">
                  <i className="fas fa-sign-out-alt navbar__logout-icon"></i>
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <div className="hidden md:flex space-x-4">
              <Link href="/login/Candidat" className="navbar__connexion">Sign In</Link>
              <Link href="/login/Admin" className="navbar__entreprises">Employers / Post Job</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
