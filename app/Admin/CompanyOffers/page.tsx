"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Search, MapPin, Calendar, Briefcase, Building2, Mail, Globe, Users, TrendingUp } from "lucide-react";
import AdminHeader from "@/app/components/AdminHeader";
import SidebarAdmin from "@/app/components/SidebarAdmin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CompanyOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
    <>
      <SidebarAdmin isSidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`} style={{ minWidth: 0, zoom: 0.85 }}> 
        <AdminHeader sidebarOpen={sidebarOpen}/>
        
        {/* Modern gradient background */}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
          <main className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-12">
            
            {/* Hero Section - Company Profile */}
            <div className="max-w-5xl mx-auto mb-6"> {/* Reduced max width and margin-bottom */}
              <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"> {/* Reduced border radius and shadow */}
                {/* Gradient background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-orange-500/5"></div>
                
                <div className="relative p-8"> {/* Retour à padding 8 et suppression du zoom */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6"> {/* Retour au gap initial */}
                    {/* Company Logo */}
                    <div className="shrink-0">
                      {company ? (
                        <div className="relative">
                          <img
                            src={company.companyLogo || '/images/default-companylogo.png'}
                            alt={company.companyName}
                            className="w-24 h-24 rounded-2xl object-cover shadow-lg ring-4 ring-white/50"
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-orange-100 border-4 border-white shadow-lg flex items-center justify-center">
                          <Building2 className="w-10 h-10 text-blue-600" />
                        </div>
                      )}
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 truncate">
                            {company?.companyName || "Your Company"}
                          </h3>
                          <p className="text-lg text-gray-600 mb-4 flex items-center gap-2">
                            {company?.industry || "Industry"}
                          </p>
                          
                          {/* Company Details */}
                          <div className="flex flex-wrap gap-3">
                            {company?.companyAddress && (
                              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 shadow-sm">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium text-sm">{company.companyAddress}</span>
                              </div>
                            )}
                            {company?.contactEmail && (
                              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-xl border border-orange-100 shadow-sm">
                                <Mail className="w-4 h-4" />
                                <span className="font-medium text-sm">{company.contactEmail}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats Card */}
                        <div className="shrink-0">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-3 text-white shadow-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-6 h-6" />
                              <span className="font-semibold">Active Offers</span>
                            </div>
                            <div className="text-3xl font-bold flex justify-center items-center">{filteredOffers.length}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto mb-12"> {/* Increased max width */}
              <div className="relative group flex items-center bg-white/95 border-2 border-blue-100 focus-within:border-blue-500 rounded-2xl shadow-xl transition-all duration-200 overflow-hidden">
                <span className="pl-4 flex items-center">
                  <Search className="h-6 w-6 text-blue-400 group-focus-within:text-blue-600 transition-colors duration-200" /> 
                  </span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search job title or location..."
                  className="flex-1 px-4 py-3 text-base bg-transparent border-none outline-none placeholder-gray-400 focus:ring-0" /* Reduced py and font size */
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
                    <div className="absolute inset-0 animate-ping">
                      <Loader2 className="text-blue-300 w-12 h-12" />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">Loading offers...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading error</h3>
                  <p className="text-gray-600">{error}</p>
                </div>
              ) : filteredOffers.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">No offers found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {search ? "No offer matches your search criteria." : "Your company has not published any job offers yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Job Offers ({filteredOffers.length})
                    </h2>
                  </div>

                  {/* Offers Grid */}
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {filteredOffers.map((offer, index) => (
                      <div 
                        key={offer.id} 
                        className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:border-blue-300/50 transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            {/* Job Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-4">
                                {/* Job Icon */}
                                <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                  <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors truncate">
                                    {offer.title}
                                  </h3>
                                  
                                  <div className="flex flex-wrap gap-3 mb-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 shadow-sm">
                                      <MapPin className="w-4 h-4" />
                                      <span className="font-medium text-sm">{offer.location}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-xl border border-green-200 shadow-sm">
                                      <Calendar className="w-4 h-4" />
                                      <span className="font-medium text-sm">
                                        {new Date(offer.createdAt).toLocaleDateString('en-GB', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="shrink-0">
                              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span className="font-semibold text-sm">Active</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hover Effect Border */}
                        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}