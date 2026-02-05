"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
        "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Left Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-24 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 font-medium">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-slate-700 font-semibold ml-1"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@seafood.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-slate-50 border-slate-200 focus:border-[#1a365d] focus:ring-[#1a365d] transition-all h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-semibold"
                >
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-slate-50 border-slate-200 focus:border-[#1a365d] focus:ring-[#1a365d] transition-all h-12 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#1a365d] hover:bg-[#2c5282] text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <footer className="mt-24 text-slate-400 text-sm">
            <p>&copy; 2026 SeaFood Logistics. All rights reserved.</p>
          </footer>
        </motion.div>
      </div>

      {/* Right Side: Visual Section */}
      <div className="hidden lg:flex flex-1 relative bg-[#1a365d] flex-col justify-center items-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 text-center px-12"
        >
          <img
            src="/logo.png"
            alt="SeaFood Logo"
            className="h-32 w-auto object-contain mx-auto mb-10 filter drop-shadow-2xl"
          />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Premium Seafood Logistics, <br />
            <span className="text-blue-300">Redefined.</span>
          </h2>
          <p className="text-blue-100 text-lg font-medium max-w-md mx-auto opacity-80">
            Streamlining global sea food supply chains with cutting-edge technology and real-time insights.
          </p>
        </motion.div>

        {/* Abstract animated background shape */}
        <motion.div
          animate={{
            rotate: [0, 10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-24 -right-24 w-96 h-96 border-[40px] border-white/5 rounded-full z-10"
        />
      </div>
    </div>
  );
}
