"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import NavbarAdmin from "@/app/components/NavbarAdmin";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { FaSave } from "react-icons/fa";
import Image from "next/image";
import type { Department } from "@/app/types/company";

interface FormData {
  companyName: string;
  companyLogo: File | null;
  industry: string;
  otherIndustry: string;
  companyDescription: string;
  companyAddress: string;
  country: string;
  region: string;
  yearFounded: string;
  companySize: string;
  numberOfEmployees: string;
  departments: string[];
  contractTypes: string;
  requiredDocuments: string;
  contactEmail: string;
  phoneNumber: string;
  website: string;
  socialLinks: string;
  ceo: string;
  ceoImage: File | null;
  revenue: string;
  newDepartment: string;
  companyMission: string;
  companyVision: string;
  companyValues: string;
  companyBenefits: string;
  headquarters: string;
  techStack: string;
  workCulture: string;
  careerGrowth: string;
}

const industryOptions = [
  "Agriculture",
  "Arts, Entertainment & Recreation",
  "Construction, Repair & Maintenance Services",
  "Education",
  "Energy, Mining & Utilities",
  "Electronics",
  "Financial Services",
  "Hotels & Travel Accommodation",
  "Healthcare",
  "Human Resources & Staffing",
  "Manufacturing",
  "Personal Consumer Services",
  "Restaurants & Food Service",
  "Transportation & Logistics",
  "Government & Public Administration",
  "Legal",
  "Media & Communication",
  "Pharmaceutical & Biotechnology",
  "Insurance",
  "Information Technology",
  "Management & Consulting",
  "Telecommunications",
  "Other...",
];

const companySizeOptions = ["Startup", "SME", "Large Company"];

const steps = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Location" },
  { id: 3, name: "About the Company" },
  { id: 4, name: "Contact Information" },
];

