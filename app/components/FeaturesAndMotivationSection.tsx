import {FaClipboardList, FaChartBar, FaUsersCog, FaFileSignature, FaSearch, FaBell } from "react-icons/fa";

export default function FeaturesAndMotivationSection() {
  const candidateFeatures = [
    {
      icon: <FaSearch className="text-blue-600 text-2xl mb-2" />, // Réduction de la taille de l'icône
      title: "AI-Powered Job Matching",
      desc: "Receive job offers tailored to your profile, skills, and career goals using intelligent algorithms.",
    },
    {
      icon: <FaClipboardList className="text-blue-600 text-2xl mb-2" />, // Réduction de la taille de l'icône
      title: "Smart Application Tracker",
      desc: "Easily track all your job applications and get real-time updates from recruiters.",
    },
    {
      icon: <FaChartBar className="text-blue-600 text-2xl mb-2" />, // Réduction de la taille de l'icône
      title: "Career Analytics",
      desc: "Visualize your progress, get personalized recommendations, and stay ahead in your job search.",
    },
  ];

  const recruiterFeatures = [
    {
      icon: <FaUsersCog className="text-blue-600 text-2xl mb-2" />, // Réduction de la taille de l'icône
      title: "Automated Candidate Screening",
      desc: "Save time with intelligent filtering and shortlisting of the most relevant applicants.",
    },
    {
      icon: <FaFileSignature className="text-blue-600 text-2xl mb-2" />, // Réduction de la taille de l'icône
      title: "Streamlined Hiring Process",
      desc: "Manage the recruitment lifecycle from posting to onboarding, all in one platform.",
    },
    {
      icon: <FaBell className="text-blue-600 text-2xl mb-2" />, // Réduction de la taille de l'icône
      title: "Real-Time Alerts",
      desc: "Stay informed of new candidates and application status changes instantly.",
    },
  ];

  return (
    <section className="py-12 bg-white text-gray-800"> {/* Réduction du padding vertical */}
      <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-semibold text-blue-800 mb-3"> {/* Réduction de la taille du titre */}
      Easy Steps to Find Top Talent or Your Dream Job with Our Platform
      </h2>
        <p className="text-sm text-gray-600 mb-8 max-w-xl mx-auto"> {/* Réduction de la taille du texte */}
          Whether you&apos;re a job seeker or a hiring manager, our platform uses Artificial Intelligence to simplify, accelerate, and personalize the recruitment experience.
        </p>

        {/* Candidate Features */}
        <h3 className="text-xl font-semibold text-blue-700 mb-4"> {/* Réduction de la taille du titre */}
          For Candidates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"> {/* Réduction de l'espacement */}
          {candidateFeatures.map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md hover:scale-102 transition-all duration-200" // Réduction de la taille de la carte
            >
              <div className="flex flex-col items-center">
                {feature.icon}
                <h4 className="text-lg font-semibold text-blue-700 mb-2">{feature.title}</h4> {/* Réduction de la taille du titre */}
                <p className="text-sm text-gray-700">{feature.desc}</p> {/* Réduction de la taille du texte */}
              </div>
            </div>
          ))}
        </div>

        {/* Recruiter Features */}
        <h3 className="text-xl font-semibold text-blue-700 mb-4"> {/* Réduction de la taille du titre */}
          For Recruiters & HR Managers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"> {/* Réduction de l'espacement */}
          {recruiterFeatures.map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md hover:scale-102 transition-all duration-200" // Réduction de la taille de la carte
            >
              <div className="flex flex-col items-center">
                {feature.icon}
                <h4 className="text-lg font-semibold text-blue-700 mb-2">{feature.title}</h4> {/* Réduction de la taille du titre */}
                <p className="text-sm text-gray-700">{feature.desc}</p> {/* Réduction de la taille du texte */}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <h2 className="text-2xl font-semibold text-blue-900 mb-3"> {/* Réduction de la taille du titre */}
          Revolutionize the Way You Recruit or Get Hired
        </h2>
        <p className="text-sm text-gray-700 mb-6 max-w-xl mx-auto"> {/* Réduction de la taille du texte */}
          Unlock the power of automation and intelligence in recruitment. Whether you&apos;re finding a job or the perfect hire, our platform is built for your success.
        </p>
        <a
          href="#get-started"
          className="inline-block bg-blue-600 text-white py-3 px-8 rounded-full text-sm font-medium shadow-sm hover:bg-blue-700 hover:scale-105 transition-all"
        >
          Get Started Now
        </a>
      </div>
    </section>
  );
}
