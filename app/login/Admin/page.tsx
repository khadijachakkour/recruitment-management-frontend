"use client";  
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { login } from "@/src/services/authService"; 
import styles from "./login.module.css";
import { jwtDecode } from "jwt-decode";
import NavbarAdmin from "@/app/components/NavbarAdmin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const accessToken = await login(email, password);  
      if (accessToken) {
        const decodedToken: any = jwtDecode(accessToken);
        const roles = decodedToken?.realm_access?.roles || [];

        // Vérification du rôle Admin
        if (roles.includes("Admin")) {
          // Vérification de l'existence du profil d'entreprise
          const response = await fetch("http://localhost:5000/api/companies/profile", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.status === 404) {
            // Si aucun profil n'est trouvé, redirection vers la page de création
            router.push("/Admin/Create-profile");
          } else {
            // Si un profil existe, redirection vers le dashboard
            router.push("/Admin/Dashboard");
          }
        } else {
          setErrorMessage("Vous n'êtes pas autorisé à accéder à cette page.");
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur de connexion : Vérifiez vos identifiants.");
    }
  };

  return (
    <>
    <NavbarAdmin/>
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign In</h2>
        <p className={styles.subtitle}>Access your account</p>

        {/* Affichage de l'erreur si elle existe */}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Email */}
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>

          {/* Sign In Button */}
          <button type="submit" className={styles.signInButton}>
            Sign In
          </button>
        </form>

        {/* Link to Register page */}
        <p className={styles.signUpText}>
          Don&apos;t have an account?{" "}
          <Link href="/register/Admin" className={styles.signUpLink}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}
