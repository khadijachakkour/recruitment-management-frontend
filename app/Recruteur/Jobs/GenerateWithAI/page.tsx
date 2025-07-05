"use client";
import { useState } from "react";
import {
  Sparkles,
  Briefcase,
  MapPin,
  Users,
  Clock,
  Award,
  Zap,
  Copy,
  Download,
} from "lucide-react";
import RecruteurLayout from "@/RecruteurLayout";

export default function GenerateWithAIPage() {
  const [form, setForm] = useState({
    titre: "",
    secteur: "",
    lieu: "",
    contrat: "",
    competences: "",
    experience: "",
  });

  const [autreExperience, setAutreExperience] = useState("");
  const [autreContrat, setAutreContrat] = useState("");
  const [autreSecteur, setAutreSecteur] = useState("");

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const isOther = (key: string) =>
    form[key as keyof typeof form] === "Other";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDescription(null);

    const finalForm = {
      ...form,
      experience: isOther("experience") ? autreExperience : form.experience,
      contrat: isOther("contrat") ? autreContrat : form.contrat,
      secteur: isOther("secteur") ? autreSecteur : form.secteur,
    };

    try {
      const res = await fetch("http://localhost:9001/api/GenerateDescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalForm),
      });
      if (!res.ok) throw new Error("Error while generating the description");
      const data = await res.json();
      setDescription(data.description);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (description) {
      await navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <RecruteurLayout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Title */}
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      name="titre"
                      placeholder="Job Title"
                      value={form.titre}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white hover:bg-white"
                    />
                  </div>

                  {/* Sector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sector
                    </label>
                    <select
                      name="secteur"
                      value={form.secteur}
                      onChange={handleSelectChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white hover:bg-white"
                    >
                      <option value="">-- Select --</option>
                      <option value="Technologie">Technology</option>
                      <option value="santé">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Other">Other</option>
                    </select>
                    {isOther("secteur") && (
                      <input
                        type="text"
                        placeholder="Specify sector"
                        value={autreSecteur}
                        onChange={(e) => setAutreSecteur(e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg"
                      />
                    )}
                  </div>

                  {/* Location */}
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      name="lieu"
                      placeholder="Location"
                      value={form.lieu}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white hover:bg-white"
                    />
                  </div>

                  {/* Contract Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contract Type
                    </label>
                    <select
                      name="contrat"
                      value={form.contrat}
                      onChange={handleSelectChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white hover:bg-white"
                    >
                      <option value="">-- Select --</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Other">Other</option>
                    </select>
                    {isOther("contrat") && (
                      <input
                        type="text"
                        placeholder="Specify contract type"
                        value={autreContrat}
                        onChange={(e) => setAutreContrat(e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg"
                      />
                    )}
                  </div>

                  {/* Skills */}
                  <div className="relative group md:col-span-2">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <Award className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      name="competences"
                      placeholder="Required Skills"
                      value={form.competences}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white hover:bg-white"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Required
                    </label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleSelectChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white hover:bg-white"
                    >
                      <option value="">-- Select --</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Other">Other</option>
                    </select>
                    {isOther("experience") && (
                      <input
                        type="text"
                        placeholder="Specify experience level"
                        value={autreExperience}
                        onChange={(e) => setAutreExperience(e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg"
                      />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate Description
                    </div>
                  )}
                </button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center animate-pulse">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Result */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              {!description && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Ready to create your job post?
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form and let AI generate a professional job description for you.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse mb-4"></div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Generating...
                    </h3>
                    <p className="text-gray-600">
                      The AI is analyzing your criteria and drafting your job description.
                    </p>
                  </div>
                </div>
              )}

              {description && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      Generated Description
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                      {description}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </RecruteurLayout>
  );
}
