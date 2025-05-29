"use client";

import { useRouter } from 'next/navigation';
import { User, Bot } from 'lucide-react';
import RecruteurLayout from '@/RecruteurLayout';

export default function ChooseJobTypePage() {
  const router = useRouter();

  return (
    <RecruteurLayout noSidebarMargin>
      <div className="flex items-center justify-center min-h-[80vh] w-full bg-white">
        <div className="flex flex-col items-center justify-center w-full max-w-4xl px-8 py-16">
          <h1 className="text-xl md:text-xl font-extrabold text-gray-900 text-center mb-2 tracking-tight">
            How would you like to create your job offer?
          </h1>

          <p className="mb-6 text-center text-gray-600 text-lg max-w-xl leading-relaxed">
            Choose between writing it yourself or letting our AI assistant do the work for you — fast, accurate, and professional.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
            {/* Manual creation */}
            <button
              onClick={() => router.push('/Recruteur/Jobs/Create')}
              className="group bg-white border border-blue-200 hover:border-blue-400 rounded-xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col items-center text-center hover:bg-blue-50"
            >
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 mb-3 transition-transform group-hover:scale-110">
                <User size={36} />
              </div>
              <span className="text-xl font-semibold text-gray-800 mb-1">Write offer manually</span>
              <span className="text-gray-500 text-base">Customize every detail of your job post</span>
            </button>

            {/* AI creation */}
            <button
              onClick={() => router.push('/Recruteur/Jobs/Create?ai=1')}
              className="group bg-white border border-green-200 hover:border-green-400 rounded-xl shadow-md hover:shadow-xl transition-all p-4 flex flex-col items-center text-center hover:bg-green-50"
            >
              <div className="bg-green-100 text-green-600 rounded-full p-2 mb-3 transition-transform group-hover:scale-110">
                <Bot size={36} />
              </div>
              <span className="text-xl font-semibold text-gray-800 mb-1">Write offer with AI</span>
              <span className="text-gray-500 text-base">Let AI draft a job post in seconds</span>
            </button>
          </div>

          <div className="mt-10 max-w-xl bg-white/80 border border-gray-200 rounded-lg p-3 text-center text-sm text-gray-600 shadow">
            Using AI will pre-fill the job post based on your company profile and the job title.{" "}
            <a href="#" className="text-blue-600 font-medium underline hover:text-blue-800">Learn more</a>
          </div>
        </div>
      </div>
    </RecruteurLayout>
  );
}
