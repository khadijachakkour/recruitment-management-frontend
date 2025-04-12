"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa";

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
    newDepartment: "",
    contractTypes: "",
    requiredDocuments: "",
    contactEmail: "",
    phoneNumber: "",
    website: "",
    socialLinks: "",
    ceo: "",
    ceoImage: null as File | null,
    revenue: "",
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

      await axios.put(`http://localhost:5000/api/companies/updateProfile`, payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });

      router.push("/Admin/Dashboard");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold">Update Company Profile</h2>

      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" className="w-full border p-2 rounded" required />

      <input type="file" name="companyLogo" onChange={handleFileChange} accept="image/*" />
      {companyLogoPreview && (
        <div>
          <img src={companyLogoPreview} alt="Preview" className="w-24 h-24 object-cover rounded" />
          <button type="button" onClick={() => removeImage("companyLogo")}><FaTrashAlt /></button>
        </div>
      )}

      <select name="industry" value={formData.industry} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Select Industry</option>
        <option value="Aerospace & Defense">Aerospace & Defense</option>
        <option value="Management & Consulting">Management & Consulting</option>
        <option value="Other">Other</option>
      </select>

      {formData.industry === "Other" && (
        <input type="text" name="otherIndustry" value={formData.otherIndustry} onChange={handleChange} placeholder="Other Industry" className="w-full border p-2 rounded" />
      )}

      <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

      <input type="text" name="ceo" value={formData.ceo} onChange={handleChange} placeholder="CEO / Founder" className="w-full border p-2 rounded" />

      <input type="file" name="ceoImage" onChange={handleFileChange} accept="image/*" />
      {ceoImagePreview && (
        <div>
          <img src={ceoImagePreview} alt="Preview" className="w-24 h-24 object-cover rounded" />
          <button type="button" onClick={() => removeImage("ceoImage")}><FaTrashAlt /></button>
        </div>
      )}

      <input type="text" name="revenue" value={formData.revenue} onChange={handleChange} placeholder="Revenue" className="w-full border p-2 rounded" />
      <input type="text" name="companyAddress" value={formData.companyAddress} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" />
      <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full border p-2 rounded" />
      <input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="Region" className="w-full border p-2 rounded" />
      <input type="text" name="yearFounded" value={formData.yearFounded} onChange={handleChange} placeholder="Year Founded" className="w-full border p-2 rounded" />
      <input type="text" name="companySize" value={formData.companySize} onChange={handleChange} placeholder="Company Size" className="w-full border p-2 rounded" />
      <input type="number" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} placeholder="Employees" className="w-full border p-2 rounded" />
      <input type="text" name="departments" value={formData.departments.join(",")} onChange={(e) => setFormData({ ...formData, departments: e.target.value.split(",") })} placeholder="Departments (comma separated)" className="w-full border p-2 rounded" />
      <input type="text" name="newDepartment" value={formData.newDepartment} onChange={handleChange} placeholder="New Department (optional)" className="w-full border p-2 rounded" />
      <input type="text" name="contractTypes" value={formData.contractTypes} onChange={handleChange} placeholder="Contract Types" className="w-full border p-2 rounded" />
      <input type="text" name="requiredDocuments" value={formData.requiredDocuments} onChange={handleChange} placeholder="Required Documents" className="w-full border p-2 rounded" />
      <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="Contact Email" className="w-full border p-2 rounded" />
      <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full border p-2 rounded" />
      <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Website" className="w-full border p-2 rounded" />
      <input type="text" name="socialLinks" value={formData.socialLinks} onChange={handleChange} placeholder="Social Links" className="w-full border p-2 rounded" />

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update Profile</button>
    </form>
    );
}
