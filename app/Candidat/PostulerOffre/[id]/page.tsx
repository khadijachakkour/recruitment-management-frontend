'use client';

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { FileText, Eye } from "lucide-react";
import NavbarCandidat from "@/app/components/NavbarCandidat";

export default function Postulation() {
  const router = useRouter();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null);
  const [coverLetterPreviewUrl, setCoverLetterPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offerId, setOfferId] = useState("");
  const [offerTitle, setOfferTitle] = useState<string>("");

  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    return () => {
      if (cvPreviewUrl) URL.revokeObjectURL(cvPreviewUrl);
      if (coverLetterPreviewUrl) URL.revokeObjectURL(coverLetterPreviewUrl);
    };
  }, [cvPreviewUrl, coverLetterPreviewUrl]);

  useEffect(() => {
    if (id) {
      setOfferId(id);
      fetch(`${API_BASE_URL}/api/offers/offerById/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.title) setOfferTitle(data.title);
        })
        .catch(() => setOfferTitle(""));
    }
  }, [id]);

  const validateFile = (file: File | null, field: string): boolean => {
    if (!file) return true; 
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; 
    if (!allowedTypes.includes(file.type)) {
      toast.error(`${field} must be a PDF, DOC, or DOCX file.`);
      return false;
    }
    if (file.size > maxSize) {
      toast.error(`${field} must be less than 5MB.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate files
    if (!cvFile) {
      toast.error("Please upload a resume.");
      setIsLoading(false);
      return;
    }
    if (!validateFile(cvFile, "Resume") || (coverLetterFile && !validateFile(coverLetterFile, "Cover Letter"))) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("offer_id", offerId);
    if (cvFile) formData.append("cv", cvFile);
    if (coverLetterFile) formData.append("cover_letter", coverLetterFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/candidatures/postuler`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Application submitted successfully!");
        router.push("/Candidat/dashboard");
      } else if (response.status === 409) {
        toast.error("You have already applied for this job.");
      } else {
        toast.error(result.message || "An error occurred while submitting the application.");
      }
    } catch {
      toast.error("An error occurred while submitting the application.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <NavbarCandidat />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 pt-16">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-2xl" />
          </div>
          <div className="flex flex-col items-center mb-6 relative z-10 mb-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 text-center tracking-tight">Apply for this Job</h2>
            <p className="mt-1 text-sm text-gray-600 text-center max-w-md">
              Complete your application for this professional opportunity.
            </p>
            <div className="mt-3 w-full flex justify-center">
              <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-1.5 rounded-full font-semibold shadow-md text-sm">
                {offerTitle || "(Job Title)"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10" aria-busy={isLoading}>
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20">
                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
            )}
            <section>
              <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2" htmlFor="cv-input">
                <FileText className="w-4 h-4 text-blue-500" /> Resume <span className="text-xs text-gray-400 font-normal">(PDF, DOC, DOCX)</span>
              </label>
              <div className="mt-1">
                <input
                  id="cv-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      setCvFile(file);
                      setCvPreviewUrl(file ? URL.createObjectURL(file) : null);
                    }
                  }}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-blue-400 file:text-white hover:file:from-blue-700 hover:file:to-blue-500 transition focus:ring-2 focus:ring-blue-400 focus:outline-none border border-gray-200 rounded-lg shadow-sm"
                  aria-label="Upload your resume in PDF, DOC, or DOCX format"
                />
              </div>
              {cvFile && (
                <p className="mt-1 text-sm text-gray-600">Selected: {cvFile.name}</p>
              )}
              {cvPreviewUrl && (
                <div className="mt-3 transition-transform hover:scale-102">
                  <iframe
                    src={cvPreviewUrl}
                    className="w-full h-40 border border-blue-200 rounded-lg shadow-md bg-white"
                    title="Resume Preview"
                  />
                  <a
                    href={cvPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Eye className="w-4 h-4" /> View Full
                  </a>
                </div>
              )}
            </section>

            <div className="flex items-center justify-center gap-2 my-4">
              <div className="flex-1 border-t border-dashed border-blue-100" />
              <span className="text-xs text-gray-500 font-medium bg-blue-50 px-2 py-1 rounded-full">Optional Section</span>
              <div className="flex-1 border-t border-dashed border-blue-100" />
            </div>

            <section>
              <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2" htmlFor="cover-letter-input">
                <FileText className="w-4 h-4 text-blue-500" /> Cover Letter <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="mt-1">
                <input
                  id="cover-letter-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      setCoverLetterFile(file);
                      setCoverLetterPreviewUrl(file ? URL.createObjectURL(file) : null);
                    }
                  }}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-blue-400 file:text-white hover:file:from-blue-700 hover:file:to-blue-500 transition focus:ring-2 focus:ring-blue-400 focus:outline-none border border-gray-200 rounded-lg shadow-sm"
                  aria-label="Upload your cover letter in PDF, DOC, or DOCX format (optional)"
                />
              </div>
              {coverLetterFile && (
                <p className="mt-1 text-sm text-gray-600">Selected: {coverLetterFile.name}</p>
              )}
              {coverLetterPreviewUrl && (
                <div className="mt-3 transition-transform hover:scale-102">
                  <iframe
                    src={coverLetterPreviewUrl}
                    className="w-full h-40 border border-blue-200 rounded-lg shadow-md bg-white"
                    title="Cover Letter Preview"
                  />
                  <a
                    href={coverLetterPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Eye className="w-4 h-4" /> View Full
                  </a>
                </div>
              )}
            </section>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2.5 px-8 rounded-lg font-bold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-label="Loading">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <span>Submit</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/Candidat/dashboard")}
                className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 py-2.5 px-8 rounded-lg font-bold shadow-md hover:bg-gray-100 transition-all duration-200 text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}