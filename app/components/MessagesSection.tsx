import { Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function MessagesSection() {
  const messages = [
    {
      id: 1,
      name: "Ahmad Saadi",
      role: "DevOps Engineer",
      message: "I'm interested in the position. Could you clarify if remote work is allowed?",
      time: "1 hours ago",
    },
    {
      id: 2,
      name: "Salma Daraoui",
      role: "Data Analyst",
      message: "I had an interview last week and wanted to ask if there is any update regarding the next steps?",
      time: "1 day ago",
    },
    {
      id: 5,
      name: "Karim Boukhari",
      role: "Project Manager",
      message: "Just letting you know I will be unavailable for a call tomorrow. Can we reschedule?",
      time: "2 days ago",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Mail className="w-5 h-5 text-blue-600" />
        Messages
      </h2>
      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {messages.map((msg) => (
          <div key={msg.id} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-gray-900">{msg.name} <span className="text-sm text-gray-500">({msg.role})</span></div>
              <span className="text-sm text-gray-400">{msg.time}</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{msg.message}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
