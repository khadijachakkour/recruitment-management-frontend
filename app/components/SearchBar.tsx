import { FaSearch, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

interface Props {
  jobTitle: string;
  setJobTitle: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  onSearch: () => void;
}

export default function SearchBar({
  jobTitle, setJobTitle,
  location, setLocation,
  keywords, setKeywords,
  onSearch
}: Props) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="hero-searchbar">
      <div className="search-input">
        <FaBriefcase className="icon" />
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="search-input">
        <FaMapMarkerAlt className="icon" />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="search-input">
        <FaSearch className="icon" />
        <input
          type="text"
          placeholder="Keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-64"
        />
      </div>

      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}
