"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Pencil } from "lucide-react";
import AdminLayout from "@/AdminLayout";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/UserProfile`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setProfile(response.data);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
        <div className="bg-red-50 p-6 rounded-2xl shadow-lg text-red-700 text-center">{error}</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <main className="min-h-screen flex items-center justify-center bg-white p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-lg p-0 rounded-3xl shadow-2xl w-full max-w-3xl border border-blue-100/60 flex flex-row items-stretch overflow-hidden"
          style={{ zoom: 0.9 }}
        >
          {/* Partie bleue à gauche */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-400 w-1/3 min-w-[220px] py-10 px-4 gap-4">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-blue-700 border-4 border-blue-200 shadow-lg mb-2">
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow mb-1 text-center">My Profile</h2>
            <span className="text-blue-100 text-sm font-medium">Administrator</span>
          </div>
          {/* Partie infos à droite */}
          <div className="flex-1 flex flex-col justify-between px-10 py-10 space-y-6 bg-white">
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-semibold">Full Name</span>
                <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {profile?.firstName} {profile?.lastName}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-semibold">Email</span>
                <span className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  {profile?.email}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-semibold">Username</span>
                <span className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  {profile?.username}
                </span>
              </div>
            </div>
            <div className="w-full flex justify-center pt-8">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all text-base"
                onClick={() => router.push("/Admin/ManageProfile")}
              >
                <Pencil size={20} /> Edit Profile
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    </AdminLayout>
  );
}
