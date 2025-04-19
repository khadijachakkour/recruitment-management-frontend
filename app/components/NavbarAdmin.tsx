"use client";
import Link from "next/link";
import "../styles/NavbarAdmin.css";
import { useAuth } from "@/src/context/authContext";

export default function NavbarAdmin() {
  const { isLoggedIn, userRoles, logoutAdmin } = useAuth();
  const isAdmin = isLoggedIn && userRoles.includes("Admin");
  const isRecruteur = isLoggedIn && userRoles.includes("Recruteur");

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center p-4 navbar__nav-container">
        <Link href={isAdmin ? "/Admin/Dashboard" : isRecruteur ? "/Recruteur/Dashboard" : "/"} className="navbar__logo">
          JobBox
        </Link>

        {!isLoggedIn && (
          <ul className="hidden md:flex space-x-6 navbar__nav">
            <li><Link href="/" className="navbar__nav-item">Find Jobs</Link></li>
            <li><Link href="/employers" className="navbar__nav-item">Employers</Link></li>
            <li><Link href="/candidates" className="navbar__nav-item">Candidates</Link></li>
            <li><Link href="/blog" className="navbar__nav-item">Blog</Link></li>
          </ul>
        )}

        <div className="navbar__button-container">
          {isAdmin && (
            <ul className="navbar__nav">
              <li><Link href="/Admin/Dashboard" className="navbar__nav-item">Dashboard</Link></li>
              <li><Link href="/Admin/Manage" className="navbar__nav-item">User Management</Link></li>
              <li><Link href="/Admin/Recruitment-management" className="navbar__nav-item">Recruitment Management</Link></li>
              <li><Link href="/Admin/Notifications" className="navbar__nav-item">Notifications</Link></li>
              <li><Link href="/Admin/Account-settings" className="navbar__nav-item">Account Settings</Link></li>
              <li>
                <button onClick={logoutAdmin} className="navbar__logout-btn">
                  <i className="fas fa-sign-out-alt navbar__logout-icon"></i> Logout
                </button>
              </li>
            </ul>
          )}

          {isRecruteur && (
            <ul className="navbar__nav">
              <li className="navbar__dropdown">
                <span className="navbar__nav-item">Job Offers</span>
                <ul className="navbar__dropdown-menu">
                  <li><Link href="/Recruteur/Offers/Create">Create Offer</Link></li>
                  <li><Link href="/Recruteur/Offers/Manage">Manage Offers</Link></li>
                  <li><Link href="/Recruteur/Offers/Publish">Multi-platform Publishing</Link></li>
                </ul>
              </li>

              <li className="navbar__dropdown">
                <span className="navbar__nav-item">Applications</span>
                <ul className="navbar__dropdown-menu">
                  <li><Link href="/Recruteur/Applications/Preselected">Pre-selected Candidates</Link></li>
                  <li><Link href="/Recruteur/Applications/Shortlist">Shortlist Candidates</Link></li>
                </ul>
              </li>

              <li className="navbar__dropdown">
                <span className="navbar__nav-item">Interviews & Tests</span>
                <ul className="navbar__dropdown-menu">
                  <li><Link href="/Recruteur/Interviews/Invitations">Send Invitations</Link></li>
                  <li><Link href="/Recruteur/Interviews/Schedule">Schedule Dates</Link></li>
                </ul>
              </li>

              <li className="navbar__dropdown">
                <span className="navbar__nav-item">Candidate Validation</span>
                <ul className="navbar__dropdown-menu">
                  <li><Link href="/Recruteur/Candidates/Status">Change Candidate Status</Link></li>
                  <li><Link href="/Recruteur/Candidates/Notify">Notify Candidates</Link></li>
                </ul>
              </li>

              <li><Link href="/Recruteur/Recruitment-management" className="navbar__nav-item">Recruitment Management</Link></li>
              <li><Link href="/Recruteur/Notifications" className="navbar__nav-item">Notifications</Link></li>
              <li><Link href="/Recruteur/Account-settings" className="navbar__nav-item">Account Settings</Link></li>
              <li>
                <button onClick={logoutAdmin} className="navbar__logout-btn">
                  <i className="fas fa-sign-out-alt navbar__logout-icon"></i> Logout
                </button>
              </li>
            </ul>
          )}

          {!isLoggedIn && (
            <div className="hidden md:flex space-x-4">
              <Link href="/login/Candidat" className="navbar__connexion">Sign In</Link>
              <Link href="/login" className="navbar__entreprises">Employers / Post Job</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
