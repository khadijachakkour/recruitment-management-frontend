"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecruteurLayout from '@/RecruteurLayout';

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const JitsiMeetPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: entretienId } = React.use(params);
  const [jitsiUrl, setJitsiUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJitsi = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/entretiens/entretiens/${entretienId}`);
        if (data && data.jitsiUrl) {
          // Si la réunion est terminée côté backend (statut = 'Termine'), afficher le message de fin
          if (data.statut === 'Termine' || data.statut === 'TERMINE') {
            setError('MEETING_ENDED');
            setJitsiUrl(null);
          } else {
            setJitsiUrl(data.jitsiUrl);
          }
        } else {
          setError("No Jitsi link found for this interview.");
        }
      } catch {
        setError("Error fetching Jitsi link.");
      } finally {
        setLoading(false);
      }
    };
    if (entretienId) fetchJitsi();
  }, [entretienId]);

  return (
    <RecruteurLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        {loading && (
          <div className="flex flex-col items-center justify-center my-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 border-solid mb-4"></div>
            <span className="text-blue-600 font-semibold">Loading video room...</span>
          </div>
        )}
        {error === 'MEETING_ENDED' && (
          <div className="flex flex-col items-center justify-center my-10">
            <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6" /></svg>
            <div className="text-green-700 text-lg font-bold mb-2">The meeting is over</div>
            <div className="text-gray-500 text-base text-center">This interview has been completed.<br/>Thank you for using our video platform.<br/>You can close this page or return to your dashboard.</div>
            <a href="/Recruteur/EntretienPlanifie" className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition">Back to interviews</a>
          </div>
        )}
        {error && error !== 'MEETING_ENDED' && (
          <div className="flex flex-col items-center justify-center my-10">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div className="text-gray-600 text-lg font-semibold mb-2">The meeting has ended</div>
            <div className="text-gray-400 text-base">Thank you for using our video interview platform.<br/>You can close this page or return to your dashboard.</div>
            <a href="/Recruteur/EntretienPlanifie" className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition">Back to interviews</a>
          </div>
        )}
        {jitsiUrl && !loading && !error && (
          <iframe
            src={jitsiUrl}
            allow="camera; microphone; fullscreen; display-capture"
            className="w-full max-w-5xl h-[85vh] rounded-xl shadow-lg border border-blue-200"
            title="Jitsi Meet"
          />
        )}
      </div>
    </RecruteurLayout>
  );
};

export default JitsiMeetPage;
