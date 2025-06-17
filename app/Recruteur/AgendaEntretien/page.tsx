"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecruteurLayout from '@/RecruteurLayout';
import { CalendarDaysIcon, VideoCameraIcon, UserGroupIcon, MapPinIcon, ArrowLeftIcon, ArrowRightIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface Entretien {
  id: string;
  date: string;
  type: string;
  lieu: string;
  statut: string;
  candidatureId: string;
  offer_id?: string;
  candidate?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

type ViewMode = "month" | "week" | "day";

const AgendaEntretienPage = () => {
  const [entretiens, setEntretiens] = useState<Entretien[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchEntretiens = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get("http://localhost:4000/api/users/userId", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        if (data.userId) {
          const res = await axios.get(`http://localhost:3004/api/entretiens/recruteur/${data.userId}`);
          setEntretiens(res.data);
        }
      } catch {
        setError("Error loading interviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntretiens();
  }, []);

  // Helpers for calendar views
  function getStartOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
  function getWeekDays(date: Date) {
    const start = getStartOfWeek(date);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }
  function getMonthDays(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }
  function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  function getDayInterviews(day: Date) {
    return entretiens.filter(e => {
      if (!e.date) return false;
      const edate = new Date(e.date);
      return isSameDay(edate, day);
    });
  }

  // Navigation
  function changeDate(offset: number) {
    if (viewMode === "week") {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + offset * 7);
      setSelectedDate(d);
    } else if (viewMode === "month") {
      const d = new Date(selectedDate);
      d.setMonth(d.getMonth() + offset);
      setSelectedDate(d);
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + offset);
      setSelectedDate(d);
    }
  }

  let calendarDays: Date[] = [];
  if (viewMode === "week") {
    calendarDays = getWeekDays(selectedDate);
  } else if (viewMode === "month") {
    calendarDays = getMonthDays(selectedDate);
  } else {
    calendarDays = [selectedDate];
  }

  return (
    <RecruteurLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100 flex flex-col py-8 px-1 md:px-6 scale-[1.04]">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          </div>
          <div className="flex flex-wrap gap-2 items-center mb-6 bg-white/80 rounded-xl px-4 py-2 shadow border border-blue-100">
            <button onClick={() => setViewMode("day")}
              className={`px-3 py-1.5 rounded-lg font-semibold shadow transition-all duration-200 border ${viewMode === "day" ? "bg-blue-700 text-white border-blue-700 scale-105" : "bg-blue-100 text-blue-700 border-transparent hover:border-blue-300 hover:bg-blue-200"}`}>Day</button>
            <button onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-lg font-semibold shadow transition-all duration-200 border ${viewMode === "week" ? "bg-blue-700 text-white border-blue-700 scale-105" : "bg-blue-100 text-blue-700 border-transparent hover:border-blue-300 hover:bg-blue-200"}`}>Week</button>
            <button onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg font-semibold shadow transition-all duration-200 border ${viewMode === "month" ? "bg-blue-700 text-white border-blue-700 scale-105" : "bg-blue-100 text-blue-700 border-transparent hover:border-blue-300 hover:bg-blue-200"}`}>Month</button>
            <div className="flex gap-1 ml-3">
              <button onClick={() => changeDate(-1)} className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition border border-blue-200">
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
              <button onClick={() => changeDate(1)} className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition border border-blue-200">
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
            <span className="ml-4 text-base font-bold text-blue-900">
              {viewMode === "day" && selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              {viewMode === "week" && `Week of ${getWeekDays(selectedDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              {viewMode === "month" && selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          {loading ? (
            <div className="w-full flex flex-col items-center my-10">
              <div className="h-1 w-1/2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 animate-pulse rounded-b-xl mb-4" />
              <span className="text-blue-400 font-semibold animate-pulse text-base">Loading agenda...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 mb-6 font-semibold text-center bg-red-50 border border-red-200 rounded-xl py-3 flex items-center justify-center gap-2">
              <ExclamationCircleIcon className="w-5 h-5 text-red-400" /> {error}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-3 md:p-4">
              {/* Calendar grid */}
              <div className={`grid ${viewMode === "month" ? "grid-cols-7" : viewMode === "week" ? "grid-cols-7" : "grid-cols-1"} gap-1 md:gap-2 mb-8`}>
                {calendarDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-start p-1.5 md:p-2 rounded-lg border transition-all cursor-pointer min-h-[60px] md:min-h-[70px] group hover:shadow-md hover:border-blue-300 ${isSameDay(day, new Date()) ? "border-blue-500 bg-blue-50" : "border-blue-100 bg-white hover:bg-blue-50"} ${isSameDay(day, selectedDate) ? "ring-2 ring-blue-300" : ""}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span className={`text-[10px] font-bold mb-0.5 uppercase tracking-wide ${isSameDay(day, new Date()) ? "text-blue-700" : "text-gray-500"}`}>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className={`text-base font-extrabold ${isSameDay(day, new Date()) ? "text-blue-700" : "text-gray-700"}`}>{day.getDate()}</span>
                    {getDayInterviews(day).length > 0 && (
                      <span className="mt-1 text-[10px] bg-gradient-to-r from-blue-200 to-blue-100 text-blue-800 rounded-full px-2 py-0.5 font-semibold shadow-sm flex items-center gap-1">
                        <UserGroupIcon className="w-3 h-3 text-blue-500" />
                        {getDayInterviews(day).length} interview{getDayInterviews(day).length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* List interviews for selected day */}
              <div>
                <h4 className="text-base font-extrabold text-blue-900 mb-2 flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4 text-blue-400" />
                  Interviews on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                </h4>
                <ul className="space-y-2">
                  {getDayInterviews(selectedDate).length === 0 ? (
                    <li className="text-gray-400 text-sm flex items-center gap-2">
                      <ExclamationCircleIcon className="w-5 h-5 text-blue-200" />
                      No interviews scheduled for this day.
                    </li>
                  ) : (
                    getDayInterviews(selectedDate).map((e, idx) => (
                      <li key={e.id || idx} className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-xl px-3 py-2 flex flex-col md:flex-row md:items-center gap-2 shadow-sm hover:shadow-md transition-all">
                        <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                          {e.type === 'Visio' ? (
                            <VideoCameraIcon className="w-5 h-5 text-blue-500" />
                          ) : (
                            <MapPinIcon className="w-5 h-5 text-green-500" />
                          )}
                          {e.type === 'Visio' ? 'Video' : 'In-person'}
                        </span>
                        <span className="text-gray-700 font-medium flex items-center gap-1">
                          {e.candidate?.firstName} {e.candidate?.lastName}
                        </span>
                        <span className="text-gray-500 text-xs font-semibold">
                          {e.date ? new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                        <span className="text-gray-400 text-xs ml-auto flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" /> {e.lieu}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </RecruteurLayout>
  );
};

export default AgendaEntretienPage;
