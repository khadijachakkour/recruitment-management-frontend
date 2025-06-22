"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { User, FileText, Mail } from "lucide-react";
import RecruteurLayout from "@/RecruteurLayout";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Offer {
  id: number;
  title: string;
  candidatureCount?: number;
}

export interface Application {
  id: number;
  candidate_id: string;
  date_soumission: string;
  status: 'en_attente' | 'acceptee' | 'refusee';
  cv_url?: string;
}

export interface CandidateInfo {
  name: string;
  email: string;
}

export default function AllApplicationsPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [expandedOfferId, setExpandedOfferId] = useState<number | null>(null);
  const [applicationsByOffer, setApplicationsByOffer] = useState<{ [key: number]: Application[] }>({});
  const [loading, setLoading] = useState(true);
  const [candidateInfo, setCandidateInfo] = useState<{ [key: string]: CandidateInfo }>({});
  const [selectedOffer, setSelectedOffer] = useState<{ value: number; label: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true); 
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/userId`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        if (data.userId) {
          // Récupérer les offres avec le nombre de candidatures pour chaque offre
          const offersRes = await axios.get<Offer[]>(`${API_BASE_URL}/api/offers/by-recruiter/${data.userId}`);
          const offers = offersRes.data;
          const offersWithCounts = await Promise.all(
            offers.map(async (offer: Offer) => {
              try {
                const countRes = await axios.get<{ candidatureCount: number }>(`${API_BASE_URL}/api/candidatures/count/by-offer/${offer.id}`);
                return { ...offer, candidatureCount: countRes.data.candidatureCount };
              } catch {
                return { ...offer, candidatureCount: 0 };
              }
            })
          );
          setOffers(offersWithCounts);
        }
      } catch {
        // Removed unused error assignment
        // setError("Failed to load offers.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleToggleOffer = async (offerId: number) => {
    if (expandedOfferId === offerId) {
      setExpandedOfferId(null);
      return;
    }
    setExpandedOfferId(offerId);
    if (!applicationsByOffer[offerId]) {
      try {
        // Récupérer toutes les candidatures pour l'offre
        const res = await axios.get<Application[]>(`${API_BASE_URL}/api/candidatures/by-offer/${offerId}`);
        setApplicationsByOffer((prev) => ({ ...prev, [offerId]: res.data }));
      } catch {
        setApplicationsByOffer((prev) => ({ ...prev, [offerId]: [] }));
      }
    }
  };

  const fetchCandidateInfo = async (candidateId: string) => {
    if (candidateInfo[candidateId]) return;
    try {
      const res = await axios.get<{ firstName?: string; first_name?: string; lastName?: string; last_name?: string; email?: string }>(`${API_BASE_URL}/api/users/userbyId/${candidateId}`);
      const user = res.data;
      const name = user.firstName || user.first_name || '';
      const lastName = user.lastName || user.last_name || '';
      const candidateEmail = user.email || '';
      setCandidateInfo((prev) => ({ ...prev, [candidateId]: { name: `${name} ${lastName}`.trim(), email: candidateEmail } }));
    } catch {
      setCandidateInfo((prev) => ({ ...prev, [candidateId]: { name: 'Unknown', email: 'N/A' } }));
    }
  };

  useEffect(() => {
    if (!selectedOffer || !applicationsByOffer[selectedOffer.value]) {
      setFilteredApplications([]);
      return;
    }
    let apps = applicationsByOffer[selectedOffer.value];
    if (statusFilter) {
      apps = apps.filter((app: Application) => app.status === statusFilter);
    }
    if (dateRange[0] && dateRange[1]) {
      apps = apps.filter((app: Application) => {
        const date = new Date(app.date_soumission);
        return date >= dateRange[0]! && date <= dateRange[1]!;
      });
    }
    setFilteredApplications(apps);
    setCurrentPage(1);
  }, [selectedOffer, statusFilter, dateRange, applicationsByOffer]);

  // Pagination
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredApplications.length / pageSize);

  // Statuts pour le filtre
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'acceptee', label: 'Accepté' },
    { value: 'refusee', label: 'Refusé' },
  ];

  return (
    <RecruteurLayout>
      <main className="w-full min-h-screen px-2 sm:px-8 lg:px-16 pt-28 pb-16 bg-white">
        {/* En-tête amélioré */}
        <div className="max-w-5xl mx-auto mb-10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <User className="w-10 h-10 text-blue-700" />
            <h1 className="text-4xl font-extrabold text-blue-900 text-center">Applications by Job Offer</h1>
          </div>
          <p className="text-center text-blue-700 text-lg font-medium">Consult and manage all applications by offer, filter and export easily.</p>
        </div>

        {!mounted ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-blue-500 text-lg font-semibold">Loading...</span>
          </div>
        ) : (
          <>
            {/* Panneau de filtres modernisé */}
            <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 mb-10 flex flex-col md:flex-row gap-6 md:items-end md:justify-between border border-blue-100">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-blue-800 font-semibold mb-2">Offer</label>
                <Select
                  options={offers.map((offer) => ({ value: offer.id, label: `${offer.title} (${offer.candidatureCount ?? 0})` }))}
                  value={selectedOffer}
                  onChange={(val) => {
                    setSelectedOffer(val);
                    if (val && !applicationsByOffer[val.value]) handleToggleOffer(val.value);
                  }}
                  placeholder="Select an offer..."
                  isSearchable
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({ ...base, borderColor: '#3b82f6', boxShadow: 'none' }),
                  }}
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="block text-blue-800 font-semibold mb-2">Status</label>
                <select
                  className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[220px]">
                <label className="block text-blue-800 font-semibold mb-2">Date range</label>
                <DatePicker
                  selectsRange
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={(update) => setDateRange(update as [Date | null, Date | null])}
                  isClearable
                  className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                  placeholderText="Select date range"
                />
              </div>
              <button
                className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
                onClick={() => {
                  setSelectedOffer(null);
                  setStatusFilter("");
                  setDateRange([null, null]);
                }}>
                Reset filters
              </button>
            </div>
            {/* Tableau des candidatures modernisé */}
            <div className="max-w-5xl mx-auto">
              {selectedOffer && (
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-blue-800 font-semibold text-lg">{filteredApplications.length} applications found</span>
                </div>
              )}
              {!selectedOffer ? (
                <div className="flex justify-center items-center h-40">
                  <span className="text-blue-500 text-lg font-semibold">Select an offer to view applications.</span>
                </div>
              ) : loading ? (
                <div className="flex justify-center items-center h-40">
                  <span className="text-blue-500 text-lg font-semibold">Loading applications...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {paginatedApplications.length === 0 ? (
                    <div className="flex justify-center items-center h-40">
                      <span className="text-blue-500 text-lg font-semibold">No applications found for this offer.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {paginatedApplications.map((app: Application) => {
                        if (app.candidate_id && !candidateInfo[app.candidate_id]) fetchCandidateInfo(app.candidate_id);
                        const info = app.candidate_id ? candidateInfo[app.candidate_id] : undefined;
                        return (
                          <div key={app.id} className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 flex flex-col gap-3 hover:shadow-2xl transition">
                            <div className="flex items-center gap-3 mb-2">
                              <User className="w-7 h-7 text-blue-500" />
                              <span className="font-bold text-blue-900 text-lg">{info ? info.name : 'Loading...'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-700 text-sm">
                              <Mail className="w-4 h-4" />
                              <span>{info ? info.email : 'Loading...'}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-blue-500">Submission:</span>
                              <span className="text-xs font-semibold">{app.date_soumission ? new Date(app.date_soumission).toLocaleDateString() : ''}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-blue-500">Status:</span>
                              <span className={`font-bold px-3 py-1 rounded-full text-xs ml-1 shadow ${
                                app.status === 'acceptee' ? 'bg-green-100 text-green-700 border border-green-200' :
                                app.status === 'refusee' ? 'bg-red-100 text-red-700 border border-red-200' :
                                'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              }`}>
                                {app.status === 'acceptee' ? 'Accepté' : app.status === 'refusee' ? 'Refusé' : 'En attente'}
                              </span>
                            </div>
                            <div className="flex gap-3 mt-3">
                              {app.cv_url && (
                                <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition">
                                  <FileText className="w-4 h-4" /> CV
                                </a>
                              )}
                              <a href={`mailto:${info?.email}`} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow hover:bg-blue-200 transition">
                                <Mail className="w-4 h-4" /> Contact
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Pagination modernisée */}
            {selectedOffer && filteredApplications.length > pageSize && (
              <div className="flex justify-center mt-10 gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 disabled:opacity-50 shadow"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 rounded-lg font-bold shadow ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 disabled:opacity-50 shadow"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </RecruteurLayout>
  );
}
