"use client";
import { useState } from "react";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import NavbarAdmin from "@/app/components/NavbarAdmin";

export default function CandidateRegisterPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError("Please agree to the Terms and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register/Candidat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname,username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/login/Candidat";
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      setError("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm space-y-4 transform scale-110">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First and Last Name */}
            <div className="flex gap-2">
              <div className="relative w-1/2">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="relative w-1/2">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
{/* Username */}
<div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>

            {/* Terms */}
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mr-2"
                required
              />
              I agree to the{" "}
              <a href="#" className="text-blue-600 underline ml-1">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 underline ml-1">
                Privacy Policy
              </a>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-[#007bff] to-[#0056b3] hover:opacity-90 text-white font-semibold py-1.5 rounded-lg transition">
         Sign Up
            </button>
          </form>

          {/* Alternative signup with social media */}
          <div className="text-center mt-6">
            <div className="relative w-full flex items-center justify-center mb-4">
              <div className="absolute w-full h-px bg-gray-300" />
              <span className="bg-white px-4 text-sm text-gray-500 relative z-10">
                Or Sign Up With
              </span>
            </div>

            <div className="flex justify-center gap-6">
              <button>
                <img
                  src="/icons/icons8-google.svg"
                  alt="Google"
                  className="w-6 h-6 hover:scale-110 transition"
                />
              </button>
              <button>
                <img
                  src="/icons/icons8-microsoft.svg"
                  alt="Microsoft"
                  className="w-6 h-6 hover:scale-110 transition"
                />
              </button>
            </div>

            <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
              <Link href="/login/Candidat" className="text-blue-600 font-medium ml-1 hover:underline  border-red-500 z-50 relative">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
