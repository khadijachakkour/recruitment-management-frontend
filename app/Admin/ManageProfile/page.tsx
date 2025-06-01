"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/context/authContext";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2, Lock } from "lucide-react";
import NavbarAdmin from "@/app/components/NavbarAdmin";
import { useRouter } from "next/navigation";

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
   const router = useRouter();

  // Fetch user data when component mounts
  useEffect(() => {
    
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users/UserProfile", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
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
  }, [isLoggedIn, userRoles]);

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
        firstName: userData.firstname,
        lastName: userData.lastname,
        email: userData.email,
        username: userData.username,
        ...(userData.password && { password: userData.password }),
      };

      await axios.put(
        "http://localhost:4000/api/admin/updateprofile",
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
      }
    );
    router.push("/Admin/Dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
            <NavbarAdmin />
    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100/50"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Manage Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={userData.firstname}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={userData.lastname}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                className={`mt-1 w-full px-4 py-3 bg-gray-50/50 border ${
                  passwordError ? "border-red-500" : "border-gray-200"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400`}
                placeholder="Enter new password (optional)"
              />
              <Lock size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {passwordError && (
              <p className="mt-1 text-xs text-red-600">{passwordError}</p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={passwordError !== null}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium shadow-sm transition-all duration-300 ${
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
  );
}