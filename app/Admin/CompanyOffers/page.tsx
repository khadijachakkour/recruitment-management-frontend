"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, Loader2 } from "lucide-react";
import AdminLayout from "@/AdminLayout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CompanyOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState<any>(null);

  const filteredOffers = offers.filter((offer) =>
    offer.title.toLowerCase().includes(search.toLowerCase()) ||
    offer.location.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard/offers`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setOffers(res.data);
      } catch (err) {
        setError("Failed to load offers. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/companies/profile`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setCompany(res.data);
      } catch (err) {
        setCompany(null);
      }
    };
    fetchOffers();
    fetchCompany();
  }, []);

  return (
    <AdminLayout>
      <main className="w-full min-h-screen font-sans px-2 sm:px-6 lg:px-16 pt-10 pb-12 bg-white to-orange-50 bg-fixed">
        {/* Header modernisé avec bleu et orange */}
        <div className="max-w-3xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 flex flex-col sm:flex-row items-center gap-4 px-6 py-6 mb-4">
            {company ? (
              <img
                src={company.companyLogo || '/images/default-companylogo.png'}
                alt={company.name}
                className="w-20 h-20 rounded-xl object-cover border-2 border-orange-200 bg-white shadow"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-blue-50 border-2 border-orange-200 flex items-center justify-center text-orange-400 font-bold text-3xl shadow">
                ?
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="text-2xl font-bold text-blue-900 truncate flex items-center gap-2">
                    {company ? company.name : "Company"}
                  </div>
                  <div className="text-blue-600 text-sm mt-1 truncate">{company?.industry || "Unknown sector"}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {company?.companyAddress && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="#2563eb" strokeWidth="2" d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1116 0c0 4.97-3.582 9-8 9z"/><circle cx="12" cy="12" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
                        {company.companyAddress}
                      </span>
                    )}
                    {company?.contactEmail && (
                      <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-100">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="#fb923c" strokeWidth="2" d="M4 4h16v16H4z"/><path stroke="#fb923c" strokeWidth="2" d="M4 4l8 8 8-8"/></svg>
                        {company.contactEmail}
                      </span>
                    )}
                  </div>
                </div>
                <span className="px-5 py-2 bg-gradient-to-r from-blue-200 to-orange-200 text-gray-900 rounded-full font-bold text-lg shadow border border-orange-100 whitespace-nowrap">
                  {filteredOffers.length} Offre{filteredOffers.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Search bar with gray text and English placeholder */}
        <div className="max-w-2xl mx-auto w-full mb-8">
          <div className="bg-white rounded-2xl shadow border border-blue-100 flex items-center px-3 py-2">
            <span className="text-blue-400 bg-blue-50 rounded-full p-2 shadow-sm mr-2">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z' /></svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for an offer by title or location..."
              className="w-full pl-2 pr-3 py-2 rounded-2xl bg-transparent focus:outline-none text-base font-medium placeholder-gray-400 text-gray-700"
            />
          </div>
        </div>
        {/* Offers table modernized with blue and orange */}
        <div className="max-w-5xl mx-auto w-full">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-semibold py-8">{error}</div>
          ) : filteredOffers.length === 0 ? (
            <div className="text-center text-gray-400 text-lg py-12">No job offers found for your company.</div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-0 overflow-x-auto">
              <table className="w-full text-base text-left border-t border-blue-100">
                <thead className="bg-gradient-to-r from-blue-50 to-orange-50">
                  <tr>
                    <th className="px-3 py-4 font-bold text-blue-700 text-sm rounded-tl-2xl">Title</th>
                    <th className="px-3 py-4 font-bold text-orange-700 text-sm">Location</th>
                    <th className="px-3 py-4 font-bold text-blue-700 text-sm w-32">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map((offer) => (
                    <tr key={offer.id} className="border-t border-blue-100 hover:bg-blue-50 transition group text-base">
                      <td className="px-3 py-4 font-semibold text-gray-900 group-hover:text-blue-700 transition-all flex items-center gap-2 truncate">
                        <span className="truncate">{offer.title}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium text-sm shadow-sm border border-orange-200 truncate">{offer.location}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="inline-block bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-semibold text-sm border border-blue-200 truncate">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}
