"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin, CalendarDays, FileText } from "lucide-react";
import SearchBar from "./SearchBar";
import { useAuth } from "@/src/context/authContext";

interface Offer {
  id: number;
  title: string;
  location: string;
  salary?: number;
  companyId: number;
  contractType: string;
  createdAt: string;
  description: string;
  applicationDeadline: string;
}

const ITEMS_PER_PAGE = 6;

export default function JobList() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [companyDetails, setCompanyDetails] = useState<{ [key: string]: { name: string; logo?: string } }>({});
  const [loading, setLoading] = useState(true);

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [expandedOfferIds, setExpandedOfferIds] = useState<number[]>([]);

  const toggleDescription = (id: number) => {
    setExpandedOfferIds((prev) =>
      prev.includes(id) ? prev.filter((offerId) => offerId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/offers/all");
        const data = res.data;
        setOffers(data);
        setFilteredOffers(data);

        const uniqueCompanyIds = [...new Set(data.map((offer: Offer) => offer.companyId))];
        const details: { [key: string]: { name: string; logo?: string } } = {};

        await Promise.all(
          uniqueCompanyIds.map(async (id) => {
            try {
              const companyRes = await axios.get(`http://localhost:5000/api/companies/company/${id}`);
              details[String(id)] = {
                name: companyRes.data.name,
                logo: companyRes.data.logo,
              };
              
            } catch {
              details[String(id)] = {
                name: "Unknown Company",
                logo: "",
              };
            }
          })
        );

        setCompanyDetails(details);
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
    <section className="py-12 bg-white-50 min-h-screen">
  <div className="max-w-4xl mx-auto px-4 mb-6">
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
    {paginatedOffers.map((offer) => {
      const isNew =
        (new Date().getTime() - new Date(offer.createdAt).getTime()) /
          (1000 * 3600 * 24) <
        7;

      return (
        <div
          key={offer.id}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:scale-[1.01]"
        >
          <div className="flex items-center gap-4 mb-4">
            {companyDetails[offer.companyId]?.logo && (
              <img
                src={companyDetails[offer.companyId].logo}
                alt="Company Logo"
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
              />
            )}
            <div className="flex flex-col">
              <span className="text-md font-semibold text-gray-900">
                {companyDetails[offer.companyId]?.name || "Unknown Company"}
              </span>
             
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-blue-800">{offer.title}</h3>
            {isNew && (
              <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-gray-700 mb-3">
            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
              <MapPin className="w-4 h-4" />
              {offer.location}
            </span>
            <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
              <FileText className="w-4 h-4" />
              {offer.contractType}
            </span>
          </div>

          <div className="space-y-1 text-xs text-gray-600 mb-4">
          <div className="flex flex-col gap-1 text-xs text-gray-700">
  <span className="flex items-center gap-1">
    <CalendarDays className="w-4 h-4 text-gray-500" />
    <span>
      <strong>Posted:</strong> {new Date(offer.createdAt).toLocaleDateString()}
    </span>
  </span>

  <span className="flex items-center gap-1">
    <CalendarDays className="w-4 h-4 text-red-600" />
    <span>
      <strong>Deadline:</strong> {new Date(offer.applicationDeadline).toLocaleDateString()}
    </span>

    {new Date(offer.applicationDeadline) < new Date() && (
      <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
        Expired
      </span>
    )}
  </span>
</div>
          </div>

          <p className={`text-sm text-gray-700 mb-2 ${expandedOfferIds.includes(offer.id) ? '' : 'line-clamp-3'}`}>
  {offer.description}
</p>

{offer.description.length > 150 && (
  <button
    onClick={() => toggleDescription(offer.id)}
    className="text-blue-600 hover:underline text-sm mb-4"
  >
      {expandedOfferIds.includes(offer.id) ? "Show less" : "Read more"}
      </button>
)}

<div className="flex justify-end mt-4">
  <button
    onClick={() => {
      if (isLoggedIn) {
        router.push(`/Candidat/PostulerOffre/${offer.id}`);
      } else {
        router.push("/login/Candidat");
      }
    }}
    className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
  >
    Apply Now
  </button>
</div>

        </div>
      );
    })}
  </div>

  {/* Pagination */}
  <div className="flex justify-center items-center gap-2 mt-12">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
      className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
    >
      Prev
    </button>

    {Array.from({ length: totalPages }).map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`px-4 py-1.5 rounded-md text-sm font-medium ${
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
      className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
    >
      Next
    </button>
  </div>
</section>
  );
}