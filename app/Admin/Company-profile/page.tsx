"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Company } from "@/app/types/company";
import Image from "next/image";
import { useAuth } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import AdminLayout from "@/AdminLayout";
import { 
  FiMail, FiPhone, FiGlobe, FiEdit3, FiUsers, FiMapPin, 
  FiCalendar, FiBriefcase, FiDollarSign, FiInfo, FiUser
} from "react-icons/fi";

export default function CompanyProfile() {
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoggedIn, isAuthLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      router.push("/login");
      return;
    }
    
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/companies/profile", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setCompany(response.data);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Error retrieving company profile");
        } else {
          setError("An unexpected error occurred.");
        }
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [isAuthLoaded, isLoggedIn, router]);

  const handleEditProfile = () => {
    router.push("/Admin/Edite-CompanyProfile");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="h-8 w-8 rounded-full border-t-2 border-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white p-5 rounded-xl shadow-sm max-w-md w-full">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 text-red-500">
            <FiInfo size={20} />
          </div>
          <h3 className="text-lg font-medium text-center text-gray-800 mb-2">Error</h3>
          <p className="text-center text-gray-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <AdminLayout>
      <div className="bg-white min-h-screen">
    <div className="max-w-screen-xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-3 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  <div className="flex items-center gap-2">
    <div className="p-1 rounded-lg">
      <Image
        src={company.companyLogo || "/images/default-companylogo.png"}
        alt="Company Logo"
        width={60}
        height={60}
        className="rounded-md object-cover"
        unoptimized
      />
    </div>
    <div>
  <h1 className="text-lg font-semibold text-gray-800">
    {company.companyName}
  </h1>
  {company.industry && (
    <p className="text-sm text-gray-500">{company.industry}</p>
  )}
</div>

  </div>

            <button
              onClick={handleEditProfile}
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition text-sm">
              <FiEdit3 size={14} /> Edit Profile
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Left Column */}
            <div className="space-y-2">
              {/* Company Overview */}
              <Card>
                <div className="p-3">
                  <h2 className="text-base font-medium text-gray-800 mb-3">{company.companyName}</h2>
                  <div className="flex justify-between mb-4 text-sm">
                    <Stat value={company.numberOfEmployees} label="Employees" />
                    <Stat value={company.departments?.length || 0} label="Departments" />
                    <Stat value={company.yearFounded} label="Founded" />
                  </div>
                 <div className="text-sm text-gray-600">
                <h3 className="font-medium text-gray-700 mb-1">About</h3>
                  <p className="leading-relaxed">
                    {company.companyDescription}
                      </p>
                   </div>
                </div>
              </Card>

              <Card>
                <div className="p-2">
                  <h2 className="text-base font-medium text-gray-800 mb-2">Contact Information</h2>
                  <div className="space-y-2">
                    <ContactItem icon={<FiMail size={18} />} text={company.contactEmail} />
                    <ContactItem icon={<FiPhone size={18} />} text={company.phoneNumber} />
                    {company.website && (
                      <ContactItem 
                        icon={<FiGlobe size={18} />} 
                        text={
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 transition"
                          >
                            {company.website}
                          </a>
                        }
                      />
                    )}
                    <ContactItem icon={<FiMapPin size={18} />} text={company.companyAddress} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Middle and Right Columns */}
            <div className="lg:col-span-2 space-y-2">
              {/* Company Details */}
              <Card>
                <div className="p-4">
                  <h2 className="text-base font-medium text-gray-800 mb-3">Company Details</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem icon={<FiMapPin size={14} />} title="Headquarters"  value={company.companyAddress} />
                    <InfoItem icon={<FiBriefcase size={14} />} title="Region" value={`${company.region}, ${company.country}`} />
                    <InfoItem icon={<FiCalendar size={14} />} title="Founded" value={company.yearFounded} />
                    <InfoItem icon={<FiUsers size={14} />} title="Company Size" value={company.companySize} />
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* CEO Information - Compact Version */}
                {(company.ceo || company.ceoImage) && (
                  <Card>
      <div className="flex items-center gap-4">
        {company.ceoImage ? (
          <Image
            src={company.ceoImage}
            alt="CEO"
            width={80}
            height={60}
            className="rounded-full object-cover border-2 border-gray-300 shadow-md"
            unoptimized
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
            <FiUser size={40} className="text-gray-500" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">CEO</h2>
          <p className="text-md text-gray-700">{company.ceo}</p>
        </div>
      </div>
    </Card>
                )}

                {/* Social Links - Compact Version with labels */}
                {company.socialLinks && (
                  <Card>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-md font-medium text-gray-800">Social Media</h2>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {company.socialLinks.split(",").map((link, index) => (
                          <a
                            key={index}
                            href={link.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-50 hover:bg-gray-100 rounded-md px-2 py-1 text-xs text-gray-700 transition flex items-center gap-1"
                          >
                            <SocialIcon link={link.trim()} />
                            {getSocialNetworkName(link.trim())}
                          </a>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Departments - Compact Version */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {company.departments && company.departments.length > 0 && (
                <Card>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-md font-medium text-gray-800">Departments</h2>
                      <span className="text-xs text-gray-500">{company.departments.length} total</span>
                    </div>
                    <div className="flex items-center gap-2">
                    {company.departments.map((dept) => (
                        <div
                          key={dept.id}
                          className="bg-gray-50 rounded-md px-4 py-1 text-xs font-medium text-gray-700"
                        >
                          {dept.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
              {/* Revenue if available - Compact Version */}
              {company.revenue && (
                <Card>
                  <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                  <h2 className="text-md font-medium text-gray-800">Financial Overview</h2>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">{company.revenue.toLocaleString()}</span>
                    </div>
                    </div>
                </Card>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Simplified components
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    {children}
  </div>
);

const Stat = ({ value, label }: { value: string | number, label: string }) => (
  <div className="text-center">
    <div className="text-base font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

const ContactItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string | React.ReactNode;
}) => (
  <div className="flex items-center gap-2 text-gray-700">
    <div className="text-gray-400">{icon}</div>
    <div className="text-xs">{text}</div>
  </div>
);

const InfoItem = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) => (
  <div className="bg-gray-50 rounded-md p-2 flex items-start gap-2">
    <div className="text-blue-500 mt-0.5">{icon}</div>
    <div>
      <div className="text-sm font-semibold text-gray-800">{title}</div>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  </div>
);

// Simplified utility functions
function getSocialNetworkName(url: string): string {
  if (url.includes('facebook')) return 'Facebook';
  if (url.includes('twitter') || url.includes('x.com')) return 'Twitter';
  if (url.includes('linkedin')) return 'LinkedIn';
  if (url.includes('instagram')) return 'Instagram';
  if (url.includes('youtube')) return 'YouTube';
  if (url.includes('github')) return 'GitHub';
  return 'Website';
}

function SocialIcon({ link }: { link: string }) {
  // Simple colored dot representing network
  if (link.includes('facebook')) return <div className="w-2 h-2 bg-blue-600 rounded-full" />;
  if (link.includes('twitter') || link.includes('x.com')) return <div className="w-2 h-2 bg-blue-400 rounded-full" />;
  if (link.includes('linkedin')) return <div className="w-2 h-2 bg-blue-700 rounded-full" />;
  if (link.includes('instagram')) return <div className="w-2 h-2 bg-pink-600 rounded-full" />;
  if (link.includes('youtube')) return <div className="w-2 h-2 bg-red-600 rounded-full" />;
  if (link.includes('github')) return <div className="w-2 h-2 bg-gray-900 rounded-full" />;
  return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
}