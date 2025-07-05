'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faMoneyBillWave, faListCheck, faFileAlt, faPaperPlane, faGraduationCap, faUser, faBriefcase, faGlobe, faClock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NavbarCandidat from '@/app/components/NavbarCandidat';

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Offer {
  id: number;
  title: string;
  description: string;
  location: string;
  salary?: number;
  skillsRequired: string;
  contractType: string;
  applicationDeadline: string;
  experienceRequired: string;
  educationLevel: string;
  languagesRequired: string;
  workMode: string;
}

const ViewJobPage = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [job, setJob] = useState<Offer | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get<Offer>(`${API_BASE_URL}/api/offers/offerById/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error('Error fetching job:', err);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handlePostulerClick = () => {
    if (job) {
      router.push(`/Candidat/PostulerOffre/${job.id}`);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  if (!job) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white" style={{ zoom: 0.9 }}>
      <NavbarCandidat />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            <span className="text-sm font-medium">Back to offers</span>
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Offer header */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex items-center gap-4 text-blue-100">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faGlobe} className="text-sm" />
                      <span className="text-sm">{job.workMode}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                    {job.contractType}
                  </span>
                  {job.salary && (
                    <span className="text-2xl font-bold">
                      {job.salary.toLocaleString()} MAD
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main information */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faFileAlt} className="text-blue-600 text-sm" />
                  </div>
                  Job Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Required Skills */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faListCheck} className="text-orange-600 text-sm" />
                  </div>
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar with details */}
            <div className="space-y-6">
              {/* Offer details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Offer Details</h3>
                <div className="space-y-4">
                  <InfoItem
                    icon={<FontAwesomeIcon icon={faCalendarAlt} className="text-red-500" />}
                    label="Deadline"
                    value={new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  />
                  <InfoItem
                    icon={<FontAwesomeIcon icon={faBriefcase} className="text-blue-500" />}
                    label="Experience"
                    value={job.experienceRequired}
                  />
                  <InfoItem
                    icon={<FontAwesomeIcon icon={faGraduationCap} className="text-purple-500" />}
                    label="Education Level"
                    value={job.educationLevel}
                  />
                  <InfoItem
                    icon={<FontAwesomeIcon icon={faUser} className="text-green-500" />}
                    label="Languages"
                    value={job.languagesRequired}
                  />
                </div>
              </div>

              {/* Apply button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-3"
              >
                <button
                  onClick={handlePostulerClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Apply Now
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// InfoItem component
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-600 mt-1">{value}</p>
    </div>
  </div>
);

export default ViewJobPage;