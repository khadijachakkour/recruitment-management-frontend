'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCalendarDays, faPlus, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import * as Select from '@radix-ui/react-select';
import RecruteurLayout from '@/RecruteurLayout';

interface Department {
  id: number;
  name: string;
}

const CreateJobPage = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [salary, setSalary] = useState<number | undefined>();
  const [skillsRequired, setSkillsRequired] = useState<string | null>(null);
  const [contractType, setContractType] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [experienceRequired, setExperienceRequired] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [languagesRequired, setLanguagesRequired] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/users/userId', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        });

        const response = await axios.get(`http://localhost:5000/api/companies/user-departments/${data.userId}`);
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!applicationDeadline.trim()) newErrors.applicationDeadline = 'Application deadline is required.';
    if (!departmentId) newErrors.departmentId = 'Department is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const jobData = {
      title,
      description,
      location,
      salary,
      skillsRequired,
      contractType,
      applicationDeadline: new Date(applicationDeadline),
      departmentId,
      experienceRequired,
      educationLevel,
      languagesRequired,
      workMode,
    };

    try {
      const res = await axios.post('http://localhost:8081/api/offers/CreateOffer', jobData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });
      const createdOffer = res.data.offer;
      router.push(`/Recruteur/Jobs/ViewJob/${createdOffer.id}`);
    } catch (err) {
      console.error('Error creating job:', err);
    }
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    if (step === 1) {
      if (!title.trim()) newErrors.title = 'Title is required.';
      if (!description.trim()) newErrors.description = 'Description is required.';
      if (!location?.trim()) newErrors.location = 'Location is required.';
    }
    if (step === 2) {
      if (!skillsRequired?.trim()) newErrors.skillsRequired = 'Skills are required.';
    }
    if (step === 3) {
      if (!applicationDeadline.trim()) newErrors.applicationDeadline = 'Application deadline is required.';
      if (!departmentId) newErrors.departmentId = 'Department is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderStep = () => {
    const inputStyle = `mt-1 block w-full rounded-lg border p-2 shadow-sm focus:ring-2 focus:ring-blue-500`;
    const errorStyle = `text-red-500 text-sm mt-1`;
    const twoColGrid = 'grid grid-cols-1 md:grid-cols-2 gap-6';

    switch (step) {
      case 1:
        return (
          <div className="space-y-4 mb-4">
            <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
              <FontAwesomeIcon icon={faBriefcase} className="text-blue-600" /> General Information
            </h2>
            <div className={twoColGrid}>
              <div>
                <label className="text-sm font-medium">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputStyle} ${errors.title ? 'border-red-500' : ''}`} />
                {errors.title && <p className={errorStyle}>{errors.title}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <input type="text" value={location || ''} onChange={(e) => setLocation(e.target.value)} className={`${inputStyle} ${errors.location ? 'border-red-500' : ''}`} />
                {errors.location && <p className={errorStyle}>{errors.location}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputStyle} ${errors.description ? 'border-red-500' : ''}`} />
                {errors.description && <p className={errorStyle}>{errors.description}</p>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="text-blue-600" /> Job Requirements
            </h2>
            <div className={twoColGrid}>
              <div>
                <label className="text-sm font-medium">Salary</label>
                <input type="number" value={salary || ''} onChange={(e) => setSalary(Number(e.target.value))} className={inputStyle} />
              </div>
              <div>
                <label className="text-sm font-medium">Skills Required</label>
                <input type="text" value={skillsRequired || ''} onChange={(e) => setSkillsRequired(e.target.value)} className={`${inputStyle} ${errors.skillsRequired ? 'border-red-500' : ''}`} />
                {errors.skillsRequired && <p className={errorStyle}>{errors.skillsRequired}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Contract Type</label>
                <input type="text" value={contractType} onChange={(e) => setContractType(e.target.value)} className={`${inputStyle} ${errors.contractType ? 'border-red-500' : ''}`} />
                {errors.contractType && <p className={errorStyle}>{errors.contractType}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Required Experience</label>
                <input type="text" value={experienceRequired} onChange={(e) => setExperienceRequired(e.target.value)} className={inputStyle} />
              </div>
              <div>
                <label className="text-sm font-medium">Education Level</label>
                <input type="text" value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} className={inputStyle} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarDays} className="text-blue-600" /> Offer Details
            </h2>
            <div className={twoColGrid}>
              <div>
                <label className="text-sm font-medium">Application Deadline</label>
                <input type="date" value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} className={`${inputStyle} ${errors.applicationDeadline ? 'border-red-500' : ''}`} />
                {errors.applicationDeadline && <p className={errorStyle}>{errors.applicationDeadline}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <Select.Root onValueChange={(value) => setDepartmentId(Number(value))}>
                  <Select.Trigger className={`${inputStyle} flex justify-between items-center ${errors.departmentId ? 'border-red-500' : ''}`}>
                    <Select.Value placeholder="Select a department" />
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-blue-500" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white shadow-lg rounded-md">
                      <Select.ScrollUpButton className="flex items-center justify-center p-1"><FontAwesomeIcon icon={faChevronUp} /></Select.ScrollUpButton>
                      <Select.Viewport className="p-2">
                        {departments.map((dep) => (
                          <Select.Item key={dep.id} value={String(dep.id)} className="cursor-pointer px-4 py-2 hover:bg-blue-100 rounded">
                            <Select.ItemText>{dep.name}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                {errors.departmentId && <p className={errorStyle}>{errors.departmentId}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Required Languages</label>
                <input type="text" value={languagesRequired} onChange={(e) => setLanguagesRequired(e.target.value)} className={inputStyle}/>
              </div>
              <div>
                <label className="text-sm font-medium">Work Mode</label>
                <input type="text" value={workMode} onChange={(e) => setWorkMode(e.target.value)} className={inputStyle} placeholder="On-site / Hybrid / Remote" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <RecruteurLayout>
      <div className="flex min-h-[60vh] items-center justify-center bg-white py-6 px-2">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-8 border border-blue-100">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-extrabold text-blue-800 tracking-tight">Create a New Job Offer</h1>
              <span className="text-xs font-semibold text-blue-500 bg-blue-100 px-3 py-1 rounded-full">Step {step} / 3</span>
            </div>
            <div className="flex items-center justify-between gap-2 mb-2">
              {[1,2,3].map((s) => (
                <div key={s} className={`flex-1 flex flex-col items-center relative ${s < 3 ? 'after:content-[\" \"] after:w-full after:h-1 after:bg-blue-100 after:absolute after:top-1/2 after:left-full after:-translate-y-1/2' : ''}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-blue-300 text-blue-400'} font-bold transition`}>
                    {s === 1 && <FontAwesomeIcon icon={faBriefcase} />}
                    {s === 2 && <FontAwesomeIcon icon={faPlus} />}
                    {s === 3 && <FontAwesomeIcon icon={faCalendarDays} />}
                  </div>
                  <span className="text-xs mt-2 text-blue-700 font-medium">
                    {s === 1 && 'General'}
                    {s === 2 && 'Requirements'}
                    {s === 3 && 'Details'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderStep()}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold shadow hover:bg-gray-200 transition-all border border-gray-200">
                  Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={() => validateStep() && setStep(step + 1)} className="sm:ml-auto px-8 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition-all border border-blue-600">
                  Next
                </button>
              ) : (
                <button type="submit" className="sm:ml-auto px-8 py-2 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 transition-all border border-green-600">
                  Publish Offer
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </RecruteurLayout>
  );
};

export default CreateJobPage;