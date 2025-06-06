'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faMoneyBillWave, faListCheck, faFileAlt, faPaperPlane, faGraduationCap, faUser, faBriefcase, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NavbarCandidat from '@/app/components/NavbarCandidat';

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
        const res = await axios.get<Offer>(`http://localhost:8081/api/offers/offerById/${id}`);
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

  if (!job) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
        <span className="relative flex h-20 w-20">
          <span className="animate-spin absolute inline-flex h-full w-full rounded-full bg-gradient-to-tr from-blue-400 via-blue-600 to-blue-400 opacity-20"></span>
          <span className="relative flex h-20 w-20 items-center justify-center">
            <svg className="h-12 w-12 text-blue-600 animate-spin" viewBox="0 0 50 50">
              <circle className="opacity-25" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="6" fill="none" />
              <circle className="opacity-100" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray="90 150" strokeLinecap="round" />
            </svg>
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <NavbarCandidat />
      <main className="flex-1 p-2 lg:p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 py-6"
        >
          <div className="bg-white/90 shadow-2xl rounded-2xl p-6 space-y-8 border border-blue-100 backdrop-blur-md">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 p-3 rounded-full shadow-md">
                  <FontAwesomeIcon icon={faBriefcase} className="text-blue-600 text-xl" />
                </span>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl tracking-tight">{job.title}</h1>
                  <p className="mt-1 text-gray-500 text-xs flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400" /> {job.location}
                  </p>
                </div>
              </div>
              <span className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm border border-blue-100">
                {job.contractType}
              </span>
            </div>

            {/* Details and Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  { [
                    { icon: <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 text-lg" />, label: 'Location', value: job.location },
                    { icon: <FontAwesomeIcon icon={faBriefcase} className="text-blue-500 text-lg" />, label: 'Required Experience', value: job.experienceRequired },
                    { icon: <FontAwesomeIcon icon={faUser} className="text-blue-500 text-lg" />, label: 'Required Languages', value: job.languagesRequired },
                    { icon: <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 text-lg" />, label: 'Application Deadline', value: new Date(job.applicationDeadline).toLocaleDateString() },
                    { icon: <FontAwesomeIcon icon={faGlobe} className="text-blue-500 text-lg" />, label: 'Work Mode', value: job.workMode },
                    { icon: <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 text-lg" />, label: 'Salary', value: job.salary ? `${job.salary} MAD` : 'Not specified' },
                  ].map((item, idx) => (
                    <DetailCard key={idx} icon={item.icon} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <DetailCard
                  icon={<FontAwesomeIcon icon={faListCheck} className="text-orange-500 text-lg" />}
                  label="Skills Required"
                  children={
                    <div className="flex flex-wrap gap-4">
                      {job.skillsRequired.split(',').map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium border border-blue-100 shadow-sm"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  }
                />
              </div>
            </div>

            <div className="w-fit min-w-[150px] max-w-sm flex flex-row items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-2 py-4 mb-4">
              <FontAwesomeIcon icon={faGraduationCap} className="text-indigo-500 text-lg" />
              <span className="text-base font-semibold text-gray-700">Education Level:</span>
              <span className="text-base text-gray-800 font-medium">{job.educationLevel}</span>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 text-base" />
                Job Description
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center"
            >
              <button
                onClick={handlePostulerClick}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-lg text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Postuler <FontAwesomeIcon icon={faPaperPlane} className="ml-1" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// DetailCard Component
const DetailCard = ({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) => (
  <div className="bg-white/80 rounded-xl p-5 flex items-start gap-4 shadow-md hover:bg-blue-50 transition-colors duration-200 border border-blue-100">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-semibold">{label}</p>
      {children ? (
        children
      ) : (
        <p className="text-base font-medium text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

export default ViewJobPage;