"use client";
import React, { useEffect, useState } from 'react';
import { getRecruteurProfile, updateRecruteurProfile } from '@/src/services/profileService';
import RecruteurLayout from "@/RecruteurLayout";
import { Loader2 } from 'lucide-react';

const RecruteurProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const data = await getRecruteurProfile();
      setProfile(data);
      setForm({
        firstname: data.firstName || '',
        lastname: data.lastName || '',
        email: data.email || '',
        username: data.username || '',
        password: '',
      });
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateRecruteurProfile(form);
    setProfile({ ...profile, ...form });
    setEditMode(false);
    setLoading(false);
  };

  if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-white">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      );
    }

  return (
    <RecruteurLayout>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-100/50 flex flex-col md:flex-row gap-2">
          {/* Edit Icon Button */}
          {!editMode && (
            <button
              className="absolute top-6 right-6 text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => setEditMode(true)}
              aria-label="Edit Profile"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213l-4.182.545a.75.75 0 0 1-.848-.848l.545-4.182L16.862 4.487z" />
              </svg>
            </button>
          )}
          {/* Avatar */}
          <div className="flex flex-col items-center md:items-start md:justify-center md:w-1/3">
            {profile?.firstName && profile?.lastName ? (
              <div className="w-32 h-32 rounded-full border-4 border-blue-200 shadow mb-4 flex items-center justify-center bg-blue-100 text-blue-700 text-4xl font-bold select-none">
                {profile.firstName.charAt(0).toUpperCase()}{profile.lastName.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-blue-200 shadow mb-4 flex items-center justify-center bg-gray-200 text-gray-400 text-4xl font-bold select-none">
                ?
              </div>
            )}
          </div>
          {/* Profile Info or Edit Form */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-left">Recruiter Profile</h1>
            {!editMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="text-gray-600 font-semibold">First Name:</div>
                <div className="text-gray-900">{profile?.firstName}</div>
                <div className="text-gray-600 font-semibold">Last Name:</div>
                <div className="text-gray-900">{profile?.lastName}</div>
                <div className="text-gray-600 font-semibold">Email:</div>
                <div className="text-gray-900">{profile?.email}</div>
                <div className="text-gray-600 font-semibold">Username:</div>
                <div className="text-gray-900">{profile?.username}</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input name="firstname" value={form.firstname} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input name="lastname" value={form.lastname} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input name="email" value={form.email} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input name="username" value={form.username} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Password <span className="text-xs text-gray-400">(leave blank to keep current)</span></label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400" />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all">Save</button>
                  <button type="button" className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition-all" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </RecruteurLayout>
  );
};

export default RecruteurProfilePage;
