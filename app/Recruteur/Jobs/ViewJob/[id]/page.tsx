'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import RecruteurLayout from '@/RecruteurLayout';
import {
  Briefcase, MapPin, Calendar, DollarSign,
  ListChecks, FileText, BookOpen, User
} from 'lucide-react';
import { motion } from 'framer-motion';

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

  if (!job) {
    return <p className="text-center text-gray-600 mt-10">Loading job offer...</p>;
  }

  return (
    <RecruteurLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 py-12"
      >
        <div className="bg-white shadow-2xl rounded-3xl p-10 space-y-10 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{job.title}</h1>
            </div>
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
              {job.contractType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <MapPin className="text-blue-600 w-5 h-5" />,
                label: 'Location',
                value: job.location,
              },
              {
                icon: <DollarSign className="text-blue-600 w-5 h-5" />,
                label: 'Salary',
                value: job.salary ? `$${job.salary}` : 'Not specified',
              },
              {
                icon: <Calendar className="text-blue-600 w-5 h-5" />,
                label: 'Deadline',
                value: new Date(job.applicationDeadline).toLocaleDateString(),
              },
              {
                icon: <ListChecks className="text-blue-600 w-5 h-5" />,
                label: 'Skills',
                value: job.skillsRequired,
              },
              {
                icon: <FileText className="text-blue-600 w-5 h-5" />,
                label: 'Experience',
                value: job.experienceRequired,
              },
              {
                icon: <BookOpen className="text-blue-600 w-5 h-5" />,
                label: 'Education',
                value: job.educationLevel,
              },
              {
                icon: <User className="text-blue-600 w-5 h-5" />,
                label: 'Languages',
                value: job.languagesRequired,
              },
              {
                icon: <Briefcase className="text-blue-600 w-5 h-5" />,
                label: 'Work Mode',
                value: job.workMode,
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 flex items-start gap-4 shadow-sm">
                {item.icon}
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-base font-medium text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Job Description
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
              {job.description}
            </p>
          </div>
        </div>
      </motion.div>
    </RecruteurLayout>
  );
};

export default ViewJobPage;
