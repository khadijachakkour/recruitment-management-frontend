"use client";

import { useState } from "react";
import Sidebar from "@/app/components/SidebarRecruteur";
import { Sparkles, Briefcase, MapPin, Award, Copy, Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const isOther = (key: string) => form[key as keyof typeof form] === "Other";

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
    <div className="flex min-h-screen bg-white">
      <Sidebar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />

      <main className={`transition-all flex-1 px-6 py-10 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="max-w-5xl mx-auto space-y-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-800 flex items-center gap-2"
          >
            <Sparkles className="text-blue-600 w-6 h-6" />
            AI-Powered Job Offer Generator
          </motion.h1>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    name="titre"
                    placeholder="Job Title"
                    value={form.titre}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <select
                    name="secteur"
                    value={form.secteur}
                    onChange={handleSelectChange}
                    required
                    className="w-full p-3 border rounded-xl bg-gray-100"
                  >
                    <option value="">-- Sector --</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                  {isOther("secteur") && (
                    <input
                      type="text"
                      placeholder="Specify sector"
                      value={autreSecteur}
                      onChange={(e) => setAutreSecteur(e.target.value)}
                      className="mt-2 w-full p-3 border rounded-xl bg-gray-100"
                    />
                  )}
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    name="lieu"
                    placeholder="Location"
                    value={form.lieu}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-100"
                  />
                </div>

                <div>
                  <select
                    name="contrat"
                    value={form.contrat}
                    onChange={handleSelectChange}
                    required
                    className="w-full p-3 border rounded-xl bg-gray-100"
                  >
                    <option value="">-- Contract Type --</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Other">Other</option>
                  </select>
                  {isOther("contrat") && (
                    <input
                      type="text"
                      placeholder="Specify contract"
                      value={autreContrat}
                      onChange={(e) => setAutreContrat(e.target.value)}
                      className="mt-2 w-full p-3 border rounded-xl bg-gray-100"
                    />
                  )}
                </div>

                <div className="md:col-span-2 relative">
                  <Award className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    name="competences"
                    placeholder="Required Skills"
                    value={form.competences}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-100"
                  />
                </div>

                <div>
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={handleSelectChange}
                    required
                    className="w-full p-3 border rounded-xl bg-gray-100"
                  >
                    <option value="">-- Experience Level --</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Other">Other</option>
                  </select>
                  {isOther("experience") && (
                    <input
                      type="text"
                      placeholder="Specify experience"
                      value={autreExperience}
                      onChange={(e) => setAutreExperience(e.target.value)}
                      className="mt-2 w-full p-3 border rounded-xl bg-gray-100"
                    />
                  )}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Generating..." : "Generate Description"}
              </motion.button>
            </form>
          </div>

          {/* Result */}
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
                  <Sparkles className="w-5 h-5" />
                  Generated Description
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center gap-2 text-sm"
                    onClick={() => {
                      const blob = new Blob([description], { type: "text/plain;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "job-description.txt";
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-gray-800 text-sm">{description}</pre>
              <div className="flex justify-end">
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={() => {
      setIsPublished(true);
      setTimeout(() => setIsPublished(false), 3000);
    }}
    className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow transition"
  >
    Publish Offer
  </motion.button>
</div>
{isPublished && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="mt-4 px-4 py-3 text-sm text-green-800 bg-green-100 border border-green-300 rounded-xl text-center"
  >
    The job offer has been successfully published!
  </motion.div>
)}

            </motion.div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-xl text-center">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