function ProgressBar({
  currentStep,
  setStep,
  isSubmitting,
}: {
  currentStep: number;
  setStep: (step: number) => void;
  isSubmitting: boolean;
}) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center ${
              isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            onClick={() => !isSubmitting && setStep(step.id)}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step.id <= currentStep
                  ? "bg-sky-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-sky-400 hover:text-white"
              }`}
            >
              {step.id}
            </div>
            <span className="text-sm mt-1 text-gray-600">{step.name}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-sky-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-base font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-white text-base text-gray-900 shadow-sm"
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  onKeyDown,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-base font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        required={required}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all text-base shadow-sm"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  onKeyDown,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-base font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        required={required}
        rows={4}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all text-base shadow-sm resize-y"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

function FileUploadField({
  label,
  name,
  preview,
  onChange,
  onRemove,
}: {
  label: string;
  name: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-base font-medium text-gray-700">{label}</label>
      <div className="flex items-start gap-3">
        {preview ? (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-sm">
            <Image src={preview} alt={label} width={64} height={64} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-2 h-2" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
        <div>
          <input
            type="file"
            name={name}
            onChange={onChange}
            accept="image/*"
            className="hidden"
            id={name}
          />
          <label
            htmlFor={name}
            className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-base font-medium text-gray-700 shadow-sm"
          >
            <Upload className="w-3 h-3 mr-1.5" />
            Upload
          </label>
          <p className="text-gray-500 text-xs mt-1">Recommended: 400x400 px, Max: 2MB</p>
        </div>
      </div>
    </div>
  );
}

export default function UpdateCompanyProfile() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [ceoImagePreview, setCeoImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyLogo: null,
    industry: "",
    otherIndustry: "",
    companyDescription: "",
    companyAddress: "",
    country: "",
    region: "",
    yearFounded: "",
    companySize: "",
    numberOfEmployees: "",
    departments: [],
    contractTypes: "",
    requiredDocuments: "",
    contactEmail: "",
    phoneNumber: "",
    website: "",
    socialLinks: "",
    ceo: "",
    ceoImage: null,
    revenue: "",
    newDepartment: "",
    companyMission: "",
    companyVision: "",
    companyValues: "",
    companyBenefits: "",
    headquarters: "",
    techStack: "",
    workCulture: "",
    careerGrowth: "",
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/companies/profile", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        const company = res.data;
        setFormData((prev) => ({
          ...prev,
          ...company,
          companyLogo: null,
          ceoImage: null,
          departments: company.departments?.map((d: Department) => d.name) || [],
        }));
        setCompanyLogoPreview(company.companyLogo);
        setCeoImagePreview(company.ceoImage);
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      if (name === "companyLogo") {
        setFormData((prev) => ({ ...prev, companyLogo: file }));
        setCompanyLogoPreview(preview);
      } else if (name === "ceoImage") {
        setFormData((prev) => ({ ...prev, ceoImage: file }));
        setCeoImagePreview(preview);
      }
    }
  };

  const removeImage = (type: "companyLogo" | "ceoImage") => {
    if (type === "companyLogo") {
      setFormData((prev) => ({ ...prev, companyLogo: null }));
      setCompanyLogoPreview(null);
    } else {
      setFormData((prev) => ({ ...prev, ceoImage: null }));
      setCeoImagePreview(null);
    }
  };

  const handleAddDepartment = () => {
    if (formData.newDepartment.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        departments: [...prev.departments, prev.newDepartment.trim()],
        newDepartment: "",
      }));
    }
  };

  const handleRemoveDepartment = (departmentToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.filter((dept) => dept !== departmentToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let logoUrl = companyLogoPreview;
      let ceoImageUrl = ceoImagePreview;

      if (formData.companyLogo) {
        const data = new FormData();
        data.append("file", formData.companyLogo);
        data.append("upload_preset", "recruitment_upload");

        const res = await fetch("https://api.cloudinary.com/v1_1/di2xqx7ny/image/upload", {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        logoUrl = result.secure_url;
      }

      if (formData.ceoImage) {
        const data = new FormData();
        data.append("file", formData.ceoImage);
        data.append("upload_preset", "recruitment_upload");

        const res = await fetch("https://api.cloudinary.com/v1_1/di2xqx7ny/image/upload", {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        ceoImageUrl = result.secure_url;
      }

      const payload = {
        ...formData,
        companyLogo: logoUrl,
        ceoImage: ceoImageUrl,
      };

      await axios.put("http://localhost:5000/api/companies/updateProfile", payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });

      router.push("/Admin/Company-profile");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      console.log("Moving to step:", currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      console.log("Moving to step:", currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSubmitClick = () => {
    const form = document.querySelector("form");
    if (form) {
      form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  const handleCancel = () => {
    router.push("/Admin/Dashboard");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
              <SelectField
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                options={industryOptions}
                required
              />
              {formData.industry === "Other..." && (
                <InputField
                  label="Other Industry"
                  name="otherIndustry"
                  value={formData.otherIndustry}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              )}
              <InputField
                label="Year Founded"
                name="yearFounded"
                value={formData.yearFounded}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="number"
              />
              <SelectField
                label="Company Size"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                options={companySizeOptions}
              />
              <InputField
                label="Number of Employees"
                name="numberOfEmployees"
                value={formData.numberOfEmployees}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="number"
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Company Address"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <InputField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <InputField
                label="Region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <TextAreaField
                  label="Company Description"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
                <InputField
                  label="Revenue"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
                <InputField
                  label="CEO"
                  name="ceo"
                  value={formData.ceo}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
                <InputField
                  label="Contract Types"
                  name="contractTypes"
                  value={formData.contractTypes}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="space-y-6">
                <FileUploadField
                  label="Company Logo"
                  name="companyLogo"
                  preview={companyLogoPreview}
                  onChange={handleFileChange}
                  onRemove={() => removeImage("companyLogo")}
                />
                <FileUploadField
                  label="CEO Image"
                  name="ceoImage"
                  preview={ceoImagePreview}
                  onChange={handleFileChange}
                  onRemove={() => removeImage("ceoImage")}
                />
                <InputField
                  label="Required Documents"
                  name="requiredDocuments"
                  value={formData.requiredDocuments}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <InputField
                      label="Add Department"
                      name="newDepartment"
                      value={formData.newDepartment}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      onClick={handleAddDepartment}
                      className="px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors shadow-sm text-base"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.departments.map((dept, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-sky-50 px-2 py-1 rounded-full text-xs text-sky-800"
                      >
                        <span className="mr-1">{dept}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDepartment(dept)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Contact Email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="email"
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="tel"
              />
              <InputField
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="url"
              />
              <InputField
                label="Social Links"
                name="socialLinks"
                value={formData.socialLinks}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarAdmin />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-3 bg-gradient-to-r from-sky-100 to-sky-200 rounded-t-sm">
            <h2 className="text-sky-900 mt-1 text-base opacity-90">Complete the steps to update your company details</h2>
          </div>

          <div className="px-6 pt-3 pb-6">
            <ProgressBar currentStep={currentStep} setStep={setCurrentStep} isSubmitting={isSubmitting} />
            <form onSubmit={handleSubmit} className="space-y-2">
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

              <div className="flex justify-between pt-4 gap-6">
                <div className="flex gap-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg text-base font-medium hover:bg-red-200 transition-all shadow-sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg text-base font-medium hover:bg-sky-600 transition-all shadow-sm"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitClick}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg text-base font-medium hover:bg-sky-600 disabled:bg-sky-300 transition-all shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="w-4 h-4 mr-1" />
                        Save Changes
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}