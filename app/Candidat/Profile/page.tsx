"use client";

import { useState, useEffect } from "react";
import { getProfile, updateProfileAndCv } from "../../../src/services/profileService";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/authContext";
import NavbarCandidat from "../../components/NavbarCandidat";

const Profile = () => {
  const [profile, setProfile] = useState({
    phone_number: "",
    address: "",
    experience: "",
    education_level: "",
    skills: "",
    cv_url: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const { isLoggedIn, userRoles } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login/Candidat");
      return;
    }
    if (!userRoles.includes("Candidat")) {
      router.push("/unauthorized");
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error while loading profile:", error);
        toast.error("Failed to load profile.");
      }
    };

    fetchProfile();
  }, [isLoggedIn, router, userRoles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("phone_number", profile.phone_number);
    formData.append("address", profile.address);
    formData.append("experience", profile.experience);
    formData.append("education_level", profile.education_level);
    formData.append("skills", profile.skills);

    if (cvFile) {
      formData.append("cv", cvFile);
    }

    try {
      const data = await updateProfileAndCv(formData);
      setProfile((prev) => ({ ...prev, cv_url: data.cv_url }));
      toast.success("Profile and CV updated successfully!");

      // ✅ Redirect after successful save
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating profile and CV:", error);
      toast.error("Failed to update profile and CV.");
    }
  };

  return (
    <>
      <NavbarCandidat />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Experience</label>
            <textarea
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Education Level</label>
            <input
              type="text"
              name="education_level"
              value={profile.education_level}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Skills</label>
            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={2}
              placeholder="E.g., JavaScript, React, SQL..."
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Upload CV</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </form>

        {profile.cv_url && (
          <p className="mt-4">
            Current CV:{" "}
            <a href={profile.cv_url} target="_blank" className="text-blue-500 underline">
              View CV
            </a>
          </p>
        )}
      </div>
    </>
  );
};

export default Profile;
