"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      toast.error(error.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F1FA] p-4 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#AFB5F7]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#7C86F5]/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-card border-none shadow-2xl">
          <CardHeader className="space-y-2 pb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#7C86F5] to-[#AFB5F7] bg-clip-text text-transparent">
                SeaFood
              </CardTitle>
              <CardDescription className="text-center text-slate-500 font-medium">
                Premium Dashboard Access
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-600 font-semibold ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@seafood.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/50 border-slate-200 focus:border-[#7C86F5] focus:ring-[#7C86F5] transition-all h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-slate-600 font-semibold">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/50 border-slate-200 focus:border-[#7C86F5] focus:ring-[#7C86F5] transition-all h-11"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 bg-[#7C86F5] hover:bg-[#8791FC] text-white font-bold premium-button" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Authenticating...
                  </span>
                ) : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          &copy; 2026 SeaFood Logistics. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
