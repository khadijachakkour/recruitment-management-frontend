'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, CalendarDays, Coins, Search, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavbarCandidat from '@/app/components/NavbarCandidat';

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Offer {
  id: number;
  title: string;
  description: string;
  location: string;
  salary?: number;
  skillsRequired: string;
  contractType: string;
  applicationDeadline: string;
}

const AllOffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [contractTypeFilter, setContractTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedOffers, setSavedOffers] = useState<number[]>([]);
  const offersPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get<Offer[]>(`${API_BASE_URL}/api/offers/all`);
        setOffers(res.data);
        setFilteredOffers(res.data);
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const filterOffers = useCallback(() => {
    let filtered = offers;

    if (searchQuery) {
      filtered = filtered.filter((offer) =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (contractTypeFilter !== 'all') {
      filtered = filtered.filter((offer) => offer.contractType === contractTypeFilter);
    }

    setFilteredOffers(filtered);
  }, [offers, searchQuery, contractTypeFilter]);

  useEffect(() => {
    filterOffers();
    setCurrentPage(1); 
  }, [filterOffers]);

  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);
  const startIdx = (currentPage - 1) * offersPerPage;
  const endIdx = startIdx + offersPerPage;
  const paginatedOffers = filteredOffers.slice(startIdx, endIdx);

  const handleApply = (offerId: number) => {
    router.push(`/Candidat/PostulerOffre/${offerId}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <NavbarCandidat />
      <main className="flex-1 flex justify-center items-start transition-all duration-300 p-6 lg:p-10 pt-24 style={{ zoom: 0.9 }}">
        <div className="w-full max-w-7xl py-10 px-2 sm:px-6 lg:px-10">
          <h1 className="text-4xl font-extrabold mb-12 text-center text-blue-900 drop-shadow-sm tracking-tight">
            Explore Job Opportunities
          </h1>
          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14 justify-center items-center">
            <div className="relative w-full sm:w-[420px]">
              <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-blue-200 bg-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-700 placeholder-blue-300 transition-all duration-200 text-base font-medium"
              />
            </div>
            <select
              value={contractTypeFilter}
              onChange={(e) => setContractTypeFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 rounded-xl border border-blue-200 bg-transparent shadow-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 transition-all duration-200"
            >
              <option value="all">All Contract Types</option>
              <option value="CDD">CDD</option>
              <option value="CDI">CDI</option>
              <option value="Stage">Internship</option>
            </select>
          </div>
          {/* Offers Grid */}
          {loading ? (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          ) : filteredOffers.length === 0 ? (
            <p className="text-center text-red-500 text-lg">No opportunities available at the moment.</p>
          ) : (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white/90 shadow-xl rounded-2xl p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-blue-100 flex flex-col justify-between relative group"
                  >
                    {/* Bookmark Icon */}
                    <button
                      type="button"
                      aria-label={savedOffers.includes(offer.id) ? 'Remove from saved offers' : 'Save this offer'}
                      onClick={() => setSavedOffers(saves => saves.includes(offer.id) ? saves.filter(id => id !== offer.id) : [...saves, offer.id])}
                      className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white shadow hover:bg-yellow-50 transition border border-yellow-100 group-hover:scale-110"
                    >
                      <Bookmark
                        size={26}
                        className={savedOffers.includes(offer.id) ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-200'}
                        fill={savedOffers.includes(offer.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                    <div>
                      <Link href={`/Candidat/viewOffers/${offer.id}`} className="block">
                        <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-3 hover:text-blue-700 transition-colors duration-200">
                          {offer.title}
                        </h2>
                        <p className="flex items-center gap-2 text-blue-700 text-sm mb-3">
                          <MapPin className="text-blue-400 w-4 h-4" />
                          {offer.location}
                        </p>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{offer.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                            {offer.contractType}
                          </span>
                          <span className="inline-block bg-yellow-50 text-yellow-600 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {new Date(offer.applicationDeadline).toLocaleDateString()}
                          </span>
                          {offer.salary && (
                            <span className="inline-block bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                              <Coins className="w-4 h-4" />
                              {offer.salary} MAD
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleApply(offer.id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-base font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 w-full group-hover:scale-[1.03]"
                      >
                        Apply Now
                      </button>
                      <Link
                        href={`/Candidat/viewOffers/${offer.id}`}
                        className="bg-white border border-blue-200 text-blue-700 font-bold py-3 px-6 rounded-xl shadow hover:bg-blue-50 transition-all duration-200 w-full text-center flex items-center justify-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-5 py-2.5 rounded-xl font-bold border transition-colors duration-200 text-base shadow-sm ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
                >
                  Prev
                </button>
                <span className="text-blue-700 font-bold text-lg select-none">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-5 py-2.5 rounded-xl font-bold border transition-colors duration-200 text-base shadow-sm ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllOffersPage;