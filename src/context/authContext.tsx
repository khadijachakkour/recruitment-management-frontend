"use client";   //ce fichier doit être exécuté côté client 
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { DecodedToken } from "@/app/types/DecodedToken";


//Définition du Contexte d'Authentification qui va stocker l'état d'authentification globalement dans l'application.
interface AuthContextType {
  isLoggedIn: boolean;
  userRoles: string[];
  login: (token: string) => void;
  logoutAdmin: () => Promise<void>; 
  logoutCandidat: () => Promise<void>; 

}

const AuthContext = createContext<AuthContextType | null>(null);

//Le provider qui va envelopper toute l'application et fournir les données d'authentification.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const router = useRouter(); // ✅ Gestion des redirections



  const getUserRoles = (token: string): string[] => {
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken?.realm_access?.roles || [];
    } catch (error) {
      console.error("Erreur de décodage du token:", error);
      return [];
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("access_token");
      if (token) {
        setIsLoggedIn(true);
        setUserRoles(getUserRoles(token));
      } else {
        setIsLoggedIn(false);
        setUserRoles([]);
      }  };
    checkLoginStatus();
const intervalId = setInterval(checkLoginStatus, 500);
    return () => clearInterval(intervalId);
  }, []);
    
  const login = (token: string) => {
    sessionStorage.setItem("access_token", token);
    setIsLoggedIn(true);
    setUserRoles(getUserRoles(token));
    console.log("Utilisateur connecté :", {
        isLoggedIn: true,
        userRoles: getUserRoles(token),
    });

};

//Logout Admin
const logoutAdmin = async () => {
  try {
    console.log("Début de la fonction logout");

    // ✅ Stocker le rôle AVANT de réinitialiser `userRoles`
    const role = userRoles.length > 0 ? userRoles[0] : null;
    console.log("Rôle actuel avant logout :", role);

    // Appel à l'API de déconnexion
    const response = await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      sessionStorage.removeItem("access_token");

      setIsLoggedIn(false);
      setUserRoles([]);

        router.push("/login/Admin");
      
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};

//Logout Candidat
const logoutCandidat = async () => {
  try {
    console.log("Début de la fonction logout");

    // ✅ Stocker le rôle AVANT de réinitialiser `userRoles`
    const role = userRoles.length > 0 ? userRoles[0] : null;
    console.log("Rôle actuel avant logout :", role);

    // Appel à l'API de déconnexion
    const response = await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      sessionStorage.removeItem("access_token");

      // ✅ Réinitialisation après l'utilisation du rôle
      setIsLoggedIn(false);
      setUserRoles([]);


        router.push("/login/Candidat");
      
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};
 return (
    <AuthContext.Provider value={{ isLoggedIn, userRoles, login, logoutAdmin, logoutCandidat }}>
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


