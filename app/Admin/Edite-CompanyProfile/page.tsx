"use client"; 
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa";
import NavbarAdmin from "@/app/components/NavbarAdmin";
import { motion } from "framer-motion";

export default function UpdateCompanyProfile() {
  const router = useRouter();
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [ceoImagePreview, setCeoImagePreview] = useState<string | null>(null);

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
    contractTypes: "",
    requiredDocuments: "",
    contactEmail: "",
    phoneNumber: "",
    website: "",
    socialLinks: "",
    ceo: "",
    ceoImage: null as File | null,
    revenue: "",
    newDepartment: "",
  });

  useEffect(() => {
    const fetchCompany = async () => {
      const res = await axios.get("http://localhost:5000/api/companies/profile", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });

      const company = res.data;

      setFormData({
        ...formData,
        ...company,
        companyLogo: null,
        ceoImage: null,
        departments: company.departments.map((d: any) => d.name),
      });

      setCompanyLogoPreview(company.companyLogo);
      setCeoImagePreview(company.ceoImage);
    };

    fetchCompany();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  return (
    <>
      <NavbarAdmin />
      <motion.form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-8 space-y-6 bg-gradient-to-r from-teal-500 to-blue-600 shadow-xl rounded-3xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-5xl font-extrabold text-center text-white leading-tight tracking-wide">
          Update Company Profile
        </h2>

        {/* Company Name */}
        <motion.div className="space-y-4">
          <label htmlFor="companyName" className="block text-lg font-medium text-white">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
            required
          />
        </motion.div>
        {/* Company Logo */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <label className="block text-lg font-medium text-white">Company Logo</label>
          <input
            type="file"
            name="companyLogo"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none hover:bg-gray-200 transition-all duration-300"
          />
          {companyLogoPreview && (
            <div className="mt-3 flex items-center gap-4">
              <img
                src={companyLogoPreview}
                alt="Company Logo"
                className="w-32 h-32 object-cover rounded-lg shadow-xl transform hover:scale-105 transition-all" />
              <button
                type="button"
                onClick={() => removeImage("companyLogo")}
                className="text-red-500 hover:text-red-700 transform hover:scale-110 transition-all"
              >
                <FaTrashAlt />
              </button>
            </div>
          )}
        </motion.div>
{/* Industry */}
<motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label htmlFor="industry" className="block text-lg font-medium text-white">Industry</label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="Enter industry"
            className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
            required
          />
        </motion.div>
        {/* CEO Name */}
        <motion.div className="space-y-4">
          <label htmlFor="ceo" className="block text-lg font-medium text-white">CEO Name</label>
          <input
            type="text"
            id="ceo"
            name="ceo"
            value={formData.ceo}
            onChange={handleChange}
            placeholder="Enter CEO name"
            className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
          />
        </motion.div>

        {/* CEO Image */}
        <motion.div className="space-y-4">
          <label className="block text-lg font-medium text-white">CEO Image</label>
          <input
            type="file"
            name="ceoImage"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none hover:bg-gray-200 transition-all duration-300"
          />
          {ceoImagePreview && (
            <div className="mt-3 flex items-center gap-4">
              <img
                src={ceoImagePreview}
                alt="CEO Image"
                className="w-32 h-32 object-cover rounded-lg shadow-xl transform hover:scale-105 transition-all"
              />
              <button
                type="button"
                onClick={() => removeImage("ceoImage")}
                className="text-red-500 hover:text-red-700 transform hover:scale-110 transition-all"
              >
                <FaTrashAlt />
              </button>
            </div>
          )}
        </motion.div>

        {/* Company Description */}
        <motion.div className="space-y-4">
          <label htmlFor="companyDescription" className="block text-lg font-medium text-white">Company Description</label>
          <textarea
            id="companyDescription"
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleChange}
            placeholder="Write a brief description of the company"
            className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
            required
          />
        </motion.div>
        {/* Revenue */}
<motion.div className="space-y-4">
  <label htmlFor="revenue" className="block text-lg font-medium text-white">Revenue</label>
  <input
    type="text"
    id="revenue"
    name="revenue"
    value={formData.revenue}
    onChange={handleChange}
    placeholder="Enter revenue"
    className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
  />
</motion.div>
{/* Company Address */}
<motion.div className="space-y-4">
  <label htmlFor="companyAddress" className="block text-lg font-medium text-white">Company Address</label>
  <input
    type="text"
    id="companyAddress"
    name="companyAddress"
    value={formData.companyAddress}
    onChange={handleChange}
    placeholder="Enter company address"
    className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
  />
</motion.div>

{/* Country */}
<motion.div className="space-y-4">
  <label htmlFor="country" className="block text-lg font-medium text-white">Country</label>
  <input
    type="text"
    id="country"
    name="country"
    value={formData.country}
    onChange={handleChange}
    placeholder="Enter country"
    className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
  />
</motion.div>

{/* Region */}
<motion.div className="space-y-4">
  <label htmlFor="region" className="block text-lg font-medium text-white">Region</label>
  <input
    type="text"
    id="region"
    name="region"
    value={formData.region}
    onChange={handleChange}
    placeholder="Enter region"
    className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
  />
</motion.div>

{/* Year Founded */}
<motion.div className="space-y-4">
  <label htmlFor="yearFounded" className="block text-lg font-medium text-white">Year Founded</label>
  <input
    type="text"
    id="yearFounded"
    name="yearFounded"
    value={formData.yearFounded}
    onChange={handleChange}
    placeholder="Enter year of foundation"
    className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
  />
</motion.div>

{/* Required Documents */}
<motion.div className="space-y-4">
  <label htmlFor="requiredDocuments" className="block text-lg font-medium text-white">Required Documents</label>
  <input
    type="text"
    id="requiredDocuments"
    name="requiredDocuments"
    value={formData.requiredDocuments}
    onChange={handleChange}
    placeholder="Enter required documents"
    className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
  />
</motion.div>

{/* Contact Email */}
<motion.div className="space-y-4">
  <label htmlFor="contactEmail" className="block text-lg font-medium text-white">Contact Email</label>
  <input
    type="email"
    id="contactEmail"
    name="contactEmail"
    value={formData.contactEmail}
    onChange={handleChange}
    placeholder="Enter contact email"
    className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
  />
</motion.div>

{/* Number of Employees */}
        <motion.div className="space-y-4">
          <label htmlFor="numberOfEmployees" className="block text-lg font-medium text-white">Number of Employees</label>
          <input
            type="text"
            id="numberOfEmployees"
            name="numberOfEmployees"
            value={formData.numberOfEmployees}
            onChange={handleChange}
            placeholder="Enter number of employees"
            className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
            required
          />
        </motion.div>

        {/*Comapny Size*/}
        <motion.div className="space-y-4">
          <label htmlFor="companySize" className="block text-lg font-medium text-white">Company Size</label>
          <input
            type="text"
            id="companySize"
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            placeholder="Enter your company size"
            className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
            required
          />
        </motion.div>

        {/* Contract Types */}
        <motion.div className="space-y-4">
          <label htmlFor="contractTypes" className="block text-lg font-medium text-white">Contract Types</label>
          <input
            type="text"
            id="contractTypes"
            name="contractTypes"
            value={formData.contractTypes}
            onChange={handleChange}
            placeholder="Enter contract types"
            className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
            required
          />
        </motion.div>

        {/* Phone Number */}
        <motion.div className="space-y-4">
          <label htmlFor="phoneNumber" className="block text-lg font-medium text-white">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
            required
          />
        </motion.div>

        {/* Website */}
        <motion.div className="space-y-4">
          <label htmlFor="website" className="block text-lg font-medium text-white">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Enter website"
            className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
          />
        </motion.div>

        {/* Social Links */}
        <motion.div className="space-y-4">
          <label htmlFor="socialLinks" className="block text-lg font-medium text-white">Social Links</label>
          <input
            type="text"
            id="socialLinks"
            name="socialLinks"
            value={formData.socialLinks}
            onChange={handleChange}
            placeholder="Enter social links"
            className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
          />
        </motion.div>

        {/* Departments 
<motion.div className="space-y-4">
  <label htmlFor="departments" className="block text-lg font-medium text-white">
    Departments
  </label>
  <input
    type="text"
    id="departments"
    name="departments"
    value={formData.departments.join(",")}  // Affiche les départements existants séparés par des virgules
    onChange={(e) => setFormData({ ...formData, departments: e.target.value.split(",") })}  // Permet de séparer les départements par des virgules lors de la saisie
    placeholder="Enter departments separated by commas"
    className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
  />
</motion.div>*/}
{/* Departments */}
<motion.div className="space-y-4">
  <label htmlFor="departments" className="block text-lg font-medium text-white">
    Departments
  </label>
  <div className="space-y-2">
    {/* Liste des départements existants */}
    {formData.departments.map((department, index) => (
      <div key={index} className="flex items-center gap-4">
        <span className="text-gray-900 bg-gray-200 px-3 py-1 rounded-lg shadow">
          {department}
        </span>
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              departments: prev.departments.filter((_, i) => i !== index),
            }))
          }
          className="text-red-500 hover:text-red-700 transform hover:scale-110 transition-all"
        >
          <FaTrashAlt />
        </button>
      </div>
    ))}
  </div>

  {/* Champ pour ajouter un nouveau département */}
  <div className="flex items-center gap-4">
    <input
      type="text"
      id="newDepartment"
      name="newDepartment"
      placeholder="Add a new department"
      value={formData.newDepartment || ""}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, newDepartment: e.target.value }))
      }
      className="w-full p-4 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-900 placeholder-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300"
    />
    <button
      type="button"
      onClick={() => {
        if (formData.newDepartment?.trim()) {
          setFormData((prev) => ({
            ...prev,
            departments: [...prev.departments, formData.newDepartment.trim()],
            newDepartment: "",
          }));
        }
      }}
      className="bg-teal-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-teal-600 transform hover:scale-105 transition-all"
    >
      Add
    </button>
  </div>
</motion.div>


        {/* Submit Buttons */}
        <motion.div
          className="flex justify-end gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          <button
            type="submit"
            className="bg-teal-500 text-white py-3 px-12 rounded-full shadow-lg hover:bg-teal-600 transform hover:scale-105 transition-all"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push("/Admin/Company-profile")}
            className="bg-gray-200 text-gray-700 py-3 px-12 rounded-full shadow-lg hover:bg-gray-300 transform hover:scale-105 transition-all"
          >
            Cancel
          </button>
        </motion.div>
      </motion.form>
    </>
  );
}
