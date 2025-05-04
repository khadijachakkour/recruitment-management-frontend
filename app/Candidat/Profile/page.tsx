"use client";

import { useState, useEffect } from "react";
import { deleteAvatar, deleteCv, getProfile, updateProfileAndCv } from "../../../src/services/profileService";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/authContext";
import Image from "next/image";
import { LogOut, Menu, X, Home, Search, FileText, Briefcase, User, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const [profile, setProfile] = useState({
    phone_number: "",
    address: "",
    experience: "",
    education_level: "",
    skills: "",
    cv_url: "",
    avatar_url: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [shouldDeleteAvatar, setShouldDeleteAvatar] = useState(false);
  const [shouldDeleteCv, setShouldDeleteCv] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isLoggedIn, userRoles, logoutCandidat } = useAuth();
  const router = useRouter();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login/Candidat");
      return;
    }

    if (!userRoles.includes("Candidat")) {
      router.push("/unauthorized");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        console.log("Profile data:", data);
        setProfile({
          phone_number: data.phone_number || "",
          address: data.address || "",
          experience: data.experience || "",
          education_level: data.education_level || "",
          skills: data.skills || "",
          cv_url: data.cv_url || "",
          avatar_url: data.avatar_url || "",
        });
        setAvatarPreview(data.avatar_url || null);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error while loading profile:", error);
        toast.error("Failed to load profile.");
      }
    };

    if (!dataLoaded && isLoggedIn && userRoles.includes("Candidat")) {
      fetchProfile();
    }
  }, [isLoggedIn, userRoles, dataLoaded, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    router.push("/Candidat/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (shouldDeleteAvatar) {
        await deleteAvatar();
      }

      if (shouldDeleteCv) {
        await deleteCv();
      }

      const formData = new FormData();
      formData.append("phone_number", profile.phone_number);
      formData.append("address", profile.address);
      formData.append("experience", profile.experience);
      formData.append("education_level", profile.education_level);
      formData.append("skills", profile.skills);
      if (cvFile) formData.append("cv", cvFile);
      if (avatarFile) formData.append("avatar", avatarFile);

      await updateProfileAndCv(formData);
      router.push("/Candidat/dashboard");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Profile update failed.");
    } finally {
      setIsLoading(false); 
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* SIDEBAR */}
        <aside
          className={`fixed top-0 left-0 h-full bg-white border-r shadow-lg transition-all duration-300 ease-in-out z-40 ${
            isSidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              {isSidebarOpen && <h2 className="text-2xl font-bold text-blue-600">Candidate</h2>}
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
          <nav className="mt-4 px-2 space-y-1 text-sm font-medium">
            <SidebarLink href="/Candidat/dashboard" icon={<Home size={18} />} text="Dashboard" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/jobs" icon={<Search size={18} />} text="Jobs" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/applications" icon={<FileText size={18} />} text="Apply" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/evaluations" icon={<Briefcase size={18} />} text="Evaluation" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/candidature-status" icon={<User size={18} />} text="Tracking" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/companies" icon={<Search size={18} />} text="Companies" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/messages" icon={<MessageSquare size={18} />} text="Messaging" isSidebarOpen={isSidebarOpen} />
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={logoutCandidat}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors w-full"
            >
              <LogOut size={18} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} p-6`}>
          <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Edit My Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Avatar */}
              <section className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                  <Image
                    src={avatarPreview || "/images/default-avatar.png"}
                    alt="Avatar"
                    width={128}
                    height={128}
                    unoptimized={true}
                    className="object-cover w-full h-full"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setAvatarFile(file);
                    if (file) setAvatarPreview(URL.createObjectURL(file));
                  }}
                  className="text-sm"
                />
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview(null);
                      setAvatarFile(null);
                      setShouldDeleteAvatar(true);
                    }}
                    className="text-red-500 underline text-sm"
                  >
                    Remove profile image
                  </button>
                )}
              </section>

              {/* Personal Info */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="tel"
                    name="phone_number"
                    value={profile.phone_number}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone Number"
                  />
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Address"
                  />
                </div>
              </section>

              {/* Experience & Education */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Experience & Education</h3>
                <textarea
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 p-3 rounded-lg mb-4"
                  placeholder="Describe your work experience..."
                />
                <input
                  type="text"
                  name="education_level"
                  value={profile.education_level}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  placeholder="Education level (e.g. Master's degree)"
                />
              </section>

              {/* Skills */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Skills</h3>
                <textarea
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  placeholder="React, Node.js, SQL, etc."
                />
              </section>

              {/* CV Upload */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Curriculum Vitae (CV)</h3>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCvFile(file);
                    setCvPreviewUrl(file ? URL.createObjectURL(file) : null);
                  }}
                  className="w-full border p-2 rounded-lg"
                />
                {(cvPreviewUrl || profile.cv_url) && (
                  <iframe
                    src={cvPreviewUrl || profile.cv_url}
                    className="mt-4 w-full h-96 border rounded-lg"
                  />
                )}
                {(cvPreviewUrl || profile.cv_url) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCvPreviewUrl(null);
                      setCvFile(null);
                      setShouldDeleteCv(true);
                    }}
                    className="text-red-600 underline text-sm mt-2"
                  >
                    Remove CV
                  </button>
                )}
              </section>

              {/* Buttons */}
              <div className="flex justify-center gap-4">
              <button
  type="submit"
  disabled={isLoading}
  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {isLoading ? (
    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  ) : (
    "Save Changes"
  )}
</button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

function SidebarLink({
  href,
  icon,
  text,
  isSidebarOpen,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  isSidebarOpen: boolean;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
        {icon}
        {isSidebarOpen && <span>{text}</span>}
      </div>
    </Link>
  );
}