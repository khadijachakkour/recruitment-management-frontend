"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  userRoles: string[];
  login: (token: string) => void;
  logout: () => Promise<void>; // ✅ logout est maintenant une fonction asynchrone
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const router = useRouter(); // ✅ Gestion des redirections

const checkLoginStatus = () => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
      setUserRoles(getUserRoles(token));
    } else {
      setIsLoggedIn(false);
      setUserRoles([]);
    }  };

    // Fonction pour récupérer les rôles depuis le token
  const getUserRoles = (token: string): string[] => {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.realm_access?.roles || [];
    } catch (error) {
      console.error("Erreur de décodage du token:", error);
      return [];
    }
  };

  useEffect(() => {
    // Vérifie l'état de la connexion à chaque changement du sessionStorage
    checkLoginStatus();
const intervalId = setInterval(checkLoginStatus, 500);
    return () => clearInterval(intervalId);
  }, []);
    


  const login = (token: string) => {
    sessionStorage.setItem("access_token", token);
    setIsLoggedIn(true); // ✅ Force la mise à jour immédiate
    setUserRoles(getUserRoles(token));
    console.log("Utilisateur connecté :", {
        isLoggedIn: true,
        userRoles: getUserRoles(token),
    });

    window.dispatchEvent(new Event("authChange"));
};

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include", // ✅ Important pour envoyer le cookie
      });

      if (response.ok) {
        sessionStorage.removeItem("access_token"); // ✅ Supprime le token du sessionStorage
        setIsLoggedIn(false);
        setUserRoles([]);
        window.dispatchEvent(new Event("authChange"));

        router.push("/login"); // ✅ Redirection propre avec Next.js
      } else {
        console.error("Erreur de déconnexion");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

 return (
    <AuthContext.Provider value={{ isLoggedIn, userRoles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 


