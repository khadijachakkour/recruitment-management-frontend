"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/authContext";
import Link from "next/link";
import { LogOut, Menu, X, Home, Search, FileText, Briefcase, User, MessageSquare } from "lucide-react";


export default function Postulation() {
  const { isLoggedIn, logoutCandidat } = useAuth();
  const router = useRouter();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null);
  const [coverLetterPreviewUrl, setCoverLetterPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offerId, setOfferId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  
  useEffect(() => {
    if (id) {
      setOfferId(id);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
   
    const formData = new FormData();
    formData.append("offer_id", offerId);
    if (cvFile) formData.append("cv", cvFile);
    if (coverLetterFile) formData.append("cover_letter", coverLetterFile);

    try {
      const response = await fetch("http://localhost:8082/api/candidatures/postuler", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        console.log("TOAST SHOULD DISPLAY");
        toast.success("Candidature envoyée avec succès !");
        router.push("/Candidat/dashboard");
      } else if (response.status === 409) {
        toast.error("Vous avez déjà postulé à cette offre.");
      } else {
        toast.error(result.message || "Une erreur est survenue lors de la postulation.");
      }

    } catch (error) {
      toast.error("An error occurred while submitting the application.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <div className="flex min-h-screen bg-white-100">
        {/* SIDEBAR */}
        <aside
          className={`fixed top-0 left-0 h-full bg-white border-r shadow-lg transition-all duration-300 ease-in-out z-40 ${
            isSidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              {isSidebarOpen && <h2 className="text-2xl font-bold text-blue-600">Candidate</h2>}
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
          <nav className="mt-4 px-2 space-y-1 text-sm font-medium">
            <SidebarLink href="/Candidat/dashboard" icon={<Home size={18} />} text="Dashboard" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/Candidat/Listoffres" icon={<Search size={18} />} text="Jobs" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/applications" icon={<FileText size={18} />} text="Apply" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/evaluations" icon={<Briefcase size={18} />} text="Evaluation" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/candidature-status" icon={<User size={18} />} text="Tracking" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/companies" icon={<Search size={18} />} text="Companies" isSidebarOpen={isSidebarOpen} />
            <SidebarLink href="/messages" icon={<MessageSquare size={18} />} text="Messaging" isSidebarOpen={isSidebarOpen} />
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={logoutCandidat}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors w-full"
            >
              <LogOut size={18} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Apply for Job</h2>
            <form onSubmit={handleSubmit} className="space-y-10">
              <section>
                <h3 className="text-xl font-semibold mb-4">Curriculum Vitae (CV)</h3>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCvFile(file);
                    setCvPreviewUrl(file ? URL.createObjectURL(file) : null);
                  }}
                  className="w-full border p-2 rounded-lg"
                />
                {cvPreviewUrl && (
                  <iframe src={cvPreviewUrl} className="mt-4 w-full h-96 border rounded-lg" />
                )}
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">Cover Letter (Optional)</h3>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCoverLetterFile(file);
                    setCoverLetterPreviewUrl(file ? URL.createObjectURL(file) : null);
                  }}
                  className="w-full border p-2 rounded-lg"
                />
                {coverLetterPreviewUrl && (
                  <iframe src={coverLetterPreviewUrl} className="mt-4 w-full h-96 border rounded-lg" />
                )}
              </section>

              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    "Submit Application"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/Candidat/dashboard")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

function SidebarLink({
    href,
    icon,
    text,
    isSidebarOpen,
  }: {
    href: string;
    icon: React.ReactNode;
    text: string;
    isSidebarOpen: boolean;
  }) {
    return (
      <Link href={href}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors">
          {icon}
          {isSidebarOpen && <span>{text}</span>}
        </div>
      </Link>
    );
  }