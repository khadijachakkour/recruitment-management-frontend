"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import { useAuth } from "@/context/authContext";

interface UserProfile {
  phone_number: string;
  address: string;
  experience: string;
  education_level: string;
  skills: string;
  cv_url: string;
}


const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
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
      router.push("/login");
      return;
    }
    if (!userRoles.includes("Candidat")) {
      router.push("/unauthorized");
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/users/profile", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          phone_number: data.phone_number || "",
          address: data.address || "",
          experience: data.experience || "",
          education_level: data.education_level || "",
          skills: data.skills || "",
          cv_url: data.cv_url || "",
        }));     
       } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
    }
  };

  fetchProfile();
  }, [isLoggedIn, userRoles, router]);

// Gérer les changements dans le formulaire
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

// Gérer l'édition du CV
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setCvFile(e.target.files[0]);
  }
};

  // Soumettre les modifications du profil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données envoyées :", formData);
    try {
      const response = await fetch("http://localhost:4000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false); // Désactiver l'édition après la mise à jour
        alert("Profil mis à jour avec succès");
      } else {
        console.error("Erreur lors de la mise à jour du profil");
        alert("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  // Télécharger le CV
  const handleCvUpload = async () => {
    if (cvFile) {
      const formData = new FormData();
      formData.append("cv", cvFile);
      try {
        const response = await fetch("http://localhost:4000/api/users/profile/upload-cv", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (response.ok) {
          alert("CV téléchargé avec succès");
        } else {
          alert("Erreur lors du téléchargement du CV");
        }
      } catch (error) {
        console.error("Erreur lors du téléchargement du CV:", error);
      }
    }
  };

  if (profile) {
    
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Mon Profil</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block">Numéro de téléphone</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 p-2 w-full border"
            />
          </div>
          <div className="mt-4">
            <label className="block">Adresse</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 p-2 w-full border"
            />
          </div>
          <div className="mt-4">
            <label className="block">Expérience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="mt-1 p-2 w-full border"
            />
          </div>
          <div className="mt-4">
            <label className="block">Niveau d'études</label>
            <input
              type="text"
              name="education_level"
              value={formData.education_level}
              onChange={handleChange}
              className="mt-1 p-2 w-full border"
            />
          </div>
          <div className="mt-4">
            <label className="block">Compétences</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="mt-1 p-2 w-full border"
            />
          </div>
          <button type="submit" className="mt-4 p-2 bg-blue-500 text-white">Mettre à jour</button>
        </form>
      ) : (
        <div>
          <p><strong>Numéro de téléphone:</strong> {profile.phone_number}</p>
          <p><strong>Adresse:</strong> {profile.address}</p>
          <p><strong>Expérience:</strong> {profile.experience}</p>
          <p><strong>Niveau d'études:</strong> {profile.education_level}</p>
          <p><strong>Compétences:</strong> {profile.skills}</p>
          {profile.cv_url && <p><a href={profile.cv_url} target="_blank" rel="noopener noreferrer">Télécharger le CV</a></p>}
          <button onClick={() => setIsEditing(true)} className="mt-4 p-2 bg-yellow-500 text-white">Éditer Profil</button>
        </div>
      )}
      <div className="mt-6">
        <h3 className="text-xl">Ajouter ou changer le CV</h3>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleCvUpload} className="mt-2 p-2 bg-green-500 text-white">Télécharger le CV</button>
      </div>
    </div>
  );
};
}
export default Profile;
