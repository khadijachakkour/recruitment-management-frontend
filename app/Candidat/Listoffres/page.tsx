'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, CalendarDays, Coins } from 'lucide-react';
import Link from 'next/link';
import { FaBriefcase } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import NavbarCandidat from '@/app/components/NavbarCandidat';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get<Offer[]>('http://localhost:8081/api/offers/all');
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

  const filterOffers = () => {
    let filtered = offers;

    if (searchQuery) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (contractTypeFilter !== 'all') {
      filtered = filtered.filter(offer => offer.contractType === contractTypeFilter);
    }

    setFilteredOffers(filtered);
  };

  useEffect(() => {
    filterOffers();
  }, [searchQuery, contractTypeFilter, offers]);


  const handleApply = (offerId: number) => {
    router.push(`/Candidat/PostulerOffre/${offerId}`);

  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
   <NavbarCandidat />
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} p-6`}>
        <div className="max-w-6xl mx-auto py-10 px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Available Job Offers</h1>

          
<div className="flex justify-center mb-10">
  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl items-center">
    <div className="relative w-full">
      <FaBriefcase className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search for a job title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
      />
    </div>

    <select
      value={contractTypeFilter}
      onChange={(e) => setContractTypeFilter(e.target.value)}
      className="w-full sm:w-auto px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
    >
      <option value="all">All contract types</option>
      <option value="CDD">CDD</option>
      <option value="CDI">CDI</option>
      <option value="Stage">Internship</option>
    </select>
  </div>
</div>

      {/* Displaying the offers */}
      {loading ? (
        <p className="text-center text-gray-500">Loading offers...</p>
      ) : filteredOffers.length === 0 ? (
        <p className="text-center text-red-500">No offers available at the moment.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) => (
            <div
            key={offer.id}
            className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <Link
                href={`/Candidat/viewOffers/${offer.id}`}
                className="block"
                title={`View details of ${offer.title}`}
              >
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-1 hover:text-blue-700 transition">
                  <Briefcase className="text-blue-600" size={20} />
                  {offer.title}
                </h2>
          
                <p className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                  <MapPin size={16} className="text-gray-500" />
                  {offer.location}
                </p>
          
                <div className="flex flex-wrap gap-2 mt-4 mb-4">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                    {offer.contractType}
                  </span>
                  <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <CalendarDays size={14} />
                    {new Date(offer.applicationDeadline).toLocaleDateString()}
                  </span>
                  {offer.salary && (
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <Coins size={14} />
                      {offer.salary} MAD
                    </span>
                  )}
                </div>
              </Link>
            </div>
          
            <button
              onClick={() => handleApply(offer.id)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition">
              Apply
            </button>
          </div>
          
          ))}
        </div>
      )}
     </div>
      </main>
    </div>
  );
};

export default AllOffersPage;
