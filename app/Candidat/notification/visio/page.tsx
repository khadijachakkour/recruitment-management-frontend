'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'; 
import axios from 'axios';
import NavbarCandidat from '@/app/components/NavbarCandidat';
import Notification from '@/app/components/Notification';

// Composant principal de la page
const VisioPage = () => {
  return (
    <>
      <NavbarCandidat />
      <Suspense
        fallback={
          <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 border-solid mb-4"></div>
            <span className="text-blue-600 font-semibold">Chargement de la salle vidéo...</span>
          </div>
        }
      >
        <VisioContent />
      </Suspense>
    </>
  );
};

// Composant contenant la logique avec useSearchParams
const VisioContent = () => {
  const searchParams = useSearchParams();
  const jitsiUrlParam = searchParams.get('jitsiUrl');
  const [entretienId, setEntretienId] = useState<string | null>(null);
  const [jitsiUrl, setJitsiUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntretienId = async () => {
      if (!jitsiUrlParam) return;
      try {
        const { data } = await axios.get(`http://localhost:3004/api/entretiens/by-jitsi-url`, {
          params: { url: jitsiUrlParam },
        });
        setEntretienId(data.id);
      } catch {
        setError('Entretien non trouvé pour ce lien Jitsi.');
        setLoading(false);
      }
    };
    fetchEntretienId();
  }, [jitsiUrlParam]);

  useEffect(() => {
    const fetchJitsi = async () => {
      if (!entretienId) return;
      setLoading(true);
      setError(null);
      setInfo(null);
      try {
        const { data } = await axios.get(`http://localhost:3004/api/entretiens/entretiens/${entretienId}`);
        if (data && data.jitsiUrl) {
          if (data.statut === 'Termine' || data.statut === 'TERMINE') {
            setError('MEETING_ENDED');
            setJitsiUrl(null);
          } else if (data.statut === 'Planifie' || data.statut === 'PLANIFIE') {
            setJitsiUrl(data.jitsiUrl);
            setInfo("L'entretien est en cours. Merci de respecter l'heure prévue.");
          } else if (data.statut === 'Annule' || data.statut === 'ANNULE') {
            setError('MEETING_CANCELED');
            setJitsiUrl(null);
          } else {
            setError("Statut d'entretien inconnu ou non supporté.");
          }
        } else {
          setError("Aucun lien Jitsi trouvé pour cet entretien.");
        }
      } catch {
        setError("Erreur lors de la récupération du lien Jitsi.");
      } finally {
        setLoading(false);
      }
    };
    if (entretienId) fetchJitsi();
  }, [entretienId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {loading && (
        <div className="flex flex-col items-center justify-center my-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 border-solid mb-4"></div>
          <span className="text-blue-600 font-semibold">Chargement de la salle vidéo...</span>
        </div>
      )}
      {info && <Notification message={info} />}
      {error === 'MEETING_ENDED' && (
        <div className="flex flex-col items-center justify-center my-10">
          <svg
            className="w-16 h-16 text-green-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6" />
          </svg>
          <div className="text-green-700 text-lg font-bold mb-2">La réunion est terminée</div>
          <div className="text-gray-500 text-base text-center">
            Cet entretien est terminé.
            <br />
            Merci d&apos;avoir utilisé notre plateforme vidéo.
            <br />
            Vous pouvez fermer cette page ou retourner à votre tableau de bord.
          </div>
          <a
            href="/Candidat/dashboard"
            className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
          >
            Retour au tableau de bord
          </a>
        </div>
      )}
      {error === 'MEETING_CANCELED' && (
        <div className="flex flex-col items-center justify-center my-10">
          <svg
            className="w-16 h-16 text-red-400 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6" />
          </svg>
          <div className="text-red-700 text-lg font-bold mb-2">L&apos;entretien a été annulé</div>
          <div className="text-gray-500 text-base text-center">
            Cet entretien a été annulé.
            <br />
            Vous pouvez fermer cette page ou retourner à votre tableau de bord.
          </div>
          <a
            href="/Candidat/dashboard"
            className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
          >
            Retour au tableau de bord
          </a>
        </div>
      )}
      {error && error !== 'MEETING_ENDED' && error !== 'MEETING_CANCELED' && (
        <div className="flex flex-col items-center justify-center my-10">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-gray-600 text-lg font-semibold mb-2">La réunion n&apos;est pas disponible</div>
          <div className="text-gray-400 text-base">
            Merci d&apos;utiliser notre plateforme d&apos;entretien vidéo.
            <br />
            Vous pouvez fermer cette page ou retourner à votre tableau de bord.
          </div>
          <a
            href="/Candidat/dashboard"
            className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
          >
            Retour au tableau de bord
          </a>
        </div>
      )}
      {jitsiUrl && !loading && !error && (
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture"
          className="w-full max-w-5xl h-[80vh] rounded-xl shadow-lg border border-blue-200"
          title="Jitsi Meet"
        />
      )}
    </div>
  );
};

export default VisioPage;