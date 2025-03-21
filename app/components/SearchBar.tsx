"use client";
import { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import "../styles/SearchBar.css";  // Importation du fichier CSS

export default function SearchBar() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Job Title:", jobTitle, "Location:", location, "Keywords:", keywords);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hero-searchbar"
    >
      {/* Job Title Field */}
      <div className="search-input">
        <FaBriefcase className="icon" />
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>

      {/* Location Field */}
      <div className="search-input">
        <FaMapMarkerAlt className="icon" />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Keywords Field */}
      <div className="search-input">
        <FaSearch className="icon" />
        <input
          type="text"
          placeholder="Keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>

      {/* Search Button */}
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}
