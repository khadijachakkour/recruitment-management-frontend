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
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, userRoles } = useAuth();
  const router = useRouter();

  

  // Récupérer les données du profil au chargement
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
        console.error("Erreur lors du chargement du profil :", error);
        toast.error("Erreur lors du chargement du profil.");
      }
    };
    fetchProfile();
  }, [isLoggedIn, router, userRoles]);

  // Gérer la mise à jour des champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Gérer la mise à jour des informations du profil et l'upload du CV
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Crée un FormData pour inclure à la fois les données du profil et le CV
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
      const data = await updateProfileAndCv(formData); // Nouvelle fonction API qui gère le profil et l'upload
      setProfile((prev) => ({ ...prev, cv_url: data.cv_url }));
      toast.success("Profil et CV mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil et du CV:", error);
      toast.error("Erreur lors de la mise à jour du profil et du CV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <NavbarCandidat/>
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Mon Profil</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Numéro de téléphone</label>
          <input
            type="tel"
            name="phone_number"
            value={profile.phone_number}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Adresse</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Expérience</label>
          <textarea
            name="experience"
            value={profile.experience}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">{`Niveau d'éducation`}</label>
          <input
            type="text"
            name="education_level"
            value={profile.education_level}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Compétences</label>
          <textarea
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={2}
            placeholder="Ex: JavaScript, React, SQL..."
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Téléverser un CV</label>
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
          disabled={loading}
        >
          {loading ? "Mise à jour..." : "Enregistrer"}
        </button>
      </form>

      {profile.cv_url && (
        <p className="mt-4">
          CV actuel :{" "}
          <a href={profile.cv_url} target="_blank" className="text-blue-500 underline">
            Voir le CV
          </a>
        </p>
      )}
    </div>
  </>
  );
};

export default Profile;
