"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/authContext";
import { fetchNotifications, markAllNotificationsAsRead } from "../../lib/notificationApi";
import { IoMdNotificationsOutline, IoMdArrowBack } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import NavbarCandidat from "@/app/components/NavbarCandidat";

export default function NotificationsPage() {
  const { candidatId } = useAuth();
  const [notifications, setNotifications] = useState<{ id: string; message: string; url?: string; read: boolean; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!candidatId) return;
    fetchNotifications(candidatId).then((data) => {
      setNotifications(data);
      setLoading(false);
      markAllNotificationsAsRead(candidatId);
    });
  }, [candidatId]);

  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="min-h-screen bg-white pb-10 px-2 md:px-0">
      <NavbarCandidat />
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-0 mt-12 border border-blue-100 overflow-hidden">
        <div className="relative flex items-center justify-center px-8 py-6 border-b bg-gradient-to-r from-blue-100/60 to-white">
          {/* Back arrow absolute left */}
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => window.history.back()}
            aria-label="Go back"
            type="button">
            <IoMdArrowBack className="text-blue-600" size={24} />
          </button>
          {/* Centered title with icon */}
          <span className="flex items-center gap-2 text-2xl font-bold text-blue-700">
            <IoMdNotificationsOutline className="text-blue-500" size={28} /> Notifications
          </span>
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-16 text-lg font-medium">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg width="72" height="72" fill="none" viewBox="0 0 24 24"><path fill="#cbd5e1" d="M12 2a7 7 0 0 0-7 7v3.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 12.586V9a7 7 0 0 0-7-7Zm0 20a3 3 0 0 1-2.995-2.824L9 19h6a3 3 0 0 1-2.824 2.995L12 22Z"/></svg>
            <span className="mt-6 text-lg">Vous n&apos;avez pas de notifications.</span>
          </div>
        ) : (
          <ul className="divide-y divide-blue-100">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`group flex items-start gap-4 px-8 py-6 transition-colors duration-200 relative hover:bg-blue-50/60 ${!notif.read ? "bg-blue-50/60" : "bg-white"}`}
              >
                <span className="mt-1 flex-shrink-0">
                  {notif.read ? (
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#60a5fa" d="M12 2a7 7 0 0 0-7 7v3.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 12.586V9a7 7 0 0 0-7-7Zm0 20a3 3 0 0 1-2.995-2.824L9 19h6a3 3 0 0 1-2.824 2.995L12 22Z"/></svg>
                  ) : (
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></span>
                  )}
                </span>

<div className="flex-1 min-w-0">
                  <div className={`text-base leading-snug ${!notif.read ? "font-semibold text-blue-900" : "text-gray-700"}`}>
                    {notif.message}
                    {notif.url && (
                      <div className="mt-2">
                        <a
                          href={`/Candidat/notification/visio?jitsiUrl=${encodeURIComponent(notif.url)}`}
                          className="text-blue-600 underline hover:text-blue-800 font-medium"
                        >
                          Rejoindre l&apos;entretien en visioconférence
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                    {timeAgo(notif.createdAt)}
                  </div>
                </div>
                {/* Ellipsis menu */}
                <div className="relative flex-shrink-0">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onClick={() => setOpenMenuId(openMenuId === notif.id ? null : notif.id)}
                    aria-label="Notification options"
                  >
                    <HiOutlineDotsHorizontal className="text-gray-500" size={20} />
                  </button>
                  {openMenuId === notif.id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-20 animate-fade-in">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-xl"
                        onClick={async () => {
                          await fetch(`/api/notifications/${notif.id}`, { method: "DELETE" });
                          setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
                          setOpenMenuId(null);
                        }}
                      >
                        Delete notification
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
