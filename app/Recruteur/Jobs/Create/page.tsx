'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Department {
  id: number;
  name: string;
}

const CreateJobPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState<number | undefined>();
  const [skillsRequired, setSkillsRequired] = useState('');
  const [contractType, setContractType] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/users/userId", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
  
        setUserId(data.userId);
        const response = await axios.get(`http://localhost:5000/api/companies/user-departments/${data.userId}`); 
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departmentId) {
      alert('Please select a department.');
      return;
    }

    const jobData = {
      title,
      description,
      location,
      salary,
      skillsRequired,
      contractType,
      applicationDeadline: new Date(applicationDeadline),
      departmentId,
    };

    console.log("Job Data:", jobData);

    try {
      await axios.post('http://localhost:8081/api/offers/CreateOffer', jobData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });
      router.push('/Recruteur/Dashboard');
    } catch (err) {
      console.error('Error creating job:', err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a New Job</h1>
      {loading ? (
        <p>Loading departments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="number"
              value={salary || ''}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Skills Required</label>
            <input
              type="text"
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contract Type</label>
            <input
              type="text"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
            <input
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={departmentId || ''}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="" disabled>
                Select a department
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700"
          >
            Create Job
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateJobPage;