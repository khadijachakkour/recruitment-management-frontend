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
  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null);
  const { isLoggedIn, userRoles } = useAuth();
  const router = useRouter();

  const [dataLoaded, setDataLoaded] = useState(false);

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
      setProfile({
        phone_number: data.phone_number || "",
        address: data.address || "",
        experience: data.experience || "",
        education_level: data.education_level || "",
        skills: data.skills || "",
        cv_url: data.cv_url || "",
      });
      setDataLoaded(true);
    } catch (error) {
      console.error("Error while loading profile:", error);
      toast.error("Failed to load profile.");
    }
  };

  if (!dataLoaded && isLoggedIn && userRoles.includes("Candidat")) {
    fetchProfile();
  }

  console.log("CV URL:", profile.cv_url); 

}, [isLoggedIn, userRoles, dataLoaded]);


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
  
    // Rediriger immédiatement vers le dashboard
    router.push("/dashboard");
  
    try {
      // Télécharger et mettre à jour le profil en arrière-plan
      await updateProfileAndCv(formData);
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
    onChange={(e) => {
      const file = e.target.files?.[0] || null;
      setCvFile(file);

      if (file) {
        const url = URL.createObjectURL(file);
        setCvPreviewUrl(url);
      } else {
        setCvPreviewUrl(null);
      }
    }}
    className="w-full border p-2 rounded"
  />
</div>

{/* Aperçu du nouveau fichier sélectionné */}
{cvPreviewUrl && (
  <div className="mt-4">
    <label className="block font-medium mb-2">CV sélectionné :</label>

    {cvFile?.type === "application/pdf" ? (
      <iframe
        src={cvPreviewUrl}
        title="CV Preview"
        className="w-full h-96 border rounded"
      ></iframe>
    ) : (
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-gray-700 font-semibold mb-2">Nom du fichier : {cvFile?.name}</p>
        <p className="text-sm text-gray-600 mb-2">Aperçu indisponible (format non PDF)</p>
        <a
          href={cvPreviewUrl}
          download={cvFile?.name}
          className="text-blue-500 hover:underline"
        >
          Télécharger le fichier
        </a>
      </div>
    )}

    <button
      type="button"
      className="mt-2 text-red-500 hover:underline"
      onClick={() => {
        setCvFile(null);
        setCvPreviewUrl(null);
      }}
    >
      Supprimer le CV sélectionné
    </button>
  </div>
)}

{/* CV existant affiché si aucun fichier nouveau sélectionné */}
{!cvPreviewUrl && profile.cv_url && (
  <div className="mt-4">
    <label className="block font-medium mb-2">CV actuel :</label>
    <iframe
      src={profile.cv_url}
      title="CV actuel"
      className="w-full h-96 border rounded"
    ></iframe>
    <p className="text-sm text-gray-600 mt-2">
      Le CV actuel sera remplacé si vous en sélectionnez un nouveau.
    </p>
  </div>
)}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
