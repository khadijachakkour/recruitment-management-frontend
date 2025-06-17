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
    <div className="flex min-h-screen bg-white">
      <NavbarCandidat />
      <main className={`flex-1 transition-all duration-300 p-8 flex items-center justify-center min-h-screen relative`}>
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-4">
          <div className="flex flex-col items-center mb-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Complete Your Profile</h3>
            <p className="mt-1 text-sm text-gray-600 text-center max-w-md">Fill in your details to enhance your candidacy.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isLoading}>
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
            )}
            {/* Avatar Section */}
            <section className="flex flex-col items-center space-y-3">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
                <Image
                  src={avatarPreview || "/images/default-avatar.png"}
                  alt="Avatar"
                  width={112}
                  height={112}
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
                className="block w-full text-base text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition focus:ring-2 focus:ring-blue-400 focus:outline-none border border-gray-200 rounded-lg"
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
                  className="text-red-600 underline text-sm hover:text-red-700"
                >
                  Remove profile image
                </button>
              )}
            </section>

            {/* Profile Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                <div className="space-y-3">
                  <input
                    type="tel"
                    name="phone_number"
                    value={profile.phone_number}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder-gray-500"
                    placeholder="Phone Number"
                  />
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder-gray-500"
                    placeholder="Address"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Experience & Education</h3>
                <div className="space-y-3">
                  <textarea
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder-gray-500"
                    placeholder="Describe your work experience..."
                  />
                  <input
                    type="text"
                    name="education_level"
                    value={profile.education_level}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder-gray-500"
                    placeholder="Education level"
                  />
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
              <textarea
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-500 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder-gray-500"
              />
            </section>

            {/* CV Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Curriculum Vitae (CV)</h3>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setCvFile(file);
                  setCvPreviewUrl(file ? URL.createObjectURL(file) : null);
                }}
                className="block w-full text-base text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition focus:ring-2 focus:ring-blue-400 focus:outline-none border border-gray-200 rounded-lg"
                aria-label="Upload your CV in PDF, DOC, or DOCX format"
              />
              {(cvPreviewUrl || profile.cv_url) && (
                <div className="mt-3">
                  <iframe
                    src={cvPreviewUrl || profile.cv_url}
                    className="w-full h-48 border border-blue-200 rounded-lg shadow-md"
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
                      className="text-red-600 underline text-sm mt-2 hover:text-red-700"
                    >
                      Remove CV
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2.5 px-5 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
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
                className="w-full max-w-xs border border-gray-300 bg-gray-100 text-gray-800 py-2.5 px-5 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition-all duration-200 text-base"
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