"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import RecruteurLayout from '@/RecruteurLayout';
import { Mail } from 'lucide-react';

interface Candidate {
  rank: number;
  cv: string;
  score: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
  submittedAt?: string;
  candidate_id?: string;
  id?: string;
  hasInterview?: boolean;
}

interface Offer {
  id: number;
  title: string;
}

const PreselectedApplicationPage = () => {
  const [offerId, setOfferId] = useState<string>("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<{open: boolean, candidate?: Candidate} >({open: false});
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState("visio");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [recruteurId, setRecruteurId] = useState<string>("");
  const [confirmRefuse, setConfirmRefuse] = useState<{open: boolean, candidateId?: string} >({open: false});
  const [currentPage, setCurrentPage] = useState(1);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const [recruteurName, setRecruteurName] = useState<string>("");

  const fetchCandidates = async () => {
    if (!offerId) return;
    setLoading(true);
    setError(null);
    try {
      //Récupérer la liste des candidatures pré-sélectionnées pour une offre
      const res = await axios.get(`http://localhost:8082/api/candidatures/match-cvs/${offerId}`);
      
      const enriched = await Promise.all(res.data.map(async (item: any) => {
        let cvUrl = item.cv;
        if (typeof cvUrl === 'string' && cvUrl.trim().startsWith('[')) {
          try {
            const arr = JSON.parse(cvUrl);
            if (Array.isArray(arr) && arr.length > 0) {
              cvUrl = arr[0];
            }
          } catch {}
        }
        // Récupérer infos utilisateur par userId si présent
        let firstName = '', lastName = '', email = '', status = '', submittedAt = '';
        if (item.candidate_id) {
          try {
            const userRes = await axios.get(`http://localhost:4000/api/users/userbyId/${item.candidate_id}`);
            firstName = userRes.data.firstName || '';
            lastName = userRes.data.lastName || '';
            email = userRes.data.email || '';
            status = item.status || '';
            submittedAt = item.submittedAt || '';
          } catch {}
        }
        // Vérifier si un entretien existe déjà pour cette candidature
        let hasInterview = false;
        try {
          if (item.id || item.candidatureId) {
            const entretienRes = await axios.get(`http://localhost:3004/api/entretiens/candidature/${item.id || item.candidatureId}`);
            hasInterview = !!entretienRes.data && Object.keys(entretienRes.data).length > 0;
          }
        } catch {}
        return {
          ...item,
          id: item.id || item.candidatureId, 
          cv: cvUrl,
          firstName,
          lastName,
          email,
          status,
          submittedAt,
          hasInterview,
        };
      }));
    const sorted = enriched.sort((a, b) => b.score - a.score);
    setCandidates(sorted);
    } catch (err: any) {
      setError("Erreur lors du chargement des candidatures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/users/userId", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        if (data.userId) {
          setRecruteurId(data.userId);
          const userRes = await axios.get(`http://localhost:4000/api/users/userbyId/${data.userId}`);
        setRecruteurName(`${userRes.data.firstName || ""} ${userRes.data.lastName || ""}`.trim());
          const offersRes = await axios.get(`http://localhost:8081/api/offers/by-recruiter/${data.userId}`);
          setOffers(offersRes.data);
        }
      } catch (err) {
      }
    };
    fetchOffers();
  }, []);

  const handleOpenModal = (candidate: Candidate) => {
    setShowModal({open: true, candidate});
    setInterviewDate("");
    setInterviewTime("");
    setInterviewType("visio");
    setInterviewLocation("");
  };
  const handleCloseModal = () => setShowModal({open: false});
  const handleConfirm = async () => {
    if (!showModal.candidate || !recruteurId) return;
    try {
     const dateTime = `${interviewDate}T${interviewTime}:00`;
      let entretienPayload: any = {
        date: dateTime,
        type: interviewType === "visio" ? "Visio" : "Presentiel",
        recruteurId: recruteurId,
        recruteurName: recruteurName,
        candidatureId: showModal.candidate.id, 
        candidatId: showModal.candidate.candidate_id,
        statut: "PLANIFIE"
      };
      // Pour presentiel, lieu est requis et non vide
      if (interviewType === "presentiel") {
        entretienPayload = { ...entretienPayload, lieu: interviewLocation };
      }
      // Pour visio, ne pas inclure le champ lieu du tout
await axios.post(
  "http://localhost:3004/api/entretiens/CreateEntretien",
  entretienPayload,
  {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
    },
  }
);      // Mise à jour du statut de la candidature associée
      const candidatureId = showModal.candidate.id;
      if (candidatureId) {
        await axios.patch(`http://localhost:8082/api/candidatures/update/${candidatureId}`, { status: "selectionnee_entretien" });
      }
      setShowModal({open: false});
      fetchCandidates();
    } catch (err) {
      alert("Erreur lors de la planification de l'entretien.");
    }
  };

  return (
  <RecruteurLayout>
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full max-w-4xl mx-auto pt-12 pb-8 px-4">
        <div className="flex items-center gap-3 mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight drop-shadow-sm">Preselected Applications</h1>
        </div>
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-8 mb-10 flex flex-col md:flex-row md:items-end gap-8 border border-blue-200">
          <div className="w-full md:w-80">
            <label className="block text-base font-semibold text-blue-700 mb-2">Select a job offer</label>
           <Select
  instanceId="preselected-offer-select"
  options={offers.map((offer) => ({ value: offer.id, label: offer.title, key: offer.id }))}
  onChange={(val) => setOfferId(val ? String(val.value) : "")}
  placeholder="Choose an offer..."
  isSearchable
  classNamePrefix="react-select"
  styles={{
    control: (base) => ({ ...base, borderColor: '#2563eb', boxShadow: '0 0 0 2px #3b82f6', minHeight: 48 }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
  }}
  menuPortalTarget={typeof window !== "undefined" ? document.body : null}
/>
          </div>
          <button
            onClick={fetchCandidates}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-10 py-3 rounded-xl shadow-lg font-bold text-lg transition disabled:opacity-60 disabled:cursor-not-allowed border-2 border-blue-600"
            disabled={loading || !offerId}
          >
            {loading ? <span className="animate-pulse">Loading...</span> : "Show applications"}
          </button>
        </div>
        {error && <div className="text-red-600 mb-6 font-semibold text-center bg-red-50 border border-red-200 rounded-lg py-3">{error}</div>}
        <div className="grid gap-10">
          {candidates.length === 0 && !loading && (
            <div className="text-gray-400 text-center text-xl py-16">No applications to display.</div>
          )}
          {/* Pagination logic: show only 5 candidates per page */}
          {candidates.slice((currentPage - 1) * 5, currentPage * 5).map((c, idx) => {
            let cvUrl = c.cv;
            if (typeof cvUrl === 'string' && cvUrl.trim().startsWith('[')) {
              try {
                const arr = JSON.parse(cvUrl);
                if (Array.isArray(arr) && arr.length > 0) {
                  cvUrl = arr[0];
                }
              } catch {}
            }
            const isRefused = c.status === "refusee";
            const isSelectionneeEntretien = c.status === "selectionnee_entretien";
            return (
              <div key={c.rank ?? idx} className="bg-white/95 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-10 border border-blue-100 hover:shadow-2xl transition group relative overflow-hidden">
                <div className="flex-shrink-0 flex flex-col items-center gap-3 w-36">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center border-2 border-blue-400 shadow-md group-hover:shadow-lg transition-all duration-200">
                    <span className="text-3xl md:text-4xl font-extrabold text-blue-900 select-none">
                      {c.firstName?.[0] || '?'}{c.lastName?.[0] || ''}
                    </span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1 rounded-full mt-2 shadow">Score: {(c.score * 100).toFixed(2)}%</span>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-2">
                    <span className="text-2xl font-bold text-blue-900">{c.firstName || '-'} {c.lastName || ''}</span>
                    <span className="ml-0 md:ml-4 text-xs text-gray-400 bg-gray-100 rounded px-2 py-1 font-semibold">Candidate #{c.rank}</span>
                  </div>
                  {c.hasInterview && (
                    <div className="mb-2">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded shadow mr-2">Entretien planifié</span>
                    </div>
                  )}
                  <div className="mb-2 text-base text-gray-600 flex items-center gap-2">
                    <span className="font-semibold">Email:</span>
                    <span>{c.email || '-'}</span>
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow hover:bg-blue-200 transition ml-2 border border-blue-200"
                      >
                        <Mail className="w-4 h-4" /> Contact
                      </a>
                    )}
                  </div>
                  <div className="mb-2 text-base text-gray-600 flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    {c.status ? (
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded shadow ${isRefused ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {c.status}
                      </span>
                    ) : (
                      '-')
                    }
                  </div>
                  <div className="mb-2 text-base text-gray-600 flex items-center gap-2">
                    <span className="font-semibold">Submitted:</span>
                    <span>{c.submittedAt ? new Date(c.submittedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-600 hover:underline text-sm font-semibold border border-blue-200 rounded px-5 py-2 bg-blue-50 hover:bg-blue-100 transition shadow"
                    >
                      View CV
                    </a>
                    {/* Show retain/refuse buttons only if not already refused, not scheduled for interview, and not selectionnee_entretien */}
                    {!isRefused && !c.hasInterview && !isSelectionneeEntretien && (
                      <>
                        {c.status === "en_attente" && (
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold text-sm shadow transition border-2 border-green-700"
                            onClick={() => handleOpenModal(c)}
                          >
                            Retain for interview
                          </button>
                        )}
                        {/* Show Refuse button only if not interview scheduled (hasInterview) and not selectionnee_entretien */}
                        {!c.hasInterview && !isSelectionneeEntretien && (
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold text-sm shadow transition border-2 border-red-700"
                            onClick={() => setConfirmRefuse({open: true, candidateId: c.id})}
                          >
                            Refuse
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-b from-blue-200 to-blue-100 opacity-60 group-hover:opacity-100 transition" />
              </div>
            );
          })}
        </div>
        {/* Pagination controls */}
        {candidates.length > 5 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              className="px-4 py-2 rounded-l-lg border border-blue-300 bg-white text-blue-700 font-semibold hover:bg-blue-50 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: Math.ceil(candidates.length / 5) }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-2 border border-blue-200 font-semibold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 hover:bg-blue-50'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-4 py-2 rounded-r-lg border border-blue-300 bg-white text-blue-700 font-semibold hover:bg-blue-50 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(candidates.length / 5), p + 1))}
              disabled={currentPage === Math.ceil(candidates.length / 5)}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* Modal for interview scheduling */}
      {showModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg relative animate-fadeIn border-2 border-blue-200">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-2xl font-bold" onClick={handleCloseModal}>&times;</button>
            <h2 className="text-2xl font-extrabold mb-6 text-blue-900 text-center">Schedule Interview</h2>
            <form onSubmit={e => {e.preventDefault(); handleConfirm();}} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-1 text-blue-700">Date</label>
                <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} required className="w-full border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-blue-700">Time</label>
                <input type="time" value={interviewTime} onChange={e => setInterviewTime(e.target.value)} required className="w-full border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-blue-700">Type</label>
                <select value={interviewType} onChange={e => setInterviewType(e.target.value)} className="w-full border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="visio">Visio</option>
                  <option value="presentiel">In-person</option>
                </select>
              </div>
              {/* Afficher le champ location seulement si presentiel */}
              {interviewType === "presentiel" && (
                <div>
                  <label className="block text-sm font-semibold mb-1 text-blue-700">Location</label>
                  <input
                    type="text"
                    value={interviewLocation}
                    onChange={e => setInterviewLocation(e.target.value)}
                    ref={locationInputRef}
                    placeholder="Office address"
                    required
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-xl font-bold text-lg mt-2 shadow-lg border-2 border-blue-600 transition">Confirm</button>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      {confirmRefuse.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center border-2 border-red-200 animate-fadeIn">
            <svg className='mb-4 text-red-500' width='48' height='48' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z' /></svg>
            <h3 className='text-xl font-bold text-red-700 mb-2 text-center'>Refuse candidate?</h3>
            <p className='text-gray-600 text-center mb-6 text-sm'>Are you sure you want to refuse this candidate?</p>
            <div className='flex gap-4 w-full'>
              <button
                className='flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold transition'
                onClick={() => setConfirmRefuse({open: false})}
              >
                Cancel
              </button>
              <button
                className='flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition'
                onClick={async () => {
                  try {
                    await axios.patch(`http://localhost:8082/api/candidatures/update/${confirmRefuse.candidateId}`, { status: "refusee" });
                    setConfirmRefuse({open: false});
                    fetchCandidates();
                  } catch {
                    alert('Erreur lors du refus du candidat.');
                  }
                }}
              >
                Refuse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </RecruteurLayout>
);
};

export default PreselectedApplicationPage;
