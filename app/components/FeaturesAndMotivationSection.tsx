import { FaRobot, FaUserCheck, FaClipboardList, FaChartBar, FaUsersCog, FaFileSignature, FaSearch, FaBell } from "react-icons/fa";

export default function FeaturesAndMotivationSection() {
  const candidateFeatures = [
    {
      icon: <FaSearch className="text-blue-600 text-3xl mb-3" />,
      title: "AI-Powered Job Matching",
      desc: "Receive job offers tailored to your profile, skills, and career goals using intelligent algorithms.",
    },
    {
      icon: <FaClipboardList className="text-blue-600 text-3xl mb-3" />,
      title: "Smart Application Tracker",
      desc: "Easily track all your job applications and get real-time updates from recruiters.",
    },
    {
      icon: <FaChartBar className="text-blue-600 text-3xl mb-3" />,
      title: "Career Analytics",
      desc: "Visualize your progress, get personalized recommendations, and stay ahead in your job search.",
    },
  ];

  const recruiterFeatures = [
    {
      icon: <FaUsersCog className="text-blue-600 text-3xl mb-3" />,
      title: "Automated Candidate Screening",
      desc: "Save time with intelligent filtering and shortlisting of the most relevant applicants.",
    },
    {
      icon: <FaFileSignature className="text-blue-600 text-3xl mb-3" />,
      title: "Streamlined Hiring Process",
      desc: "Manage the recruitment lifecycle from posting to onboarding, all in one platform.",
    },
    {
      icon: <FaBell className="text-blue-600 text-3xl mb-3" />,
      title: "Real-Time Alerts",
      desc: "Stay informed of new candidates and application status changes instantly.",
    },
  ];

  return (
    <section className="py-20 bg-white text-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-blue-800 mb-4">Empowering All Users</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Whether you're a job seeker or a hiring manager, our platform uses Artificial Intelligence to simplify, accelerate, and personalize the recruitment experience.
        </p>

        {/* Candidate Features */}
        <h3 className="text-2xl font-semibold text-blue-700 mb-6">For Candidates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {candidateFeatures.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-blue-50 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                {feature.icon}
                <h4 className="text-xl font-semibold text-blue-700 mb-2">{feature.title}</h4>
                <p className="text-gray-700 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recruiter Features */}
        <h3 className="text-2xl font-semibold text-blue-700 mb-6">For Recruiters & HR Managers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recruiterFeatures.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-blue-50 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                {feature.icon}
                <h4 className="text-xl font-semibold text-blue-700 mb-2">{feature.title}</h4>
                <p className="text-gray-700 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Revolutionize the Way You Recruit or Get Hired</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Unlock the power of automation and intelligence in recruitment. Whether you're finding a job or the perfect hire, our platform is built for your success.
        </p>
        <a
          href="#get-started"
          className="inline-block bg-blue-600 text-white py-3 px-10 rounded-full text-lg font-medium shadow-md hover:bg-blue-700 hover:scale-105 transition-all"
        >
          Get Started Now
        </a>
      </div>
    </section>
  );
}
