"use client";

   import { createContext, useContext, useEffect, useState } from "react";
   import { jwtDecode } from "jwt-decode";
   import { useRouter } from "next/navigation";
   import { DecodedToken } from "@/app/types/DecodedToken";

   interface AuthContextType {
     isLoggedIn: boolean;
     isAuthLoaded: boolean;
     userRoles: string[];
     candidatId?: string; 
     login: (token: string) => void;
     logoutAdmin: () => Promise<void>;
     logoutCandidat: () => Promise<void>;
     isLoggingOut: boolean;
   }

   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
   const AuthContext = createContext<AuthContextType | null>(null);

   export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [userRoles, setUserRoles] = useState<string[]>([]);
     const [candidatId, setCandidatId] = useState<string | undefined>(undefined);
     const [isAuthLoaded, setIsAuthLoaded] = useState(false);
     const [isLoggingOut, setIsLoggingOut] = useState(false);
     const router = useRouter();

     const getUserInfo = (token: string): { roles: string[]; candidatId?: string } => {
       try {
         const decodedToken: DecodedToken = jwtDecode(token);
         return {
           roles: decodedToken?.realm_access?.roles || [],
           candidatId: decodedToken?.candidatId || decodedToken?.sub, 
         };
       } catch (error) {
         console.error("Erreur de décodage du token:", error);
         return { roles: [], candidatId: undefined };
       }
     };

     useEffect(() => {
       const checkLoginStatus = () => {
         const token = sessionStorage.getItem("access_token");
         if (token) {
           setIsLoggedIn(true);
           const { roles, candidatId } = getUserInfo(token);
           setUserRoles(roles);
           setCandidatId(candidatId);
           setIsAuthLoaded(true);
         } else {
           setIsLoggedIn(false);
           setUserRoles([]);
           setCandidatId(undefined);
           setIsAuthLoaded(true);
         }
       };

       checkLoginStatus();
       const intervalId = setInterval(checkLoginStatus, 500);
       return () => clearInterval(intervalId);
     }, []);

     const login = (token: string) => {
       sessionStorage.setItem("access_token", token);
       setIsLoggedIn(true);
       const { roles, candidatId } = getUserInfo(token);
       setUserRoles(roles);
       setCandidatId(candidatId);
       console.log("Utilisateur connecté :", {
         isLoggedIn: true,
         userRoles: roles,
         candidatId,
       });
     };

     const logoutAdmin = async () => {
       try {
         setIsLoggingOut(true);
          const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
           method: "POST",
           credentials: "include",
         });
         if (response.ok) {
           sessionStorage.removeItem("access_token");
           setIsLoggedIn(false);
           setUserRoles([]);
           setCandidatId(undefined);
           router.push("/login");
         }
       } catch (error) {
         console.error("Erreur lors de la déconnexion", error);
       } finally {
         setIsLoggingOut(false);
       }
     };

     const logoutCandidat = async () => {
       try {
         setIsLoggingOut(true);
         const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
           method: "POST",
           credentials: "include",
         });
         if (response.ok) {
           sessionStorage.removeItem("access_token");
           setIsLoggedIn(false);
           setUserRoles([]);
           setCandidatId(undefined);
           router.push("/login/Candidat");
         }
       } catch (error) {
         console.error("Erreur lors de la déconnexion", error);
       } finally {
         setIsLoggingOut(false);
       }
     };

     return (
       <AuthContext.Provider
         value={{ isAuthLoaded, isLoggedIn, userRoles, candidatId, login, logoutAdmin, logoutCandidat, isLoggingOut }}
       >
         {isLoggingOut && <LoadingSpinner />}
         {children}
       </AuthContext.Provider>
     );
   };

   const LoadingSpinner = () => (
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
       <div className="relative">
         <div className="absolute inset-0 w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin animate-reverse"></div>
       </div>
     </div>
   );

   export const useAuth = () => {
     const context = useContext(AuthContext);
     if (!context) {
       throw new Error("useAuth must be used within an AuthProvider");
     }
     return context;
   };