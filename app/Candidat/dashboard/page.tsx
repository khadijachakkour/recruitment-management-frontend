"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  MessageSquare,
  Search,
  User,
  Home,
  LogOut,
} from "lucide-react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Image from "next/image";

const customStyle = `
#nprogress {
  pointer-events: none;
}
#nprogress .bar {
  background: #4f46e5;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  border-radius: 2px;
}
`;

export default function DashboardCandidat() {
  const [applications] = useState([
    { title: "Frontend Developer", company: "Web Solutions", status: "Interview" },
    { title: "Backend Developer", company: "Code Masters", status: "Pending" },
  ]);

  useEffect(() => {
    NProgress.start();
    setTimeout(() => {
      NProgress.done();
    }, 800);
  }, []);

  return (
    <>
      <style>{customStyle}</style>

      <div className="flex min-h-screen bg-gray-50">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white shadow-md border-r border-gray-200 hidden md:flex flex-col fixed top-0 left-0 h-full z-40">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-indigo-600">Candidat</h2>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-3">
            <SidebarLink href="/dashboard-candidat" icon={<Home size={18} />} text="Dashboard" />
            <SidebarLink href="/jobs" icon={<Search size={18} />} text="Offres" />
            <SidebarLink href="/applications" icon={<FileText size={18} />} text="Postuler" />
            <SidebarLink href="/evaluations" icon={<Briefcase size={18} />} text="Évaluation" />
            <SidebarLink href="/candidature-status" icon={<User size={18} />} text="Suivi" />
            <SidebarLink href="/companies" icon={<Search size={18} />} text="Entreprises" />
            <SidebarLink href="/messages" icon={<MessageSquare size={18} />} text="Messagerie" />
          </nav>
          <div className="p-4 border-t">
            <SidebarLink href="/logout" icon={<LogOut size={18} />} text="Déconnexion" />
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 md:ml-64 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Bienvenue sur votre espace candidat
            </h2>
            <p className="text-gray-500 mt-1">
              Retrouvez ici tout ce dont vous avez besoin pour suivre votre parcours.
            </p>
          </div>

          {/* Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <DashboardCard
              title="Consulter les offres"
              icon={<Search size={28} />}
              description="Trouvez des offres avec nos filtres intelligents."
              link="/jobs"
            />
            <DashboardCard
              title="Postuler à des offres"
              icon={<FileText size={28} />}
              description="Envoyez CV et lettre en quelques clics."
              link="/applications"
            />
            <DashboardCard
              title="Évaluation"
              icon={<Briefcase size={28} />}
              description="Tests et entretiens en ligne."
              link="/evaluations"
            />
            <DashboardCard
              title="Suivi des candidatures"
              icon={<User size={28} />}
              description="Suivez vos candidatures en temps réel."
              link="/candidature-status"
            />
            <DashboardCard
              title="Entreprises"
              icon={<Search size={28} />}
              description="Consultez les profils des entreprises."
              link="/companies"
            />
            <DashboardCard
              title="Messagerie"
              icon={<MessageSquare size={28} />}
              description="Discutez avec les recruteurs."
              link="/messages"
            />
          </motion.div>

          {/* Applications récentes */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Mes candidatures récentes
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4">Poste</th>
                    <th className="text-left p-4">Entreprise</th>
                    <th className="text-left p-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4">{app.title}</td>
                      <td className="p-4">{app.company}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === "Interview"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function SidebarLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-50 transition cursor-pointer text-gray-700 hover:text-indigo-600 font-medium">
        {icon}
        <span>{text}</span>
      </div>
    </Link>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  link,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <Link href={link}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col space-y-4 border border-gray-100"
      >
        <div className="text-indigo-600">{icon}</div>
        <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </motion.div>
    </Link>
  );
}
