'use client';

import { useState, useEffect } from "react";
import { deleteAvatar, deleteCv, getProfile, updateProfileAndCv } from "../../../src/services/profileService";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/authContext";
import Image from "next/image";
import NavbarCandidat from "@/app/components/NavbarCandidat";

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

  const { isLoggedIn, userRoles } = useAuth();
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
      if (avatarFile) {
        formData.append("avatar", avatarFile);
        formData.append("upload_preset", "recruitment_upload");
      }

      await updateProfileAndCv(formData);
      router.push("/Candidat/dashboard");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Profile update failed.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <NavbarCandidat />
      <main className="flex-1 transition-all duration-300 p-0 pl-2 md:pl-4 flex items-start justify-center relative mb-4 pt-35">
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-xl shadow-xl p-4 md:p-8 border border-blue-100 mt-6 mb-6 mx-auto animate-fade-in">
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg mb-2 bg-white group transition-all duration-200 hover:scale-105 hover:shadow-2xl">
              <Image
                src={avatarPreview || "/images/default-avatar.png"}
                alt="Avatar"
                width={96}
                height={96}
                unoptimized={true}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-blue-800 text-center tracking-tight mb-1 drop-shadow-sm">My Profile</h2>
            <p className="mt-1 text-sm text-gray-500 text-center max-w-md">Enhance your chances by completing your professional profile.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 relative" aria-busy={isLoading}>
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
            )}
            {/* Avatar Section */}
            <section className="flex flex-col items-center space-y-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setAvatarFile(file);
                  if (file) setAvatarPreview(URL.createObjectURL(file));
                }}
                className="block w-full text-base text-gray-700 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition focus:ring-2 focus:ring-blue-400 focus:outline-none border border-gray-200 rounded-lg shadow-sm"
                aria-label="Upload profile image"
              />
              {avatarPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarPreview(null);
                    setAvatarFile(null);
                    setShouldDeleteAvatar(true);
                  }}
                  className="text-red-600 underline text-xs hover:text-red-700 mt-1">
                  Remove profile image
                </button>
              )}
            </section>
            <hr className="my-1 border-blue-100" />
            {/* Profile Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <input
                  type="tel"
                  name="phone_number"
                  value={profile.phone_number}
                  onChange={handleChange}
                  className="w-full border border-blue-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder-gray-400 shadow-sm transition-all bg-white/90"
                  placeholder="Phone number"/>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full border border-blue-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder-gray-400 shadow-sm transition-all bg-white/90"
                  placeholder="Address"/>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  name="education_level"
                  value={profile.education_level}
                  onChange={handleChange}
                  className="w-full border border-blue-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder-gray-400 shadow-sm transition-all bg-white/90"
                  placeholder="Education level"
                />
                <textarea
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-blue-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder-gray-400 shadow-sm transition-all bg-white/90"
                  placeholder="Work experience..."
                />
              </div>
            </section>
            <section>
              <textarea
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                rows={2}
                className="w-full border border-blue-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder-gray-400 shadow-sm transition-all bg-white/90 mt-1"
                placeholder="Skills (comma separated)"
              />
            </section>
            {/* CV Section */}
            <section>
              <label htmlFor="cv-upload" className="block mb-2 text-sm font-bold text-blue-700 flex items-center gap-2">
                <svg className="inline-block text-blue-500" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#3b82f6" d="M16.5 2A2.5 2.5 0 0 1 19 4.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4.5A2.5 2.5 0 0 1 7.5 2h9Zm0 2h-9A.5.5 0 0 0 7 4.5V19a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V4.5A.5.5 0 0 0 16.5 4ZM12 7a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2H9a1 1 0 1 1 0-2h2V8a1 1 0 0 1 1-1Z"/></svg>
                Upload your CV (PDF, DOC, DOCX)
              </label>
              <div className="relative flex items-center group">
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCvFile(file);
                    setCvPreviewUrl(file ? URL.createObjectURL(file) : null);
                  }}
                  className="block w-full text-base text-blue-700 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition focus:ring-2 focus:ring-blue-400 focus:outline-none border-2 border-dashed border-blue-300 rounded-lg shadow-sm bg-white/80 cursor-pointer group-hover:border-blue-500 group-hover:bg-blue-50"
                  aria-label="Upload your CV in PDF, DOC, or DOCX format"
                />
                <span className="absolute right-3 text-blue-400 pointer-events-none group-hover:text-blue-600">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#60a5fa" d="M12 16a1 1 0 0 1-1-1V9.83l-2.29 2.3a1 1 0 1 1-1.42-1.42l4-4a1 1 0 0 1 1.42 0l4 4a1 1 0 1 1-1.42 1.42L13 9.83V15a1 1 0 0 1-1 1Z"/></svg>
                </span>
              </div>
              {(cvPreviewUrl || profile.cv_url) && (
                <div className="mt-1">
                  <iframe
                    src={cvPreviewUrl || profile.cv_url}
                    className="w-full h-32 border border-blue-200 rounded-lg shadow bg-white"
                    title="CV Preview"
                  />
                  {(cvPreviewUrl || profile.cv_url) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCvPreviewUrl(null);
                        setCvFile(null);
                        setShouldDeleteCv(true);
                      }}
                      className="text-red-600 underline text-xs mt-1 hover:text-red-700"
                    >
                      Remove CV
                    </button>
                  )}
                </div>
              )}
            </section>
            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-bold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm text-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  "Save"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full md:w-auto px-6 py-2 border border-blue-200 bg-white text-blue-700 rounded-lg font-bold shadow hover:bg-blue-50 transition-all duration-200 text-sm text-center"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}