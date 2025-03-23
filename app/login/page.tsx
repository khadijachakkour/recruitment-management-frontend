"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { login } from "@/src/services/authService"; 
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const accessToken = await login(email, password);
      if (accessToken) {
        router.push("/dashboard"); // ✅ Redirection vers le tableau de bord après connexion
      }
    } catch (error) {
      alert("Erreur de connexion : Vérifiez vos identifiants.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign In</h2>
        <p className={styles.subtitle}>Access your account</p>

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
          Don't have an account?{" "}
          <Link href="/register" className={styles.signUpLink}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
