"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecruteurLayout from '@/RecruteurLayout';

interface Entretien {
  id: string;
  date: string;
  type: string;
  lieu: string;
  statut: string;
  candidatureId: string;
  offer_id?: string; // Add offer_id here
  candidate?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

const PlannedInterviewsPage = () => {
  const [entretiens, setEntretiens] = useState<Entretien[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recruteurId, setRecruteurId] = useState<string>("");
  const [offers, setOffers] = useState<{id: string, title: string}[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  // Search and filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [offerFilter, setOfferFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchRecruteurIdAndEntretiens = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get recruiter ID from session
        const { data } = await axios.get("http://localhost:4000/api/users/userId", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        if (data.userId) {
          setRecruteurId(data.userId);
          // Fetch entretiens
          const res = await axios.get(`http://localhost:3004/api/entretiens/recruteur/${data.userId}`);
          setEntretiens(res.data);
          // Fetch all offers for mapping offer title
          const offersRes = await axios.get(`http://localhost:8081/api/offers/by-recruiter/${data.userId}`);
          setOffers(offersRes.data.map((o: any) => ({ id: String(o.id), title: o.title })));
        }
      } catch (err: any) {
        setError("Erreur lors du chargement des entretiens.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecruteurIdAndEntretiens();
  }, []);

  // Helper to get offer title by offerId (from candidature)
  const getOfferTitle = (offerId: string) => {
    return offers.find(o => o.id === offerId)?.title || '';
  };

  // Filtered and searched interviews
  const filteredEntretiens = entretiens.filter((e: Entretien) => {
    const matchesSearch =
      search === "" ||
      (e.candidate && (
        (e.candidate.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          e.candidate.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          e.candidate.email?.toLowerCase().includes(search.toLowerCase()))
      )) ||
      e.lieu?.toLowerCase().includes(search.toLowerCase()) ||
      getOfferTitle(e.offer_id ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "" || e.statut === statusFilter;
    const matchesOffer = offerFilter === "" || e.offer_id === offerFilter;
    const matchesDate = dateFilter === "" || (e.date && e.date.slice(0, 10) === dateFilter);
    return matchesSearch && matchesStatus && matchesOffer && matchesDate;
  });

  const totalPages = Math.ceil(filteredEntretiens.length / itemsPerPage);
  const paginatedEntretiens = filteredEntretiens.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <RecruteurLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col">
        <div className="w-full max-w-6xl mx-auto pt-10 pb-10 px-2 md:px-6">
          {loading && (
            <div className="w-full flex justify-center my-10">
              <div className="h-1 w-1/2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 animate-loading-bar rounded-b" />
            </div>
          )}
          {error && <div className="text-red-600 mb-6 font-semibold text-center bg-red-50 border border-red-200 rounded-lg py-3">{error}</div>}
          {entretiens.length === 0 && !loading && (
            <div className="text-gray-400 text-center text-xl py-16">No planned interviews found.</div>
          )}
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search by candidate, location, or offer..."
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All</option>
                <option value="PLANIFIE">Planned</option>
                <option value="REALISE">Completed</option>
                <option value="ANNULE">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Offer</label>
              <select
                value={offerFilter}
                onChange={e => { setOfferFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All</option>
                {offers.map((o: {id: string, title: string}) => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Interview Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedEntretiens.map((e) => (
              <div key={e.id} className="group bg-white rounded-3xl shadow-2xl border border-blue-100 p-8 flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-blue-200/80 relative overflow-hidden">
                {/* Badge type & status */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full shadow-sm ${e.type === 'Visio' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}> 
                    {e.type === 'Visio' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16M4 6v12" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" /></svg>
                    )}
                    {e.type === 'Visio' ? 'Video' : 'In-person'}
                  </span>
                  <span className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full shadow ${e.statut === 'PLANIFIE' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}> 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                    {e.statut === 'PLANIFIE' ? 'PLANNED' : e.statut}
                  </span>
                </div>
                {/* Date */}
                <div className="flex items-center text-base text-gray-700 mb-1 gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" /></svg>
                  <span className="font-semibold">Date:</span>
                  <span className="ml-1">{e.date ? new Date(e.date).toLocaleString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                </div>
                {/* Location */}
                <div className="flex items-center text-base text-gray-700 mb-1 gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 11v10" /></svg>
                  <span className="font-semibold">Location:</span>
                  <span className="ml-1">{e.lieu || '-'}</span>
                </div>
                {/* Candidate info */}
                {e.candidate && (
                  <div className="flex items-center text-base text-gray-700 mb-1 gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.5 21a7.5 7.5 0 0113 0" /></svg>
                    <span className="font-semibold">Candidate:</span>
                    <span className="ml-1">{e.candidate.firstName} {e.candidate.lastName} <span className="text-xs text-gray-400">({e.candidate.email})</span></span>
                  </div>
                )}
                {/* Offer title */}
                <div className="flex items-center text-base text-gray-700 mb-1 gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
                  <span className="font-semibold">Offer:</span>
                  <span className="ml-1">{getOfferTitle(e.offer_id ?? "") || '-'}</span>
                </div>
                {/* Decorative gradient blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-200 via-blue-100 to-transparent rounded-full opacity-30 group-hover:opacity-50 transition" />
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="font-bold text-blue-900">Page {currentPage} / {totalPages}</span>
              <button
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </RecruteurLayout>
  );
};

export default PlannedInterviewsPage;
