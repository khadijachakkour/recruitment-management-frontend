"use client";

import Link from "next/link";
import "../styles/NavbarDefault.css";
import { useAuth } from "@/src/context/authContext";
import { FaUserCircle } from "react-icons/fa";

export default function NavbarDefault() {
  const { isLoggedIn, userRoles, logoutCandidat, logoutAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center p-2"> 
        <Link href="/" className="navbar__logo text-lg">SmartHire</Link> 
        {!isLoggedIn &&(
        <ul className="hidden md:flex space-x-4 navbar__nav"> 
          <li><Link href="#" className="navbar__nav-item text-sm">Find Jobs</Link></li> 
          <li><Link href="#" className="navbar__nav-item text-sm">Companies</Link></li> 
          <li><Link href="#" className="navbar__nav-item text-sm">Candidates</Link></li> 
          <li><Link href="#" className="navbar__nav-item text-sm">Blog</Link></li> 
        </ul>
        )}
        <div className="navbar__button-container">
          {isLoggedIn ? (
            userRoles.includes("Candidat") ? (
              <>
                <Link href="/Candidat/Profile" className="navbar__icon-link">
                  <FaUserCircle className="navbar__profile-icon" size={30} /> {/* Réduction de la taille de l'icône */}
                </Link>
                <button onClick={logoutCandidat} className="navbar__connexion text-sm">Logout</button> {/* Réduction de la taille du bouton */}
              </>
            ) : userRoles.includes("Admin") ? (
              <>
                <ul className="navbar__nav">
                  <li><Link href="/Admin/Dashboard" className="navbar__nav-item text-sm">Dashboard</Link></li> {/* Réduction de la taille du texte */}
                  <li><Link href="/Admin/Create-profile" className="navbar__nav-item text-sm">Create Company Profile</Link></li> {/* Réduction de la taille du texte */}
                  <li><Link href="#" className="navbar__nav-item text-sm">User Management</Link></li> {/* Réduction de la taille du texte */}
                  <li><Link href="/Admin/Recruitment-management" className="navbar__nav-item text-sm">Recruitment Management</Link></li> {/* Réduction de la taille du texte */}
                  <li><Link href="#" className="navbar__nav-item text-sm">Notifications</Link></li> {/* Réduction de la taille du texte */}
                  <li><Link href="#" className="navbar__nav-item text-sm">Account Settings</Link></li> {/* Réduction de la taille du texte */}
                  <li>
                    <button onClick={logoutAdmin} className="navbar__logout-btn text-sm">
                      <i className="fas fa-sign-out-alt navbar__logout-icon"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </>
            ) : null
          ) : (
            <div className="hidden md:flex space-x-3"> {/* Réduction de l'espacement entre les éléments */}
              <Link href="/login/Candidat" className="navbar__connexion text-sm">Sign In</Link> {/* Réduction de la taille du texte */}
              <Link href="/login" className="navbar__entreprises text-sm">Employers / Post Job</Link> {/* Réduction de la taille du texte */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
