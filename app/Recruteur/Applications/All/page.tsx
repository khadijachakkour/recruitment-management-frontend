"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, User, FileText, Mail } from "lucide-react";
import RecruteurLayout from "@/RecruteurLayout";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AllApplicationsPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [expandedOfferId, setExpandedOfferId] = useState<number | null>(null);
  const [applicationsByOffer, setApplicationsByOffer] = useState<{ [key: number]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candidateInfo, setCandidateInfo] = useState<{ [key: string]: { name: string; email: string } }>({});
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:4000/api/users/userId", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        if (data.userId) {
          // Récupérer les offres avec le nombre de candidatures pour chaque offre
          const offersRes = await axios.get(`http://localhost:8081/api/offers/by-recruiter/${data.userId}`);
          const offers = offersRes.data;
          const offersWithCounts = await Promise.all(
            offers.map(async (offer: any) => {
              try {
                const countRes = await axios.get(`http://localhost:8082/api/candidatures/count/by-offer/${offer.id}`);
                return { ...offer, candidatureCount: countRes.data.candidatureCount };
              } catch {
                return { ...offer, candidatureCount: 0 };
              }
            })
          );
          setOffers(offersWithCounts);
        }
      } catch (err) {
        setError("Failed to load offers.");
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
        const res = await axios.get(`http://localhost:8082/api/candidatures/by-offer/${offerId}`);
        setApplicationsByOffer((prev) => ({ ...prev, [offerId]: res.data }));
      } catch {
        setApplicationsByOffer((prev) => ({ ...prev, [offerId]: [] }));
      }
    }
  };

  const fetchCandidateInfo = async (candidateId: string) => {
    if (candidateInfo[candidateId]) return;
    try {
      const res = await axios.get(`http://localhost:4000/api/users/userbyId/${candidateId}`);
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
      apps = apps.filter((app: any) => app.status === statusFilter);
    }
    if (dateRange[0] && dateRange[1]) {
      apps = apps.filter((app: any) => {
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

  // Options pour le select des offres
  const offerOptions = offers.map((offer) => ({ value: offer.id, label: offer.title }));

  // Statuts pour le filtre
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'acceptee', label: 'Accepté' },
    { value: 'refusee', label: 'Refusé' },
  ];

  return (
    <RecruteurLayout>
      <main className="w-full min-h-screen px-2 sm:px-8 lg:px-16 pt-28 pb-16">
        {/* En-tête */}
        <div className="max-w-5xl mx-auto mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2 text-center">Applications by Job Offer</h1>
          <p className="text-center text-blue-700 text-lg">Consult and manage all applications by offer, filter and export easily.</p>
        </div>

        {/* Panneau de filtres */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-blue-800 font-semibold mb-1">Offer</label>
            <Select
              options={offerOptions}
              value={selectedOffer}
              onChange={(val) => {
                setSelectedOffer(val);
                if (val && !applicationsByOffer[val.value]) handleToggleOffer(val.value);
              }}
              placeholder="Select an offer..."
              isSearchable
              classNamePrefix="react-select"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-blue-800 font-semibold mb-1">Status</label>
            <select
              className="w-full rounded border border-blue-200 px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block text-blue-800 font-semibold mb-1">Date range</label>
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => setDateRange(update as [Date | null, Date | null])}
              isClearable
              className="w-full rounded border border-blue-200 px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholderText="Select date range"
            />
          </div>
        </div>

        {/* Tableau des candidatures */}
        <div className="max-w-5xl mx-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedApplications.map((app: any) => {
                    if (app.candidate_id && !candidateInfo[app.candidate_id]) fetchCandidateInfo(app.candidate_id);
                    const info = app.candidate_id ? candidateInfo[app.candidate_id] : undefined;
                    return (
                      <div key={app.id} className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-6 h-6 text-blue-500" />
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
                          <span className={`font-bold px-3 py-1 rounded-full text-xs ml-1 ${
                            app.status === 'acceptee' ? 'bg-green-100 text-green-700' :
                            app.status === 'refusee' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {selectedOffer && filteredApplications.length > pageSize && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded font-bold ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </RecruteurLayout>
  );
}
