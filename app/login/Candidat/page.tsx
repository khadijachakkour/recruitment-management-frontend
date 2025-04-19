"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { login } from "@/src/services/authService";
import { jwtDecode } from "jwt-decode";
import NavbarCandidat from "../../components/NavbarCandidat";
import { DecodedToken } from "@/app/types/DecodedToken";
import Image from "next/image";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const accessToken = await login(email, password);
      if (accessToken) {
        const decodedToken: DecodedToken = jwtDecode(accessToken);
        const roles = decodedToken?.realm_access?.roles || [];

        if (roles.includes("Candidat")) {
          router.push("/Candidat/dashboard");
        } else {
          setErrorMessage("You are not authorized to access this page.");
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Login error: Please check your credentials.");
    }
  };

  return (
    <>
      <NavbarCandidat />
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-6"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-800 text-center">Sign in</h2>
            <p className="text-sm text-gray-500 text-center">Access your Candidat account</p>
          </div>
          {/* Social buttons */}
                    <div className="flex space-x-3">
                      <button className="flex-1 flex items-center justify-center border rounded-lg py-2 px-4 hover:bg-gray-100 transition">
                        <Image src="/icons/icons8-google.svg" alt="Google" width={20} height={20} />
                        <span className="ml-2 text-sm font-medium">Google</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center border rounded-lg py-2 px-4 hover:bg-gray-100 transition">
                        <Image src="/icons/icons8-microsoft.svg" alt="Microsoft" width={20} height={20} />
                        <span className="ml-2 text-sm font-medium">Microsoft</span>
                      </button>
                    </div>
         
                    <div className="relative text-center text-gray-400 text-sm">
            <span className="px-2 bg-white relative z-10">or continue with email</span>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 z-0"></div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-[#007bff] to-[#0056b3] hover:opacity-90 text-white font-semibold py-2 rounded-lg transition"
            >
              Sign in
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register/Candidat" className="text-blue-600 font-medium ml-1 hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
