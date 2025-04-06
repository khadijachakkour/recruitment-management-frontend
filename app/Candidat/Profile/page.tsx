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
    avatar_url: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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
          avatar_url: data.avatar_url || "",
        });

        setAvatarPreview(data.avatar_url || null);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error while loading profile:", error);
        toast.error("Échec du chargement du profil.");
      }
    };

    if (!dataLoaded && isLoggedIn && userRoles.includes("Candidat")) {
      fetchProfile();
    }
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

    if (cvFile) formData.append("cv", cvFile);
    if (avatarFile) formData.append("avatar", avatarFile);

    // Rediriger immédiatement vers le dashboard
    router.push("/dashboard");
    try {
      await updateProfileAndCv(formData);
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      toast.error("Échec de la mise à jour.");
    }
  };

  return (
    <>
      <NavbarCandidat />
      <div className="max-w-4xl mx-auto mt-6 p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Modifier mon profil</h2>
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Avatar */}
          <section className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={avatarPreview || "/images/default-avatar.png"}
                alt="Avatar"
                className="object-cover w-full h-full"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setAvatarFile(file);
                if (file) {
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
              className="text-sm"
            />
          </section>

          {/* Infos personnelles */}
          <section>
            <h3 className="text-xl font-semibold mb-3">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                name="phone_number"
                value={profile.phone_number}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                placeholder="Téléphone"
              />
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                placeholder="Adresse"
              />
            </div>
          </section>

          {/* Parcours */}
          <section>
            <h3 className="text-xl font-semibold mb-3">Parcours</h3>
            <textarea
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              rows={4}
              className="w-full border p-3 rounded-md mb-4"
              placeholder="Décrivez vos expériences professionnelles..."
            />
            <input
              type="text"
              name="education_level"
              value={profile.education_level}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              placeholder="Niveau d'éducation (ex : Bac+5)"
            />
          </section>

          {/* Compétences */}
          <section>
            <h3 className="text-xl font-semibold mb-3">Compétences</h3>
            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              rows={2}
              className="w-full border p-3 rounded-md"
              placeholder="React, Node.js, SQL, etc."
            />
          </section>

          {/* CV */}
          <section>
            <h3 className="text-xl font-semibold mb-3">Curriculum Vitae</h3>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setCvFile(file);
                setCvPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
              className="w-full border p-2 rounded-md"
            />

            {cvPreviewUrl && (
              <iframe
                src={cvPreviewUrl}
                className="mt-4 w-full h-96 border rounded-md"
              />
            )}

            {!cvPreviewUrl && profile.cv_url && (
              <iframe
                src={profile.cv_url}
                className="mt-4 w-full h-96 border rounded-md"
              />
            )}
          </section>

          {/* Bouton */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
