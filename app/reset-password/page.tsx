'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Suspense } from 'react'; 

// Composant principal de la page
const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-blue-600 font-semibold mt-2">Loading...</span>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

// Composant contenant la logique avec useSearchParams et useRouter
const ResetPasswordContent = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Reset token is missing.');
    }
  }, [token]);

  useEffect(() => {
    setStrength(checkPasswordStrength(newPassword));
    setValidationErrors(getPasswordValidationErrors(newPassword));
  }, [newPassword]);

  const handlePasswordReset = async () => {
    if (!token) {
      setError('Token is missing in the URL.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (validationErrors.length > 0) {
      setError('Password does not meet security requirements.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:4000/api/users/reset-password', {
        token,
        password: newPassword,
      });
      setShowSuccessModal(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred.');
      } else {
        setError('An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const getPasswordValidationErrors = (password: string): string[] => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
    if (!/[0-9]/.test(password)) errors.push('At least one number');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('At least one special character');
    return errors;
  };

  const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500', 'bg-green-700'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 relative">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg flex flex-col items-center"
          >
            <div className="mb-4 flex flex-col items-center">
              <div className="bg-blue-100 rounded-full p-3 mb-2">
                <svg
                  width="36"
                  height="36"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-blue-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <span className="font-extrabold text-2xl text-blue-700 tracking-tight mb-1">SmartHire</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Password set successfully!</h3>
            <p className="text-gray-500 text-center mb-6 text-sm">
              Your password has been saved. You can now log in to your recruiter space.
            </p>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-base shadow"
              onClick={() => router.push('/login')}
            >
              Log in
            </button>
          </motion.div>
        </div>
      )}
      {/* Main Card */}
      <motion.div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex flex-col items-center mb-6">
          <span className="font-extrabold text-2xl text-blue-700 tracking-tight">SmartHire</span>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Set your password</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Please choose a secure password to activate your recruiter account.
        </p>
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-sm w-full text-center animate-shake">
            {error}
          </div>
        )}
        <form className="space-y-6 w-full" onSubmit={(e) => { e.preventDefault(); handlePasswordReset(); }}>
          <div className="relative">
            <label className="text-sm font-semibold text-gray-700 block mb-2">New password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              autoComplete="new-password"
              placeholder="Enter a password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                validationErrors.length > 0 && newPassword ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-blue-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {newPassword && (
              <>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className={`h-2 rounded ${strengthColors[strength]}`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Strength: <strong>{strengthLabels[strength]}</strong>
                  </p>
                </div>
                {validationErrors.length > 0 && (
                  <ul className="mt-2 text-xs text-red-600 list-disc list-inside space-y-1 animate-fade-in">
                    {validationErrors.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          <div className="relative">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Confirm password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-blue-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="h-1" />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-base shadow disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Setting...
              </span>
            ) : 'Set my password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;