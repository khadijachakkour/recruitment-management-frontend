'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import RecruteurLayout from '@/RecruteurLayout';
import { Briefcase, MapPin, Calendar, DollarSign, ListChecks, FileText } from 'lucide-react';

interface Offer {
  id: number;
  title: string;
  description: string;
  location: string;
  salary?: number;
  skillsRequired: string;
  contractType: string;
  applicationDeadline: string;
}

const ViewJobPage = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [job, setJob] = useState<Offer | null>(null);

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

  if (!job) return <p className="text-center">Loading job offer...</p>;

  return (
    <RecruteurLayout>
      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
              {job.contractType}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-lg font-medium text-gray-800">{job.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="text-green-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="text-lg font-medium text-gray-800">
                  {job.salary ? `${job.salary} MAD` : 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-purple-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="text-lg font-medium text-gray-800">
                  {new Date(job.applicationDeadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ListChecks className="text-orange-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Skills Required</p>
                <p className="text-lg font-medium text-gray-800">{job.skillsRequired}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-700">Job Description</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>
        </div>
      </div>
    </RecruteurLayout>
  );
};

export default ViewJobPage;
