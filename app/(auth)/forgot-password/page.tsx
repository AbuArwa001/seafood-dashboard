"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { ChevronLeft, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST, {
        email,
      });
      setIsSubmitted(true);
      toast.success("Reset link sent if account exists.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Left Side: Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-24 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <Link
              href="/login"
              className="inline-flex items-center text-slate-500 hover:text-[#1a365d] transition-colors mb-8 group"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to login
            </Link>
            <img
              src="/logo.png"
              alt="SeaFood"
              className="h-12 w-auto object-contain mb-8"
            />
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
              Forgot password?
            </h1>
            <p className="text-slate-500 font-medium">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-700 font-semibold ml-1"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-slate-50 border-slate-200 focus:border-[#1a365d] focus:ring-[#1a365d] transition-all h-12 rounded-lg   pl-10"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#1a365d] hover:bg-[#2c5282] text-white font-bold rounded-lg   shadow-lg transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Check your email
              </h3>
              <p className="text-slate-500 mb-8">
                We've sent a password reset link to{" "}
                <span className="font-semibold text-slate-900">{email}</span>.
              </p>
              <Button
                variant="outline"
                className="w-full h-12 border-slate-200 text-slate-600 font-semibold rounded-lg   hover:bg-slate-100"
                onClick={() => setIsSubmitted(false)}
              >
                Didn't receive the email? Try again
              </Button>
            </motion.div>
          )}

          <footer className="mt-24 text-slate-400 text-sm">
            <p>&copy; 2026 SeaFood Logistics. All rights reserved.</p>
          </footer>
        </motion.div>
      </div>

      {/* Right Side: Visual Section (Same as Login) */}
      <div className="hidden lg:flex flex-1 relative bg-[#1a365d] flex-col justify-center items-center overflow-hidden">
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
            src="/logo01.png"
            alt="SeaFood Logo"
            className="h-32 w-auto object-contain mx-auto mb-10 filter drop-shadow-2xl"
          />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Secure Access, <br />
            <span className="text-blue-300">Simplified.</span>
          </h2>
          <p className="text-blue-100 text-lg font-medium max-w-md mx-auto opacity-80">
            Recover your account quickly and securely to get back to managing
            your supply chain.
          </p>
        </motion.div>

        <motion.div
          animate={{
            rotate: [0, 10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-24 -right-24 w-96 h-96 border-[40px] border-white/5 rounded-full z-10"
        />
      </div>
    </div>
  );
}
