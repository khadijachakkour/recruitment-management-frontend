"use client";
import NavbarAdmin from "@/app/components/NavbarAdmin";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaBuilding, FaMapMarkerAlt, FaHistory, FaUsersCog, FaEnvelope, FaCheckCircle, FaIndustry, FaHome, FaCalendar, FaUsers, FaPhone, FaGlobe, FaLink, FaFileAlt, FaFile, FaTrashAlt, FaPlus } from "react-icons/fa";

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
    ceo: "", // PDG
    ceoImage: null as File | null, 
    revenue: "", //Chiffre d'affaires
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
      
  
      await axios.post('http://localhost:5000/api/companies/createCompany', payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });
  
      console.log("Entreprise créée avec succès !");
      router.push("/Admin/Dashboard");
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
        <form
  onSubmit={handleSubmit}
  className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg"
>
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
              <div className="mb-4">
  <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700 mb-1">
    Upload company logo
  </label>
  <div className="relative">
    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    <input
      id="companyLogo"
      type="file"
      name="companyLogo"
      accept="image/*"
      onChange={handleFileChange}
      className="w-full pl-10 pr-3 py-2 border rounded-md text-gray-700 file:text-blue-700"
    />
  </div>
</div>

              {companyLogoPreview && (
  <div className="mb-4 text-center">
    <img
      src={companyLogoPreview}
      alt="Company Logo Preview"
      className="w-32 h-32 object-cover mx-auto rounded-full border shadow"
    />
    <button
      type="button"
      onClick={removeCompanyLogo}
      className="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center justify-center gap-1 mx-auto"
    >
      <FaTrashAlt className="text-sm" />
    </button>
  </div>
)}

              <div className="relative mb-4">
        <FaIndustry className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <select
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className="w-full pl-10 pr-3 py-2 border rounded-md"
          required >
      
          <option value="">Select Industry</option>
          <option value="Aerospace & Defense">Aerospace & Defense</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Arts, Entertainment & Recreation">Arts, Entertainment & Recreation</option>
          <option value="Construction, Repair & Maintenance Services">Construction, Repair & Maintenance Services</option>
          <option value="Education">Education</option>
          <option value="Energy, Mining & Utilities">Energy, Mining & Utilities</option>
          <option value="Financial Services">Financial Services</option>
          <option value="Hotels & Travel Accommodation">Hotels & Travel Accommodation</option>
          <option value="Insurance">Insurance</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Personal Consumer Services">Personal Consumer Services</option>
          <option value="Restaurants & Food Service">Restaurants & Food Service</option>
          <option value="Transportation & Logistics">Transportation & Logistics</option>
          <option value="Government & Public Administration">Government & Public Administration</option>
          <option value="Human Resources & Staffing">Human Resources & Staffing</option>
          <option value="Legal">Legal</option>
          <option value="Media & Communication">Media & Communication</option>
          <option value="Pharmaceutical & Biotechnology">Pharmaceutical & Biotechnology</option>
          <option value="Retail & Wholesale">Retail & Wholesale</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
          <option value="Management & Consulting">Management & Consulting</option>
          <option value="Nonprofit & NGO">Nonprofit & NGO</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Telecommunications">Telecommunications</option>
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

              <div className="relative mb-4">
              <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="ceo"
                value={formData.ceo}
                placeholder="CEO / Founder"
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                onChange={handleChange}
                required
              />
            </div>
           
            <div className="mb-4">
  <label htmlFor="ceoImage" className="block text-sm font-medium text-gray-700 mb-1">
    Upload ceo Image 
  </label>
  <div className="relative">
    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    <input
      id="ceoImage"
      type="file"
      name="ceoImage"
      accept="image/*"
      onChange={handleFileChange}
      className="w-full pl-10 pr-3 py-2 border rounded-md text-gray-700 file:text-blue-700" />
  </div>
  <p className="text-xs text-gray-500 mt-1">
    You can skip this step, but uploading a logo helps your company look more professional.
  </p>
</div>

{ceoImagePreview && (
  <div className="mb-4 text-center">
    <img
      src={ceoImagePreview}
      alt="Ceo Image Preview"
      className="w-32 h-32 object-cover mx-auto rounded-full border shadow" />
    <button
      type="button"
      onClick={removeCeoImage}
      className="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center justify-center gap-1 mx-auto">
      <FaTrashAlt className="text-sm" />
    </button>
  </div>
)}



            <div className="relative mb-4">
              <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="revenue"
                value={formData.revenue}
                placeholder="Annual Revenue"
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
    <h1 className="text-3xl font-bold text-center mb-6 relative">Tell us about your organization</h1>

    {/* Champ de saisie pour le département avec ajout dynamique et suppression moderne */}
    <div className="relative mb-4">
      <input
        type="text"
        name="newDepartment"
        value={formData.newDepartment}
        onChange={(e) => setFormData({ ...formData, newDepartment: e.target.value })}
        placeholder="Enter department name"
        className="w-full pr-12 pl-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-all duration-300 transform hover:scale-105"
        onClick={() => {
          if (formData.newDepartment && !formData.departments.includes(formData.newDepartment)) {
            setFormData({
              ...formData,
              departments: [...formData.departments, formData.newDepartment],
              newDepartment: "", // Réinitialise le champ après l'ajout
            });
          }
        }}
      >
        <FaPlus className="text-white" />
      </button>
    </div>

    {/* Affichage des départements ajoutés avec un bouton "X" pour supprimer */}
    <div className="mb-6">
      {formData.departments.length > 0 && (
        <ul className="list-disc pl-6 space-y-3">
          {formData.departments.map((department, index) => (
            <li
              key={index}
              className="flex justify-between items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span>{department}</span>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 transition-all duration-200"
                onClick={() => {
                  setFormData({
                    ...formData,
                    departments: formData.departments.filter((_, i) => i !== index),
                  });
                }}
              >
                <FaTrashAlt className="text-lg" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Champs supplémentaires */}
    <div className="relative mb-6">
      <input
        type="text"
        name="contractTypes"
        value={formData.contractTypes}
        placeholder="Contract Types"
        className="w-full pl-10 pr-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        required
      />
    </div>
    <div className="relative mb-6">
      <FaFile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        name="requiredDocuments"
        value={formData.requiredDocuments}
        placeholder="Required Documents"
        className="w-full pl-10 pr-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
>
  Submit
</button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}