import { FaRobot, FaUserCheck, FaClipboardList } from "react-icons/fa";

export default function FeaturesAndMotivationSection() {
  const features = [
    {
      icon: <FaRobot className="text-blue-600 text-4xl mb-4" />,
      title: "AI-Powered Screening",
      desc: "Automate candidate filtering and shortlisting with smart algorithms to save recruiters valuable time.",
    },
    {
      icon: <FaUserCheck className="text-blue-600 text-4xl mb-4" />,
      title: "Smart Candidate Matching",
      desc: "Match job openings with the best-fit candidates using intelligent matching based on skills, experience, and preferences.",
    },
    {
      icon: <FaClipboardList className="text-blue-600 text-4xl mb-4" />,
      title: "Streamlined Recruitment Workflow",
      desc: "Manage the entire hiring process in one place—from posting to interview to offer—with built-in tracking tools.",
    },
  ];

  return (
    <section className="py-20 bg-white text-gray-800">
      <div className="container mx-auto text-center px-4">
        {/* Features */}
        <h2 className="text-4xl font-bold mb-12 text-blue-800">Platform Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-blue-50 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                {feature.icon}
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Motivation */}
        <h2 className="text-4xl font-bold text-blue-900 mb-6">
          Empower Your Recruitment Journey
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
          Whether you're a candidate seeking the perfect job or a recruiter aiming for faster, smarter hiring, our AI-driven platform transforms the way you connect and collaborate.
        </p>
        <a
          href="#search"
          className="inline-block bg-blue-600 text-white py-3 px-10 rounded-full text-lg font-medium shadow-md hover:bg-blue-700 hover:scale-105 transition-all"
        >
          Get Started Now
        </a>
      </div>
    </section>
  );
}
