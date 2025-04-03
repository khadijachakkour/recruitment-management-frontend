"use client"; 

import Link from "next/link";
import "../styles/NavbarAdmin.css";
import { useAuth } from "@/src/context/authContext";

export default function NavbarAdmin() {
   const { isLoggedIn, userRoles, logoutAdmin } = useAuth();

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
       {isLoggedIn && userRoles.includes("Admin") ? (
           <>
           <Link href="/Admin/Create-profile" className="navbar__connexion">Create Company Profile</Link>
               <button onClick={logoutAdmin} className="navbar__connexion">Logout</button>
             </>
           ) : (
            <div className="hidden md:flex space-x-4 navbar__button-container">
           
              <Link href="/login/Candidat" className="navbar__connexion">Sign In</Link>
              <Link href="/login/Admin" className="navbar__entreprises">Employers / Post Job</Link>
            
        </div>
           )}
         </div>
      </div>
    </nav>
  );
}
