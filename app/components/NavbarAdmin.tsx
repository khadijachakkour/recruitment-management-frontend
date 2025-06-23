"use client";
import Link from "next/link";
import "../styles/NavbarAdmin.css";
import { useAuth } from "@/src/context/authContext";

interface NavbarAdminProps {
  isSidebarOpen?: boolean;
}

export default function NavbarAdmin({ isSidebarOpen = false }: NavbarAdminProps) {
  const { isLoggedIn, userRoles, logoutAdmin } = useAuth();
  const isAdmin = isLoggedIn && userRoles.includes("Admin");
  const isRecruteur = isLoggedIn && userRoles.includes("Recruteur");

  // Décalage dynamique selon la sidebar
  // Si l'utilisateur N'EST PAS connecté, pas de décalage !
  const sidebarWidth = isLoggedIn ? (isSidebarOpen ? "16rem" : "4rem") : "0";

  return (
    <nav className="navbar" style={{ marginLeft: sidebarWidth, width: `calc(100% - ${sidebarWidth})` }}>
      <div className="container mx-auto flex justify-between items-center p-2 navbar__nav-container">
        <Link href={isAdmin ? "/Admin/Dashboard" : isRecruteur ? "/Recruteur/Dashboard" : "/"} className="navbar__logo">
          SmartHire
        </Link>

        {!isLoggedIn && (
          <ul className="hidden md:flex space-x-4 navbar__nav">
            <li><Link href="/" className="navbar__nav-item text-sm">Find Jobs</Link></li>
            <li><Link href="/employers" className="navbar__nav-item text-sm">Companies</Link></li>
            <li><Link href="/candidates" className="navbar__nav-item text-sm">Candidates</Link></li>
            <li><Link href="/blog" className="navbar__nav-item text-sm">Blog</Link></li>
          </ul>
        )}

        <div className="navbar__button-container">
          {isAdmin && (
            <ul className="navbar__nav">
              <li><Link href="/Admin/Dashboard" className="navbar__nav-item text-sm">Dashboard</Link></li>
              <li><Link href="/Admin/Manage-users" className="navbar__nav-item text-sm">User Management</Link></li>
              <li><Link href="/Admin/Recruitment-management" className="navbar__nav-item text-sm">Recruitment Management</Link></li>
              <li><Link href="#" className="navbar__nav-item text-sm">Notifications</Link></li>
              <li><Link href="/Admin/ManageProfile" className="navbar__nav-item text-sm">Manage Profile</Link></li>
              <li>
                <button onClick={logoutAdmin} className="navbar__logout-btn">
                  <i className="fas fa-sign-out-alt navbar__logout-icon"></i> Logout
                </button>
              </li>
            </ul>
          )}

          {isRecruteur && (
            <ul className="navbar__nav">

              <li><Link href="/Recruteur/Recruitment-management" className="navbar__nav-item">Recruitment Management</Link></li>
              <li><Link href="#" className="navbar__nav-item">Notifications</Link></li>
              <li><Link href="#" className="navbar__nav-item">Account Settings</Link></li>
              <li>
                <button onClick={logoutAdmin} className="navbar__connexion text-sm">
                  <i className="fas fa-sign-out-alt navbar__logout-icon"></i> Logout
                </button>
              </li>
            </ul>
          )}

          {!isLoggedIn && (
             <div className="hidden md:flex space-x-4">
             <Link href="/login/Candidat" className="navbar__connexion text-sm">Sign In</Link>
             <Link href="/login" className="navbar__entreprises text-sm">Employers / Post Job</Link>
           </div>
          )}
        </div>
      </div>
    </nav>
  );
}
