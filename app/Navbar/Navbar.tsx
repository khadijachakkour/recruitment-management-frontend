"use client"; 

import Link from "next/link";
import "../styles/navbar.css";


export default function NavbarDefault() {

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="navbar__logo">JobBox</Link>

        <ul className="hidden md:flex space-x-6 navbar__nav">
          <li><Link href="/" className="navbar__nav-item">Find a Job</Link></li>
          <li><Link href="/employers" className="navbar__nav-item">Employers</Link></li>
          <li><Link href="/candidates" className="navbar__nav-item">Candidates</Link></li>
          <li><Link href="/blog" className="navbar__nav-item">Blog</Link></li>
        </ul>

        <div className="hidden md:flex space-x-4 navbar__button-container">
           
              <Link href="/login/Candidat" className="navbar__connexion">Sign In</Link>
              <Link href="/login/Admin" className="navbar__entreprises">Employers / Post a Job</Link>
            
        </div>
      </div>
    </nav>
  );
}
