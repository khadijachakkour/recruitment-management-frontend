"use client";
import React, { useEffect, useState } from "react";
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

  const fetchCandidates = async () => {
    if (!offerId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:8082/api/candidatures/match-cvs/${offerId}`);
      console.log("Réponse API matching:", res.data);
      // Pour chaque candidat, enrichir avec infos utilisateur
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
        return {
          ...item,
          cv: cvUrl,
          firstName,
          lastName,
          email,
          status,
          submittedAt,
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
          const offersRes = await axios.get(`http://localhost:8081/api/offers/by-recruiter/${data.userId}`);
          setOffers(offersRes.data);
        }
      } catch (err) {
      }
    };
    fetchOffers();
  }, []);

  return (
    <RecruteurLayout>
      <div className="min-h-screen bg-white flex">
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-8 items-end">
              <div className="w-80">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select a job offer</label>
                <Select
                  instanceId="preselected-offer-select"
                  options={offers.map((offer) => ({ value: offer.id, label: offer.title, key: offer.id }))}
                  onChange={(val) => setOfferId(val ? String(val.value) : "")}
                  placeholder="Choisir une offre..."
                  isSearchable
                  classNamePrefix="react-select"
                  styles={{ control: (base) => ({ ...base, borderColor: '#3b82f6', boxShadow: 'none' }) }}
                />
              </div>
              <button
                onClick={fetchCandidates}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-semibold transition"
                disabled={loading || !offerId}
              >
                {loading ? "Loading..." : "Show applications"}
              </button>
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="grid gap-6">
              {candidates.length === 0 && !loading && (
                <div className="text-gray-500 text-center">No applications to display.</div>
              )}
              {candidates.map((c, idx) => {
                let cvUrl = c.cv;
                if (typeof cvUrl === 'string' && cvUrl.trim().startsWith('[')) {
                  try {
                    const arr = JSON.parse(cvUrl);
                    if (Array.isArray(arr) && arr.length > 0) {
                      cvUrl = arr[0];
                    }
                  } catch {}
                }
                return (
                  <div key={c.rank ?? idx} className="bg-white rounded-lg shadow p-6 flex items-center gap-6 hover:shadow-lg transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-gray-800">Candidate {c.rank}</span>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Score: {(c.score * 100).toFixed(2)}%</span>
                      </div>
                      <div className="mb-1 text-base text-gray-700 font-medium">
                        {'firstName' in c ? c.firstName || '-' : '-'} {'lastName' in c ? c.lastName || '' : ''}
                      </div>
                      <div className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Email:</span> {c.email || '-'}
                        {c.email && (
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(c.email)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 inline-block text-blue-500 hover:underline text-sm font-semibold"
                            title={`Send email to ${c.email} via Gmail`}>
                            <Mail className="inline w-5 h-5 align-text-bottom" />
                          </a>
                        )}
                      </div>
                      <div className="mb-1 text-sm text-gray-500 flex items-center gap-2">
                        <span className="font-semibold">Status:</span>
                        {c.status ? (
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                            {c.status}
                          </span>
                        ) : (
                          '-'
                        )}
                      </div>
                      <div className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Submitted:</span> {c.submittedAt ? new Date(c.submittedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                      </div>
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                      >
                        View CV
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </RecruteurLayout>
  );
};

export default PreselectedApplicationPage;
