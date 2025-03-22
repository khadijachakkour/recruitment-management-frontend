"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./login.module.css";
import { FaLock, FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Pour gérer l'erreur d'authentification
  const router = useRouter();

  // Fonction pour gérer la soumission du formulaire
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Réinitialiser le message d'erreur à chaque tentative
  
    // Vérifie si les champs sont remplis
    if (!email || !password) {
      setErrorMessage("Please fill in both fields");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      
        // Redirige vers le tableau de bord ou la page d'accueil
        router.push("/dashboard");
      } else {
        // Si l'authentification échoue, affiche un message d'erreur
        setErrorMessage(data.message || "Authentication failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign In</h2>
        <p className={styles.subtitle}>Welcome back! Your dream job is just a step away</p>

        {/* Login with Google and Microsoft */}
        <div className={styles.socialButtons}>
          <button className={styles.socialButton}>
            <img src="/icons/icons8-google.svg" alt="Google" className={styles.icon} /> Google
          </button>
          <button className={styles.socialButton}>
            <img src="icons/icons8-microsoft.svg" alt="Microsoft" className={styles.icon} /> Microsoft
          </button>
        </div>

        <div className={styles.orSeparator}>
          <hr className={styles.line} />
          <span className={styles.orText}>OR</span>
          <hr className={styles.line} />
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleLogin}>
          {/* Display error message if any */}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <div className={styles.inputGroup}>
            <FaUser className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

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
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          {/* Remember me & Forgot Password */}
          <div className={styles.options}>
            <label className={styles.rememberMe}>
              <input type="checkbox" className={styles.checkbox} /> Remember me
            </label>
            <Link href="#" className={styles.forgotPassword}>
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button type="submit" className={styles.loginButton}>
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className={styles.signUpText}>
          You haven't any account?{" "}
          <Link href="/register" className={styles.signUpLink}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
