"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/context/authContext";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2, Lock } from "lucide-react";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import AdminHeader from "@/app/components/AdminHeader";
import { useRouter } from "next/navigation";

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ManageProfile() {
  const { isLoggedIn, userRoles } = useAuth();
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/users/UserProfile`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            },
          }
        );
        setUserData({
          firstname: response.data.firstName || "",
          lastname: response.data.lastName || "",
          email: response.data.email || "",
          username: response.data.username || "",
          password: "", // Password is not fetched for security
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // Correction : on ne recharge le profil qu'au montage du composant
  }, []);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate password on change
    if (name === "password" && value) {
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
      } else {
        setPasswordError(null);
      }
    } else if (name === "password" && !value) {
      setPasswordError(null);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError) {
      toast.error("Please fix the password error before submitting.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Only include password in the payload if it's non-empty
      const payload = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        username: userData.username,
        ...(userData.password && { password: userData.password }),
      };

      await axios.put(
        `${API_BASE_URL}/api/admin/updateProfileCurrentUser`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      router.push("/Admin/Profile");
      // Clear password field after successful update
      setUserData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="bg-red-50 p-6 rounded-2xl shadow-lg text-red-700 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
        style={{ minWidth: 0 }}
      >
        <AdminHeader sidebarOpen={isSidebarOpen} />
        {/* Ajout d'un espace entre le header et le contenu */}
        <div style={{ height: '32px' }} />
        <div className="flex-1 flex items-center justify-center p-6 w-full">
          <div className="w-full max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white/90 backdrop-blur-lg p-0 rounded-3xl shadow-2xl w-full border border-blue-100/60 flex flex-col items-center overflow-hidden"
              style={{ zoom: 0.85 }}
            >
              <div className="w-full flex flex-col items-center mb-6 pt-8">
                <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight mb-1">
                  Edit Profile
                </h2>
                <span className="text-blue-400 text-xs font-medium">
                  Administrator
                </span>
              </div>
              <form onSubmit={handleSubmit} className="w-full px-10 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstname"
                      className="block text-xs font-semibold text-gray-500 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={userData.firstname}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block text-xs font-semibold text-gray-500 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={userData.lastname}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-gray-500 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-xs font-semibold text-gray-500 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-gray-500 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={userData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-50/50 border ${
                          passwordError ? "border-red-500" : "border-gray-200"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400`}
                        placeholder="Enter new password (optional)"
                      />
                      <Lock
                        size={18}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    {passwordError && (
                      <p className="mt-1 text-xs text-red-600">{passwordError}</p>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={passwordError !== null}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium shadow-sm transition-all duration-300 mt-8 ${
                    passwordError
                      ? "bg-gray-400 cursor-not-allowed text-gray-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Update Profile
                </motion.button>
              </form>
              <ToastContainer />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}