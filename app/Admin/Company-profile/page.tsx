"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Company } from "@/app/types/company";
import Image from "next/image";
import { useAuth } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import AdminLayout from "@/AdminLayout";
import AdminHeader from "@/app/components/AdminHeader";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import { 
  FiMail, FiPhone, FiGlobe, FiEdit3, FiUsers, FiMapPin, 
  FiCalendar, FiBriefcase, FiInfo, FiUser, FiLinkedin, FiTwitter, FiFacebook, FiYoutube, FiGithub, FiInstagram
} from "react-icons/fi";

export default function CompanyProfile() {
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn, isAuthLoaded } = useAuth();
  const router = useRouter();

  // Configuration de l'API Gateway
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      router.push("/login");
      return;
    }
    
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/companies/profile`, {
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
            className="mt-4 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 text-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <>
      <SidebarAdmin isSidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}
        style={{ minWidth: 0, zoom: 0.85, background: 'white' }}
      >
        <AdminHeader sidebarOpen={sidebarOpen}/>
        <div className="h-6" /> 
        <div className="min-h-screen">
          <div className="max-w-screen-xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="bg-white/90 rounded-2xl shadow-lg p-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-blue-100 relative"> {/* p-5 to p-3, mb-6 to mb-4, gap-4 to gap-3 */}
              <div className="flex items-center gap-3"> {/* gap-4 to gap-3 */}
                <div className="p-0.5 rounded-xl bg-gradient-to-tr from-blue-100 to-blue-50 shadow-md"> {/* p-1 to p-0.5 */}
                  <Image
                    src={company.companyLogo && company.companyLogo.trim() !== "" ? company.companyLogo : "/images/default-companylogo.png"}
                    alt="Company Logo"
                    width={60}
                    height={60}
                    className="rounded-lg object-cover border-2 border-blue-200 shadow"
                    unoptimized
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {company.companyName}
                    {('verified' in company && company.verified) ? (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold border border-green-200">Verified</span>
                    ) : null}
                  </h1>
                  {company.industry && (
                    <p className="text-sm text-blue-500 font-medium mt-1">{company.industry}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-500 transition text-base font-semibold border border-blue-600/20"
              >
                <FiEdit3 size={18} /> Edit Profile
              </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> {/* Reduced gap from 8 to 4 */}
              {/* Left Column */}
              <div className="space-y-3"> {/* Reduced vertical spacing between cards */}
                {/* Company Overview */}
                <Card>
                  <div className="p-4"> {/* Reduced padding from 5 to 4 */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"> {/* mb-4 to mb-3 */}
                      Overview
                    </h2>
                    <div className="flex justify-between mb-4 text-sm gap-2"> {/* mb-5 to mb-4 */}
                      <Stat value={company.numberOfEmployees} label="Employees" color="blue" />
                      <Stat value={company.departments?.length || 0} label="Departments" color="indigo" />
                      <Stat value={company.yearFounded} label="Founded" color="green" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <h3 className="font-medium text-gray-700 mb-1">About</h3>
                      <p className="leading-relaxed text-gray-700 text-[15px] tracking-wide">
                        {company.companyDescription}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-3"> {/* Reduced padding from 4 to 3 */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Contact Information</h2> {/* mb-3 to mb-2 */}
                    <div className="space-y-2"> {/* space-y-3 to space-y-2 */}
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
                              className="text-blue-500 hover:text-blue-700 underline transition"
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
              <div className="lg:col-span-2 space-y-3"> {/* Reduced vertical spacing between cards */}
                {/* Company Details */}
                <Card>
                  <div className="p-4"> {/* Reduced padding from 6 to 4 */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Company Details</h2> {/* mb-4 to mb-3 */}
                    <div className="grid grid-cols-2 gap-3"> {/* gap-4 to gap-3 */}
                      <InfoItem icon={<FiMapPin size={16} />} title="Headquarters" value={company.companyAddress} />
                      <InfoItem icon={<FiBriefcase size={16} />} title="Region" value={`${company.region}, ${company.country}`} />
                      <InfoItem icon={<FiCalendar size={16} />} title="Founded" value={company.yearFounded} />
                      <InfoItem icon={<FiUsers size={16} />} title="Company Size" value={company.companySize} />
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {/* gap-6 to gap-3 */}
                  {/* CEO Information - Compact Version */}
                  {(company.ceo || company.ceoImage) && (
                    <Card>
                      <div className="flex items-center gap-4 p-3"> {/* gap-5 to gap-4, p-4 to p-3 */}
                        {company.ceoImage ? (
                          <Image
                            src={company.ceoImage}
                            alt="CEO"
                            width={60}
                            height={60}
                            className="rounded-full object-cover border-2 border-blue-200 shadow-md"
                            unoptimized
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                            <FiUser size={32} className="text-gray-500" />
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
                      <div className="p-3"> {/* p-4 to p-3 */}
                        <div className="flex items-center justify-between mb-1"> {/* mb-2 to mb-1 */}
                          <h2 className="text-lg font-semibold text-gray-800">Social Media</h2>
                        </div>
                        <div className="flex flex-wrap gap-1"> {/* gap-2 to gap-1 */}
                          {company.socialLinks.split(",").map((link, index) => (
                            <a
                              key={index}
                              href={link.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1 text-xs text-blue-700 font-medium transition flex items-center gap-2 shadow-sm border border-blue-100"
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

                {/* Departments and Revenue */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {/* gap-6 to gap-3 */}
                  {company.departments && company.departments.length > 0 && (
                    <Card>
                      <div className="p-3"> {/* p-4 to p-3 */}
                        <div className="flex items-center justify-between mb-2"> {/* mb-3 to mb-2 */}
                          <h2 className="text-lg font-semibold text-gray-800">Departments</h2>
                          <span className="text-xs text-gray-500">{company.departments.length} total</span>
                        </div>
                        <div className="flex flex-wrap gap-1"> {/* gap-2 to gap-1 */}
                          {company.departments.map((dept) => (
                            <div
                              key={dept.id}
                              className="bg-indigo-50 hover:bg-indigo-100 rounded-full px-4 py-1 text-xs font-semibold text-indigo-700 transition border border-indigo-100 shadow-sm"
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
                          <h2 className="text-lg font-semibold text-gray-800">Financial Overview</h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-green-700 bg-green-50 rounded px-2 py-0.5">
                            {typeof company.revenue === 'string' && typeof company.revenue === 'function'
                              ? company.revenue
                              : `$${company.revenue.toLocaleString()}`}
                          </span>
                          <span className="text-xs text-gray-500 font-medium italic tracking-wide">Annual Revenue</span>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Modernized Card
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
    {children}
  </div>
);

// Modernized Stat with color prop
const Stat = ({ value, label, color = "blue" }: { value: string | number, label: string, color?: string }) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    indigo: "bg-indigo-100 text-indigo-700",
    green: "bg-green-100 text-green-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <div className={`flex flex-col items-center px-3`}>
      <div className={`text-base font-bold rounded-full px-3 py-1 mb-1 ${colorMap[color] || colorMap.blue}`}>{value}</div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
  );
};

const ContactItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string | React.ReactNode;
}) => (
  <div className="flex items-center gap-3 text-gray-700">
    <div className="text-blue-400">{icon}</div>
    <div className="text-sm">{text}</div>
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
  <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-3 border border-blue-100">
    <div className="text-blue-500 mt-0.5">{icon}</div>
    <div>
      <div className="text-sm font-semibold text-gray-800">{title}</div>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  </div>
);

// Helper to get social network name from URL
function getSocialNetworkName(url: string): string {
  if (url.includes('linkedin')) return 'LinkedIn';
  if (url.includes('twitter')) return 'Twitter';
  if (url.includes('facebook')) return 'Facebook';
  if (url.includes('youtube')) return 'YouTube';
  if (url.includes('github')) return 'GitHub';
  if (url.includes('instagram')) return 'Instagram';
  return 'Website';
}

// Helper to render a social icon based on URL
function SocialIcon({ link }: { link: string }) {
  if (link.includes('linkedin')) return <FiLinkedin className="text-blue-700" size={16} />;
  if (link.includes('twitter')) return <FiTwitter className="text-sky-500" size={16} />;
  if (link.includes('facebook')) return <FiFacebook className="text-blue-600" size={16} />;
  if (link.includes('youtube')) return <FiYoutube className="text-red-500" size={16} />;
  if (link.includes('github')) return <FiGithub className="text-gray-800" size={16} />;
  if (link.includes('instagram')) return <FiInstagram className="text-pink-500" size={16} />;
  return <FiGlobe className="text-blue-400" size={16} />;
}