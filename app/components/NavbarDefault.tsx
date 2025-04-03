"use client";

import Link from "next/link";
import "../styles/NavbarDefault.css";
import { useAuth } from "@/src/context/authContext";
import { FaUserCircle } from "react-icons/fa";

export default function NavbarDefault() {
  const { isLoggedIn, userRoles, logoutCandidat, logoutAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="navbar__logo">JobBox</Link>

        <ul className="hidden md:flex space-x-6 navbar__nav">
          <li><Link href="/" className="navbar__nav-item">Find Jobs</Link></li>
          <li><Link href="/employers" className="navbar__nav-item">Employers</Link></li>
          <li><Link href="/candidates" className="navbar__nav-item">Candidates</Link></li>
          <li><Link href="/blog" className="navbar__nav-item">Blog</Link></li>
        </ul>

        <div className="navbar__button-container">
          {isLoggedIn ? (
            userRoles.includes("Candidat") ? (
              <>
                <Link href="/Candidat/Profile" className="navbar__icon-link">
                  <FaUserCircle className="navbar__profile-icon" size={35} />
                </Link>
                <button onClick={logoutCandidat} className="navbar__connexion">Logout</button>
              </>
            ) : userRoles.includes("Admin") ? (
              <>
                <Link href="/Admin/Create-profile" className="navbar__connexion">Create Company Profile</Link>
                <button onClick={logoutAdmin} className="navbar__connexion">Logout</button>
              </>
            ) : null
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
