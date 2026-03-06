"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uid || !token) {
            setError("Invalid or expired reset link. Please request a new one.");
        }
    }, [uid, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
                uid,
                token,
                new_password: password,
            });
            setIsSuccess(true);
            toast.success("Password reset successfully!");
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error: any) {
            const msg = error.response?.data?.detail || "Failed to reset password. Link may be expired.";
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (error && !isSuccess) {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{error}</h3>
                <Link href="/forgot-password">
                    <Button className="mt-4 bg-[#1a365d] hover:bg-[#2c5282] text-white rounded-xl h-12 w-full max-w-xs">
                        Request new link
                    </Button>
                </Link>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Success!</h3>
                <p className="text-slate-500">
                    Your password has been reset successfully. Redirecting you to login...
                </p>
                <Link href="/login">
                    <Button className="mt-4 bg-[#1a365d] hover:bg-[#2c5282] text-white rounded-xl h-12 w-full max-w-xs">
                        Go to login now
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="password" title="New Password" />
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-slate-50 border-slate-200 focus:border-[#1a365d] focus:ring-[#1a365d] transition-all h-12 rounded-xl pl-10 pr-12"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword" title="Confirm New Password" />
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-slate-50 border-slate-200 focus:border-[#1a365d] focus:ring-[#1a365d] transition-all h-12 rounded-xl pl-10"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full h-12 bg-[#1a365d] hover:bg-[#2c5282] text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Updating...
                    </span>
                ) : (
                    "Update Password"
                )}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
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
                        <img
                            src="/logo.png"
                            alt="SeaFood"
                            className="h-12 w-auto object-contain mb-8"
                        />
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                            Set new password
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Your new password must be different from previous ones.
                        </p>
                    </div>

                    <Suspense fallback={<div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a365d] border-t-transparent" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>

                    <footer className="mt-24 text-slate-400 text-sm">
                        <p>&copy; 2026 SeaFood Logistics. All rights reserved.</p>
                    </footer>
                </motion.div>
            </div>

            {/* Right Side: Visual Section */}
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
                        Account Security, <br />
                        <span className="text-blue-300">Reinforced.</span>
                    </h2>
                    <p className="text-blue-100 text-lg font-medium max-w-md mx-auto opacity-80">
                        We use industry-standard encryption to ensure your new password is kept safe and private.
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
                        ease: "easeInOut"
                    }}
                    className="absolute -bottom-24 -right-24 w-96 h-96 border-[40px] border-white/5 rounded-full z-10"
                />
            </div>
        </div>
    );
}
