"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/context/authContext";
import axios from "axios";
//import "../styles/ManageProfile.css";

export default function ManageProfile() {
  const { isLoggedIn, userRoles } = useAuth();
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  });

  // Fetch user data when component mounts
  useEffect(() => {
      axios
        .get("http://localhost:4000/api/admin/profileAdmin") // Endpoint pour récupérer les données de l'utilisateur connecté
        .then((response) => {
          // En supposant que l'API renvoie les données de l'utilisateur
          setUserData({
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            email: response.data.email,
            username: response.data.username,
            password: response.data.password, 
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
  }, [isLoggedIn, userRoles]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .put("/api/updateProfile", userData) // Endpoint pour mettre à jour le profil
      .then((response) => {
        alert("Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile");
      });
  };

  return (
    <div className="manage-profile">
      <h2>Manage Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={userData.firstname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={userData.lastname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Update Profile
        </button>
      </form>
    </div>
  );
}
