"use client";

import Link from "next/link";
import "../styles/navbarCandidat.css";
import { useAuth } from "@/src/context/authContext";
import { FaUserCircle } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { fetchNotifications, fetchUnreadNotificationCount, markAllNotificationsAsRead } from "../lib/notificationApi";
import { io, Socket } from "socket.io-client";

export default function NavbarCandidat() {
  const { isLoggedIn, userRoles,candidatId, logoutCandidat } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

useEffect(() => {
    if (!candidatId) return;

    fetchUnreadNotificationCount(candidatId).then(setUnreadCount);

    // Crée le socket ici pour notifications temps réel
    const socket: Socket = io('http://localhost:4005', { withCredentials: true });
    socket.emit('join', candidatId);

    socket.on('notification', async () => {
      const count = await fetchUnreadNotificationCount(candidatId);
      setUnreadCount(count);
      if (showDropdown) {
        const notifs = await fetchNotifications(candidatId);
        setNotifications(notifs);
      }
    });
    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, [candidatId, showDropdown]);

  const handleBellClick = async () => {
    if (!candidatId) return;
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      const notifs = await fetchNotifications(candidatId);
      setNotifications(notifs);
      await markAllNotificationsAsRead(candidatId);
      setUnreadCount(0);
    }
  };

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center p-1.5">
        <Link href="/Candidat/dashboard" className="navbar__logo text-lg">SmartHire</Link>

        {!isLoggedIn && (
          <ul className="hidden md:flex space-x-4 navbar__nav">
            <li><Link href="#" className="navbar__nav-item text-sm">Find Jobs</Link></li>
            <li><Link href="#" className="navbar__nav-item text-sm">Companies</Link></li>
            <li><Link href="#" className="navbar__nav-item text-sm">Candidates</Link></li>
            <li><Link href="#" className="navbar__nav-item text-sm">Blog</Link></li>
          </ul>
        )}

        <div className="navbar__button-container">
          {/* Display user profile and logout button if the user is logged in */}
          {isLoggedIn && userRoles.includes("Candidat") ? (
            <>
              <div className="hidden md:flex space-x-4 mr-4">
                <Link href="/Candidat/dashboard" className="navbar__nav-item text-sm">Dashboard</Link>
                <Link href="/Candidat/Listoffres" className="navbar__nav-item text-sm">Jobs</Link>
                <Link href="/applications" className="navbar__nav-item text-sm">Apply</Link>
                <Link href="/evaluations" className="navbar__nav-item text-sm">Evaluation</Link>
                <Link href="/candidature-status" className="navbar__nav-item text-sm">Tracking</Link>
                <Link href="/companies" className="navbar__nav-item text-sm">Companies</Link>
                <Link href="/messages" className="navbar__nav-item text-sm">Messaging</Link>
              </div>
              {/* Notification Icon */}
              <div className="relative flex items-center mr-2">
                      <button className="navbar__icon-link relative" onClick={handleBellClick}>
                        <IoMdNotificationsOutline className="navbar__notification-icon" size={28} />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-bounce shadow-lg">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                      {/* Dropdown notifications - affiche SEULEMENT les non lues */}
                      {showDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-blue-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-fade-in">
                          <div className="flex items-center justify-between p-4 border-b font-bold text-blue-700 bg-blue-50 rounded-t-xl">
                            <span className="flex items-center gap-2">
                              <IoMdNotificationsOutline className="text-blue-500" size={22} /> Notifications
                            </span>
                            <Link href="/Candidat/notification" className="text-xs text-blue-600 hover:underline font-semibold">
                              See all
                            </Link>
                          </div>
                          {notifications.filter(n => !n.read).length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                                <path fill="#cbd5e1" d="M12 2a7 7 0 0 0-7 7v3.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 12.586V9a7 7 0 0 0-7-7Z"/>
                                <path fill="#60a5fa" d="M15.5 17a3.5 3.5 0 0 1-7 0h7Z"/>
                                <path fill="#93c5fd" d="M9 17a3 3 0 0 0 6 0H9Z"/>
                                <circle cx="12" cy="10" r="1.5" fill="#60a5fa"/>
                                <path stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" d="M8.5 13.5c.5.5 1.5 1 3.5 1s3-.5 3.5-1"/>
                              </svg>
                              <span className="mt-2">No unread notifications</span>
                            </div>
                          ) : (
                            <ul className="divide-y divide-blue-100">
                              {notifications.filter(n => !n.read).map((notif) => (
                                <li
                                  key={notif.id}
                                  className="flex items-start gap-3 p-4 transition-colors duration-200 cursor-pointer hover:bg-blue-50 group bg-blue-50"
                                >
                                  <span className="mt-1">
                                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></span>
                                  </span>
                                  <div className="flex-1">
                                    <div className="text-sm font-semibold text-blue-900">{notif.message}</div>
                                    <div className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
              <Link href="/Candidat/Profile" className="navbar__icon-link">
                <FaUserCircle className="navbar__profile-icon" size={30} />
              </Link>
              <button onClick={logoutCandidat} className="navbar__connexion text-sm">Logout</button>
            </>
          ) : (
            /* Display sign-in and post job buttons if the user is not logged in */
            <div className="hidden md:flex space-x-4">
              <Link href="/login/Candidat" className="navbar__connexion text-sm">Sign In</Link>
              <Link href="/login" className="navbar__entreprises text-sm">Employers / Post Job</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
