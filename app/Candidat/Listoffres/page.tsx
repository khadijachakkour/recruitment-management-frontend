'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, CalendarDays, Coins, Search } from 'lucide-react';
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
    <div className="flex min-h-screen bg-gray-50">
      <NavbarCandidat />
      <main className="flex-1 flex justify-center items-start transition-all duration-300 p-6 lg:p-8">
        <div className="w-full max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-10 text-center text-gray-900 md:text-4xl">
            Explore Job Opportunities
          </h1>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200"
              />
            </div>
            <select
              value={contractTypeFilter}
              onChange={(e) => setContractTypeFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all duration-200"
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      <Link href={`/Candidat/viewOffers/${offer.id}`} className="block">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-3 hover:text-blue-600 transition-colors duration-200">
                          <span className="bg-blue-100 p-2 rounded-full shadow-sm">
                            <Briefcase className="text-blue-500 w-5 h-5" />
                          </span>
                          {offer.title}
                        </h2>
                        <p className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                          <MapPin className="text-gray-500 w-4 h-4" />
                          {offer.location}
                        </p>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{offer.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
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
                    <button
                      onClick={() => handleApply(offer.id)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors duration-200 w-full"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium border transition-colors duration-200 ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                >
                  Prev
                </button>
                <span className="text-gray-700 font-semibold">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium border transition-colors duration-200 ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
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