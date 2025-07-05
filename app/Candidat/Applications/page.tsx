"use client";

import { useEffect, useState } from "react";
import NavbarCandidat from "@/app/components/NavbarCandidat";
import { 
  Briefcase, 
  Building2, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  Eye,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  Zap
} from "lucide-react";

interface Candidature {
  id: number;
  offer_id: number;
  candidate_id: string;
  cvUrl: string;
  coverLetterUrl?: string | null;
  status?: "en_attente" | "selectionnee_entretien" | "acceptee" | "refusee";
  date_soumission?: string;
}

export default function ApplicationsPage() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [filteredCandidatures, setFilteredCandidatures] = useState<Candidature[]>([]);
  const [offerTitles, setOfferTitles] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCandidatures = async () => {
      setLoading(true);
      setError("");
      try {
        const token = sessionStorage.getItem("access_token");
        const res = await fetch(`${API_BASE_URL}/api/candidatures/by-candidate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load applications");
        const data = await res.json();
        setCandidatures(data);
        setFilteredCandidatures(data);
        
        // Fetch offer titles in parallel
        const offerIds = Array.from(new Set(data.map((c: Candidature) => c.offer_id)));
        const offers = await Promise.all(
          offerIds.map(async (id) => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/offers/offerById/${id}`);
              if (!res.ok) return [id, "Unknown title"];
              const offer = await res.json();
              return [id, offer.title || "Unknown title"];
            } catch {
              return [id, "Unknown title"];
            }
          })
        );
        setOfferTitles(Object.fromEntries(offers));
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidatures();
  }, []);

  // Filter applications based on search and status
  useEffect(() => {
    let filtered = candidatures;
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        offerTitles[c.offer_id]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    setFilteredCandidatures(filtered);
  }, [searchTerm, statusFilter, candidatures, offerTitles]);

  // Helper functions
  function getStatusLabel(status?: string) {
    switch (status) {
      case "en_attente": return "Pending Review";
      case "selectionnee_entretien": return "Interview Scheduled";
      case "acceptee": return "Accepted";
      case "refusee": return "Not Selected";
      default: return "Status Unknown";
    }
  }

  function getStatusColor(status?: string) {
    switch (status) {
      case "acceptee": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "en_attente": return "text-amber-700 bg-amber-50 border-amber-200";
      case "selectionnee_entretien": return "text-blue-700 bg-blue-50 border-blue-200";
      case "refusee": return "text-rose-700 bg-rose-50 border-rose-200";
      default: return "text-slate-700 bg-slate-50 border-slate-200";
    }
  }

  function getStatusIcon(status?: string) {
    switch (status) {
      case "acceptee": return <CheckCircle2 className="text-emerald-500" size={16} />;
      case "en_attente": return <Clock className="text-amber-500" size={16} />;
      case "selectionnee_entretien": return <Zap className="text-blue-500" size={16} />;
      case "refusee": return <XCircle className="text-rose-500" size={16} />;
      default: return <Clock className="text-slate-400" size={16} />;
    }
  }

  const getStatusStats = () => {
    const stats = candidatures.reduce((acc, c) => {
      acc[c.status || "unknown"] = (acc[c.status || "unknown"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" style={{ zoom: 0.9 }}>
      <NavbarCandidat />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
            <div className="flex items-center gap-5">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight drop-shadow-sm">My Applications</h2>
                <p className="text-slate-600 text-lg font-medium">Track your job applications and their status</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-4xl font-extrabold text-blue-600 leading-tight drop-shadow">{candidatures.length}</div>
              <div className="text-base text-slate-500 font-semibold">Total Applications</div>
            </div>
          </div>

          {/* Quick Stats */}
          {candidatures.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-white rounded-2xl p-4 border border-amber-100 shadow flex flex-col items-center">
                <Clock className="text-amber-500 mb-1" size={24} />
                <div className="text-xl font-bold text-slate-900">{stats.en_attente || 0}</div>
                <div className="text-xs text-slate-500 font-medium">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-2xl p-4 border border-blue-100 shadow flex flex-col items-center">
                <Zap className="text-blue-500 mb-1" size={24} />
                <div className="text-xl font-bold text-slate-900">{stats.selectionnee_entretien || 0}</div>
                <div className="text-xs text-slate-500 font-medium">Interviews</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-100 via-emerald-50 to-white rounded-2xl p-4 border border-emerald-100 shadow flex flex-col items-center">
                <CheckCircle2 className="text-emerald-500 mb-1" size={24} />
                <div className="text-xl font-bold text-slate-900">{stats.acceptee || 0}</div>
                <div className="text-xs text-slate-500 font-medium">Accepted</div>
              </div>
              <div className="bg-gradient-to-br from-rose-100 via-rose-50 to-white rounded-2xl p-4 border border-rose-100 shadow flex flex-col items-center">
                <XCircle className="text-rose-500 mb-1" size={24} />
                <div className="text-xl font-bold text-slate-900">{stats.refusee || 0}</div>
                <div className="text-xs text-slate-500 font-medium">Not Selected</div>
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          {candidatures.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={22} />
                <input
                  type="text"
                  placeholder="Search by job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/80 border border-blue-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-base shadow-md placeholder:text-blue-300"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={22} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-11 pr-8 py-3 bg-white/80 border border-blue-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 appearance-none min-w-[180px] text-base shadow-md text-blue-700"
                >
                  <option value="all">All Status</option>
                  <option value="en_attente">Pending</option>
                  <option value="selectionnee_entretien">Interview</option>
                  <option value="acceptee">Accepted</option>
                  <option value="refusee">Not Selected</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-8"></div>
            <p className="text-blue-600 font-semibold text-xl">Loading your applications...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="bg-red-50 border border-red-200 rounded-3xl p-10 max-w-md shadow-lg">
              <XCircle className="w-12 h-12 text-red-500 mb-5 mx-auto" />
              <p className="text-red-700 font-semibold text-center text-lg">{error}</p>
            </div>
          </div>
        ) : candidatures.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="bg-gradient-to-br from-blue-50 via-white to-slate-100 border border-blue-100 rounded-3xl p-12 max-w-md text-center shadow-xl">
              <Building2 className="w-24 h-24 text-blue-200 mb-6 mx-auto animate-fade-in" />
              <h3 className="text-2xl font-bold text-slate-700 mb-4">No applications yet</h3>
              <p className="text-slate-500 mb-8 text-lg">Start applying to jobs and track your progress here.</p>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold transition-colors duration-200 text-lg shadow-lg">
                Browse Jobs
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCandidatures.map((c) => (
              <div
                key={c.id}
                className="bg-white/90 rounded-3xl border border-blue-100 hover:border-blue-400 transition-all duration-200 overflow-hidden group shadow-xl hover:shadow-2xl relative backdrop-blur-xl animate-fade-in"
              >
                <div className="p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <Building2 className="text-blue-400" size={26} />
                      <h3 className="text-2xl font-bold text-slate-900">
                        {offerTitles[c.offer_id] || "Loading..."}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-lg text-slate-500 mb-2">
                      <CalendarDays size={20} />
                      <span>Applied on {c.date_soumission ? new Date(c.date_soumission).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : "Unknown date"}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 mt-3">
                      <div className="flex items-center gap-2">
                        <FileText className="text-blue-400" size={20} />
                        <a
                          href={c.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-lg font-semibold flex items-center gap-1 transition-colors duration-200"
                        >
                          <Eye size={16} />
                          View CV
                        </a>
                      </div>
                      {c.coverLetterUrl && typeof c.coverLetterUrl === 'string' && (
                        <div className="flex items-center gap-2">
                          <FileText className="text-indigo-400" size={20} />
                          <a
                            href={c.coverLetterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 text-lg font-semibold flex items-center gap-1 transition-colors duration-200"
                          >
                            <Eye size={16} />
                            Cover Letter
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`px-6 py-3 rounded-full border-2 text-lg font-bold ${getStatusColor(c.status)} flex items-center gap-3 min-w-[200px] justify-center md:justify-end transition-all duration-200 shadow-md`}> 
                    {getStatusIcon(c.status)}
                    {getStatusLabel(c.status)}
                  </div>
                </div>
                <button className="absolute top-5 right-5 text-blue-400 hover:text-blue-600 transition-colors duration-200 opacity-0 group-hover:opacity-100 bg-white rounded-full p-3 shadow-lg">
                  <ArrowUpRight size={26} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No results message for filtered search */}
        {candidatures.length > 0 && filteredCandidatures.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gradient-to-br from-blue-50 via-white to-slate-100 border border-blue-100 rounded-3xl p-10 max-w-md text-center shadow-xl">
              <Search className="w-14 h-14 text-blue-200 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-slate-700 mb-3">No matching applications</h3>
              <p className="text-slate-500 mb-6 text-base">Try adjusting your search or filter criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}