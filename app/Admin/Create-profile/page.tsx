"use client";
import NavbarAdmin from "@/app/components/NavbarAdmin";
import axios, { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaBuilding, FaMapMarkerAlt, FaHistory, FaUsersCog, FaEnvelope, FaCheckCircle, FaIndustry, FaHome, FaCalendar, FaUsers, FaPhone, FaGlobe, FaLink, FaFileAlt, FaFile, FaTrashAlt, FaPlus, FaTimes, FaSave } from "react-icons/fa";
import Image from "next/image";
import AdminLayout from "@/AdminLayout";


const steps = [
  { id: 1, title: "Tell us about your company", icon: <FaBuilding /> },
  { id: 2, title: "Tell us about your location", icon: <FaMapMarkerAlt /> },
  { id: 3, title: "Tell us about your history", icon: <FaHistory /> },
  { id: 4, title: "Tell us about your organization", icon: <FaUsersCog /> },
  { id: 5, title: "Tell us about your contact details", icon: <FaEnvelope /> },
];

export default function CreateCompanyProfile() {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [ceoImagePreview, setCeoImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    companyLogo: null as File | null, 
    industry: "",
    otherIndustry: "",
    companyDescription: "",
    companyAddress: "",
    country: "",
    region: "",
    yearFounded: "",
    companySize: "",
    numberOfEmployees: "",
    departments: [] as string[],
    newDepartment: "",
    contractTypes: "",
    requiredDocuments: "",
    contactEmail: "",
    phoneNumber: "",
    website: "",
    socialLinks: "",
    ceo: "", 
    ceoImage: null as File | null, 
    revenue: "", //Chiffre d'affaires
  });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPreviewCeoImage, setShowPreviewCeoImage] = useState(false);

  // Configuration de l'API Gateway
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
  
    if (currentStep === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required.";
      if (!formData.industry) newErrors.industry = "Industry is required.";
      if (formData.industry === "Other" && !formData.otherIndustry.trim()) {
        newErrors.otherIndustry = "Please specify your industry.";
      }
      if (!formData.companyDescription.trim()) newErrors.companyDescription = "Company description is required.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
  
      if (name === "companyLogo") {
        setFormData((prev) => ({ ...prev, companyLogo: file }));
        setCompanyLogoPreview(previewUrl);
      } else if (name === "ceoImage") {
        setFormData((prev) => ({ ...prev, ceoImage: file }));
        setCeoImagePreview(previewUrl);
      }
    }
  };

  const removeCompanyLogo = () => {
    setCompanyLogoPreview(null);
    setFormData((prev) => ({ ...prev, companyLogo: null }));
  };
  
  const removeCeoImage = () => {
    setCeoImagePreview(null);
    setFormData((prev) => ({ ...prev, ceoImage: null }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 5) {
      return;
    }
    try {
      let logoUrl = "";
      let ceoImageUrl="";
      if (formData.ceoImage) {
        const ceoData = new FormData();
        ceoData.append("file", formData.ceoImage);
        ceoData.append("upload_preset", "recruitment_upload");
        ceoData.append("cloud_name", "di2xqx7ny");
      
        const ceoUploadRes = await fetch(`https://api.cloudinary.com/v1_1/di2xqx7ny/image/upload`, {
          method: "POST",
          body: ceoData,
        });
      
        const ceoUploadData = await ceoUploadRes.json();
        ceoImageUrl = ceoUploadData.secure_url;
      }
      
      if (formData.companyLogo) {
        const imageData = new FormData();
        imageData.append("file", formData.companyLogo);
        imageData.append("upload_preset", "recruitment_upload"); 
        imageData.append("cloud_name", "di2xqx7ny");
  
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/di2xqx7ny/image/upload`, {
          method: "POST",
          body: imageData,
        });
  
        const uploadData = await uploadRes.json();
        logoUrl = uploadData.secure_url;
      }
  
      const payload = {
        ...formData,
        companyLogo: logoUrl,
        ceoImage: ceoImageUrl,
      };
      
      await axios.post(`${API_BASE_URL}/api/companies/createCompany`, payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });
  
      router.push("/Admin/Company-profile");
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        console.error("Erreur lors de la création :", error.response.data);
      } else {
        console.error("Erreur inconnue :", error);
      }
    }
  };
  
  return (
    <>
    <AdminLayout>
      <div className="min-h-screen p-3">
      <div className="max-w-5xl mx-auto" style={{ zoom: 0.87 }}>
        {/* Barre de progression */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row">
        <div className="w-full md:w-1/4 bg-gray-50 p-3 border-r border-gray-200">
        <div className="flex flex-col space-y-4">
        {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                {/* Cercle des étapes */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep > step.id
                      ? "bg-blue-500 border-blue-500"
                      : currentStep === step.id
                      ? "bg-white border-blue-500 shadow-lg"
                      : "bg-gray-300 border-gray-300"
                  } relative transition-all duration-300 z-10`}
                >
                  {currentStep > step.id ? (
                    <FaCheckCircle className="text-white text-lg" />
                  ) : (
                    <span className="text-gray-800 text-xl">{step.icon}</span>
                  )}
                </div>
                <p
                  className={`text-sm mt-2 ${
                    currentStep >= step.id ? "text-blue-600 font-semibold" : "text-gray-500"
                  }`} >
                  {step.title}
                </p>
              </div>
            ))}
            <div className="absolute top-6 left-0 w-full h-1 bg-gray-300 rounded-full z-0">
              <div
                className="h-1 bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Contenu du formulaire */}
        <div className="w-full md:w-3/4 p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
        {currentStep === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-center mb-4 relative">Tell us about your company</h1>
               {/* Ligne 1: Nom et Logo */}
               <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <div className="relative">
                          <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            placeholder="Company Name"
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleChange} />
                          {errors.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
                        </div>
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo
                        </label>
                        <div className="relative">
                        <input
          id="companyLogo"
          type="file"
          name="companyLogo"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded-md file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
      </div>

      {companyLogoPreview && (
        <>
          <motion.div
            className="mt-4 flex items-center gap-4 bg-gray-50 p-3 rounded-lg shadow-sm border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={companyLogoPreview}
              alt="Company Logo Preview"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover border shadow-md cursor-pointer hover:opacity-90 transition"
              onClick={() => setShowPreviewModal(true)}
              title="Cliquer pour agrandir"
            />
            <button
              type="button"
              onClick={removeCompanyLogo}
              className="text-red-500 hover:text-red-700 transition-colors text-xl"
              title="Supprimer le logo"
            >
              <FaTrashAlt />
            </button>
          </motion.div>

          {/* Fullscreen Image Modal */}
          <AnimatePresence>
            {showPreviewModal && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative p-4">
                  <button
                    className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300"
                    onClick={() => setShowPreviewModal(false)}
                    aria-label="Fermer l’aperçu"
                  >
                    <FaTimes />
                  </button>
                  <Image
                    src={companyLogoPreview}
                    alt="Preview grand format"
                    width={400}
                    height={400}
                    className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-xl border"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
    
                      </div>
              {/* Ligne 2: Industrie et PDG */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry sector</label>
                        <div className="relative">
                          <FaIndustry className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="Agriculture">Agriculture</option>
          <option value="Arts, Entertainment & Recreation">Arts, Entertainment & Recreation</option>
          <option value="Construction, Repair & Maintenance Services">Construction, Repair & Maintenance Services</option>
          <option value="Education">Education</option>
          <option value="Energy, Mining & Utilities">Energy, Mining & Utilities</option>
          <option value="Electronics">Electronics</option>
          <option value="Financial Services">Financial Services</option>
          <option value="Hotels & Travel Accommodation">Hotels & Travel Accommodation</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Human Resources & Staffing">Human Resources & Staffing</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Personal Consumer Services">Personal Consumer Services</option>
          <option value="Restaurants & Food Service">Restaurants & Food Service</option>
          <option value="Transportation & Logistics">Transportation & Logistics</option>
          <option value="Government & Public Administration">Government & Public Administration</option>
          <option value="Legal">Legal</option>
          <option value="Media & Communication">Media & Communication</option>
          <option value="Pharmaceutical & Biotechnology">Pharmaceutical & Biotechnology</option>
          <option value="Insurance">Insurance</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Management & Consulting">Management & Consulting</option>
          <option value="Telecommunications">Telecommunications</option>
          <option value="Other">Other</option>
                          </select>
                          {errors.industry && <p className="text-red-600 text-sm mt-1">{errors.industry}</p>}
                        </div>
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">CEO / Founder</label>
                        <div className="relative">
                          <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            name="ceo"
                            value={formData.ceo}
                            placeholder="CEO / Founder"
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Affichage du champ "Autre secteur" si l'option "Autre" est sélectionnée */}
                    {formData.industry === "Other" && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specify your industry&nbsp;&quot;</label>
                        <input
                          type="text"
                          name="otherIndustry"
                          value={formData.otherIndustry}
                          placeholder="Please specify your industry"
                          onChange={handleChange}
                          className="w-full pl-3 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.otherIndustry && <p className="text-red-600 text-sm mt-1">{errors.otherIndustry}</p>}
                      </div>
                    )}

                    {/* Ligne 3: Photo PDG et Chiffre d'affaires */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ceo Image</label>
                        <input
                          id="ceoImage"
                          type="file"
                          name="ceoImage"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full px-3 py-2 border rounded-md file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
    You can skip this step, but uploading a logo helps your company look more professional.
  </p>
                        {ceoImagePreview && (
                          <>
          <motion.div
            className="mt-4 flex items-center gap-4 bg-gray-50 p-3 rounded-lg shadow-sm border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}>
              <Image
                src={ceoImagePreview}
                alt="Photo du PDG"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border shadow-md cursor-pointer hover:opacity-90 transition"
              onClick={() => setShowPreviewCeoImage(true)}/>
                            <button
                              type="button"
                              onClick={removeCeoImage}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              <FaTrashAlt />
                            </button>
                            </motion.div>
{/* Fullscreen Image Modal */}
<AnimatePresence>
            {showPreviewCeoImage && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} >
                <div className="relative p-4">
                  <button
                    className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300"
                    onClick={() => setShowPreviewCeoImage(false)}
                    aria-label="Close" >
                    <FaTimes />
                  </button>
                  <Image
                    src={ceoImagePreview}
                    alt="Preview grand format"
                    width={300}
                    height={300}
                    className="max-w-[50vw] max-h-[50vh] object-contain rounded-lg shadow-xl border"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue</label>
                        <div className="relative">
                          <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            name="revenue"
                            value={formData.revenue}
                            placeholder="Annual Revenue"
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description de l'entreprise */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                      <div className="relative">
                        <FaFileAlt className="absolute left-3 top-3 text-gray-500" />
                        <textarea
                          name="companyDescription"
                          value={formData.companyDescription}
                          className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
                          onChange={handleChange}
                        />
                        {errors.companyDescription && <p className="text-red-600 text-sm mt-1">{errors.companyDescription}</p>}
                      </div>
                    </div>
                  </div>
                )}

{currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Address</h2>
                    
                    {/* Adresse */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <div className="relative">
                        <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          name="companyAddress"
                          value={formData.companyAddress}
                          placeholder="Company Address"
                          className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    {/* Pays et Région sur la même ligne */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            placeholder="Pays"
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            name="region"
                            value={formData.region}
                            placeholder="Region"
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tell us about your history</h2>
                    
                    {/* Année de fondation et Taille de l'entreprise sur la même ligne */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year Founded</label>
                        <div className="relative">
                          <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input
                            type="number"
                            name="yearFounded"
                            value={formData.yearFounded}
                            placeholder="Year Founded"
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                        <div className="relative">
                          <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <select
                            name="companySize"
                            value={formData.companySize}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="Startup">Startup</option>
                  <option value="SME">SME (Small and Medium Enterprise)</option>
                  <option value="Large Company">Large Company</option>
                </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Nombre d'employés */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                      <div className="relative">
                        <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                          type="number"
                          name="numberOfEmployees"
                          value={formData.numberOfEmployees}
                          placeholder="Number of Employees"
                          className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
 {currentStep === 4 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tell us about your organization</h2>
                    
                    {/* Ajout de départements */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departments</label>
                    <div className="relative mb-4">
                      <div className="flex">
                        <input
                          type="text"
                          name="newDepartment"
                          value={formData.newDepartment}
                          onChange={(e) => setFormData({ ...formData, newDepartment: e.target.value })}
                          placeholder="Department Name"
                          className="flex-1 px-3 py-2 border rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
                          onClick={() => {
                            if (formData.newDepartment && !formData.departments.includes(formData.newDepartment)) {
                              setFormData({
                                ...formData,
                                departments: [...formData.departments, formData.newDepartment],
                                newDepartment: "", 
                              });
                            }
                          }}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>

                    {/* Affichage des départements ajoutés */}
                    {formData.departments.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {formData.departments.map((department, index) => (
                            <div 
                              key={index}
                              className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                            >
                              <span>{department}</span>
                              <button
                                type="button"
                                className="ml-2 text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    departments: formData.departments.filter((_, i) => i !== index),
                                  });
                                }}
                              >
                                <FaTrashAlt className="text-xs" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Types de contrats et Documents requis sur la même ligne */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contract Types</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="contractTypes"
                            value={formData.contractTypes}
                            placeholder="Contract Types"
                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Documents</label>
                        <div className="relative">
                          <FaFile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            name="requiredDocuments"
                            value={formData.requiredDocuments}
                            placeholder="Required Documents"
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

{currentStep === 5 && (
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tell us about your contact details</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                placeholder="Contact Email"
                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                placeholder="Phone Number"
                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <div className="relative">
                            <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                placeholder="Website"
                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Social Links</label>
                        <div className="relative">
                            <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                name="socialLinks"
                                value={formData.socialLinks}
                                placeholder="Social Links"
                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
          )}
          {/* Boutons de navigation */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-1.5 bg-gray-300 rounded"
              >
                Previous
              </button>
            )}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-5 py-1.5 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            ) : (
              <motion.div
  className="flex justify-end gap-4 mt-6"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  <button
    type="submit"
    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-8 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
  >
    <FaSave className="text-base" />
    Save Changes
  </button>
  <button
    type="button"
    onClick={() => router.push("/Admin/Company-profile")}
    className="flex items-center gap-2 bg-gray-100 text-gray-700 py-2.5 px-8 rounded-full shadow-md hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
  >
    <FaTimes className="text-base" />
    Cancel
  </button>
</motion.div>

            )}
          </div>
          </form>
          </div>
        </div>
        </div>
        </div>
      
      </AdminLayout>
        </>
  );
}