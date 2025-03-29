"use client";
import NavbarAdmin from "@/app/components/NavbarAdmin";
import { useState } from "react";
import { FaBuilding, FaMapMarkerAlt, FaHistory, FaUsersCog, FaEnvelope, FaCheckCircle, FaIndustry, FaHome, FaCalendar, FaUsers, FaPhone, FaGlobe, FaLink, FaFileAlt, FaFile } from "react-icons/fa";

const steps = [
  { id: 1, title: "Tell us about your company", icon: <FaBuilding /> },
  { id: 2, title: "Tell us about your location", icon: <FaMapMarkerAlt /> },
  { id: 3, title: "Tell us about your history", icon: <FaHistory /> },
  { id: 4, title: "Tell us about your organization", icon: <FaUsersCog /> },
  { id: 5, title: "Tell us about your contact details", icon: <FaEnvelope /> },
];

export default function CreateCompanyProfile() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    companyLogo: null as File | null, // Définition explicite du type
    industry: "",
    otherIndustry: "",
    companyDescription: "",
    companyAddress: "",
    country: "",
    region: "",
    yearFounded: "",
    companySize: "",
    numberOfEmployees: "",
    departments: "",
    contractTypes: "",
    requiredDocuments: "",
    contactEmail: "",
    phoneNumber: "",
    website: "",
    socialLinks: "",
  });

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
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
    const { files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        companyLogo: files[0], // Ici, files[0] est un objet File
      }));
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="min-h-screen flex flex-col items-center bg-white px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Create Your Company Profile</h1>       

        {/* Barre de progression */}
        <div className="w-full max-w-4xl mb-8">
          <div className="flex items-center justify-between relative">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center w-1/5">
                {/* Cercle des étapes */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-4 ${
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
                  }`}
                >
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
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          {currentStep === 1 && (
            <div>
              <h1 className="text-3xl font-bold text-center mb-4 relative">Tell us about your company</h1>
              <div className="relative mb-4">
                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  placeholder="Company Name"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative mb-4">
              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="file"
                  name="companyLogo"
                  onChange={handleFileChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                />
              </div>
              <div className="relative mb-4">
                  <FaIndustry className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-md"
                    required>
                  
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {/* Affichage du champ "Other Industry" si l'option "Other" est sélectionnée */}
      {formData.industry === "Other" && (
        <div className="relative mb-4">
          <input
            type="text"
            name="otherIndustry"
            value={formData.otherIndustry}
            placeholder="Please specify your industry"
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border rounded-md"
          />
        </div>
      )}

              <div className="relative mb-4">
              <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  placeholder="Company Description"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h1 className="text-3xl font-bold text-center mb-4 relative">Tell us about your location</h1>
              <div className="relative mb-4">
                <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  placeholder="Company Address"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative mb-4">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  placeholder="Country"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative mb-4">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  placeholder="Region"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h1 className="text-3xl font-bold text-center mb-4 relative">Tell us about your history</h1>
              <div className="relative mb-4">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  name="yearFounded"
                  value={formData.yearFounded}
                  placeholder="Year Founded"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative mb-4">
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Company Size</option>
                  <option value="Startup">Startup</option>
                  <option value="SME">SME</option>
                  <option value="Large Company">Large Company</option>
                </select>
              </div>
              <div className="relative mb-4">
                <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  name="numberOfEmployees"
                  value={formData.numberOfEmployees}
                  placeholder="Number of Employees"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h1 className="text-3xl font-bold text-center mb-4 relative">Tell us about your organization</h1>
              <div className="relative mb-4">
                <FaUsersCog className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="departments"
                  value={formData.departments}
                  placeholder="Departments"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative mb-4">
                <input
                  type="text"
                  name="contractTypes"
                  value={formData.contractTypes}
                  placeholder="Contract Types"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative mb-4">
              <FaFile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="requiredDocuments"
                  value={formData.requiredDocuments}
                  placeholder="Required Documents"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h1 className="text-3xl font-bold text-center mb-4 relative">Tell us about your contact details</h1>
              <div className="relative mb-4">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  placeholder="Contact Email"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative mb-4">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative mb-4">
                <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  placeholder="Website"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative mb-4">
                <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="socialLinks"
                  value={formData.socialLinks}
                  placeholder="Social Links"
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
            )}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded"
                onClick={() => alert("Form Submitted!")}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
