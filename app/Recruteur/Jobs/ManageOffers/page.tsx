"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Eye } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import RecruteurLayout from "@/RecruteurLayout";
import { useRouter } from "next/navigation";
import { Search, MapPin, X } from "lucide-react";


type Offer = {
  id: string;
  title: string;
  location: string;
  createdAt: string;
};

export default function ManageOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/users/userId", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        const userId = data.userId;
        if (userId) {
          const res = await axios.get(`http://localhost:8081/api/offers/by-recruiter/${userId}`);
          setOffers(res.data);
          setFilteredOffers(res.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des offres :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    let result = offers;

    if (searchTerm) {
      result = result.filter((offer) =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      result = result.filter((offer) =>
        offer.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredOffers(result);
  }, [searchTerm, locationFilter, offers]);

  const confirmDelete = (id: string) => {
    setOfferToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!offerToDelete) return;
    try {
      await axios.delete(`http://localhost:8081/api/offers/delete/${offerToDelete}`);
      const updatedOffers = offers.filter((offer) => offer.id !== offerToDelete);
      setOffers(updatedOffers);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    } finally {
      setShowConfirmModal(false);
      setOfferToDelete(null);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading offers...</div>;

  return (
    <RecruteurLayout>
      <main className="p-6 pt-24">

<div className="mb-10">
  <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-gray-200 shadow-sm rounded-2xl p-4 transition-all dark:bg-gray-900 dark:border-gray-700">

    <div className="relative w-full md:w-1/2">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Search by job title"
        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <div className="relative w-full md:w-1/2">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Filter by location"
        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
      />
    </div>

    {/* Bouton Reset */}
    {(searchTerm || locationFilter) && (
      <button
        onClick={() => {
          setSearchTerm("");
          setLocationFilter("");
        }}
        className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all dark:bg-red-900 dark:text-red-300">
        <X size={16} />
        Reset
      </button>
    )}
  </div>
</div>


        {filteredOffers.length === 0 ? (
          <p className="text-gray-500">No offers found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{offer.title}</h2>
                    <p className="text-sm text-gray-500">{offer.location}</p>
                    <p className="text-xs text-gray-400 mt-1">
                    Posted on {new Date(offer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-5 text-sm">
                    <button
                      onClick={() => router.push(`/Recruteur/Jobs/ViewJob/${offer.id}`)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/Recruteur/Jobs/EditJob/${offer.id}`)}
                      className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(offer.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm deletion</h2>
              <p className="text-gray-700 mb-6">
              Are you sure you want to delete this offer?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </RecruteurLayout>
  );
}
