"use client";
import { useState } from "react";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import styles from "./register.module.css";

export default function RegisterPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register/candidat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, username, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        window.location.href = "/login";
      } else {
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      alert("Une erreur s'est produite lors de l'inscription.");
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>
        <p className={styles.subtitle}>Create a new account</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* First Name */}
          <div className={styles.inputGroup}>
            <FaUser className={styles.inputIcon} />
            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {/* Last Name */}
          <div className={styles.inputGroup}>
            <FaUser className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {/* Username */}
          <div className={styles.inputGroup}>
            <FaUser className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
            />
          </div>

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

          {/* Sign Up Button */}
          <button type="submit" className={styles.signUpButton}>
            Sign Up
          </button>
        </form>

        {/* Link to Sign In page */}
        <p className={styles.signInText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.signInLink}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
