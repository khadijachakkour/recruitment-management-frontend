"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin, CalendarDays, FileText } from "lucide-react";
import SearchBar from "./SearchBar";
import Categories from "./Categories";

interface Offer {
  id: number;
  title: string;
  location: string;
  salary?: number;
  companyId: number;
  contractType: string;
  createdAt: string;
  description: string;
}

const ITEMS_PER_PAGE = 6;

export default function JobList() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [companyNames, setCompanyNames] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/offers/all");
        const data = res.data;
        setOffers(data);
        setFilteredOffers(data);

        const uniqueCompanyIds = [...new Set(data.map((offer: Offer) => offer.companyId))];
        const names: { [key: string]: string } = {};

        await Promise.all(
          uniqueCompanyIds.map(async (id) => {
            try {
              const companyRes = await axios.get(`http://localhost:5000/api/companies/company/${id}`);
              names[String(id)] = companyRes.data.name;
            } catch {
              names[String(id)] = "Unknown Company";
            }
          })
        );

        setCompanyNames(names);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleSearch = () => {
    const filtered = offers.filter(
      (offer) =>
        offer.title.toLowerCase().includes(jobTitle.toLowerCase()) &&
        offer.location.toLowerCase().includes(location.toLowerCase()) &&
        offer.description.toLowerCase().includes(keywords.toLowerCase())
    );
    setFilteredOffers(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE);
  const paginatedOffers = filteredOffers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading offers...</p>;

  return (
    <section className="py-20 bg-white min-h-screen">
      <h2 className="text-center text-4xl font-bold text-gray-800 mb-6">🚀 Available Job Offers</h2>

      <div className="max-w-full mx-auto mb-10"> 
        <SearchBar
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          location={location}
          setLocation={setLocation}
          keywords={keywords}
          setKeywords={setKeywords}
          onSearch={handleSearch}
        />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {paginatedOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 p-6 border border-gray-200 hover:scale-[1.02] transform-gpu transition-transform"
          >
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">{offer.title}</h3>

            <p className="text-gray-600 mb-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-500" /> {companyNames[offer.companyId] || "Unknown Company"}
            </p>

            <div className="flex flex-wrap gap-2 my-2">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                <MapPin className="w-4 h-4" /> {offer.location}
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                <FileText className="w-4 h-4" /> {offer.contractType}
              </span>
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                <CalendarDays className="w-4 h-4" /> {new Date(offer.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-700 text-sm line-clamp-3 mb-4">{offer.description}</p>

            <button
              onClick={() => router.push("/login/Candidat")}
              className="w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-12">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
