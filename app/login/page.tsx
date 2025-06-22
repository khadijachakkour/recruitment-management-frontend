//Login Page "Admin" "Manager" "Recruteur" "RH"
"use client";

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { login } from "@/src/services/authService";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/app/types/DecodedToken";
import Image from "next/image";
import Link from "next/link";
import NavbarAdmin from "../components/NavbarAdmin";
import { Loader2 } from "lucide-react";


export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const accessToken = await login(email, password);

      if (accessToken) {
        const decodedToken: DecodedToken = jwtDecode(accessToken);
        const roles = decodedToken?.realm_access?.roles || [];

        if (roles.includes("Admin")) {
          const response = await fetch(`${API_BASE_URL}/api/companies/profile`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.status === 204) {
            router.push("/Admin/Create-profile");
          } else {
            router.push("/Admin/Dashboard");
          }
        } else if (roles.includes("Recruteur")) {
          router.push("/Recruteur/Dashboard");
        } else if (roles.includes("Manager")) {
          router.push("/Manager/Dashboard");
        } else if (roles.includes("RH")) {
          router.push("/RH/Dashboard");
        } else {
          setErrorMessage("You are not authorized to access this page.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Login error: Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <>
  <NavbarAdmin />
    <div className="flex items-center justify-center min-h-screen px-4">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen bg-white w-full">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-4 scale-110 md:scale-125"
        >
          <div>
            <h2 className="text-xl font-bold text-gray-800 text-center">Sign in</h2>
            <p className="text-sm text-gray-800 text-center">Access your account</p>
          </div>

          {/* Social buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 flex items-center justify-center border rounded-lg py-1 px-2 hover:bg-gray-100 transition">
              <Image src="/icons/icons8-google.svg" alt="Google" width={20} height={20} />
              <span className="ml-2 text-sm font-medium">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center border rounded-lg py-1 px-2 hover:bg-gray-100 transition">
              <Image src="/icons/icons8-microsoft.svg" alt="Microsoft" width={20} height={20} />
              <span className="ml-2 text-sm font-medium">Microsoft</span>
            </button>
          </div>

          <div className="relative text-center text-gray-400 text-sm">
            <span className="px-2 bg-white relative z-10">or continue with email</span>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 z-0"></div>
          </div>

          {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-[#007bff] to-[#0056b3] hover:opacity-90 text-white font-semibold py-2 rounded-lg transition"
            >
              Sign in
            </button>
          </form>

  <p className="text-sm text-center text-gray-600">
    Don&apos;t have an account?{" "}
    <Link href="/register/Admin" className="text-blue-600 font-medium ml-1 hover:underline  border-red-500 z-50 relative">
      Sign Up
    </Link>
  </p>
        </motion.div>
      )}
    </div>
    </>
    );
}
