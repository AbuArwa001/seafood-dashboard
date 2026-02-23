"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    Shield,
    Lock,
    User as UserIcon,
    MapPin,
    Mail,
    Key,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle,
    Fingerprint,
    ShieldCheck,
    ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// ─── Animations ───────────────────────────────────────────────────────────────
const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } },
};

// ─── Permission display helpers ────────────────────────────────────────────────
const MODULE_MAP: Record<string, string> = {
    shipment: "Shipments",
    product: "Products",
    sale: "Sales",
    payment: "Payments",
    supplierpurchase: "Purchases",
    costledger: "Costs",
    logisticsreceipt: "Logistics",
    user: "Users",
    exchangerate: "Exchange Rates",
    currency: "Currencies",
    role: "Roles",
};

const ACTION_LABEL: Record<string, string> = {
    view: "View",
    add: "Create",
    change: "Edit",
    delete: "Delete",
};

const ACTION_COLOR: Record<string, string> = {
    view: "bg-blue-50 text-blue-600 border-blue-100",
    add: "bg-emerald-50 text-emerald-600 border-emerald-100",
    change: "bg-amber-50 text-amber-600 border-amber-100",
    delete: "bg-rose-50 text-rose-600 border-rose-100",
};

function parseCodename(codename: string) {
    // codename examples: "view_shipment", "add_costledger"
    const parts = codename.split("_");
    const action = parts[0];
    const model = parts.slice(1).join("_");
    return {
        action,
        actionLabel: ACTION_LABEL[action] ?? action,
        module: MODULE_MAP[model] ?? model,
        colorClass: ACTION_COLOR[action] ?? "bg-slate-50 text-slate-600 border-slate-100",
    };
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function SecurityPage() {
    const { user, roleName } = useAuth();

    // Password form state
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const passwordMutation = useMutation({
        mutationFn: async () => {
            const res = await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, {
                current_password: currentPw,
                new_password: newPw,
                confirm_password: confirmPw,
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Password updated successfully.");
            setCurrentPw("");
            setNewPw("");
            setConfirmPw("");
        },
        onError: (error: any) => {
            const msg =
                error?.response?.data?.detail ||
                "Failed to update password. Please try again.";
            toast.error(msg);
        },
    });

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPw || !newPw || !confirmPw) {
            toast.error("Please fill in all password fields.");
            return;
        }
        if (newPw !== confirmPw) {
            toast.error("New passwords do not match.");
            return;
        }
        if (newPw.length < 8) {
            toast.error("New password must be at least 8 characters.");
            return;
        }
        passwordMutation.mutate();
    };

    const permissions = user?.role?.permissions ?? [];
    const isAdmin = roleName?.toLowerCase() === "admin";

    // Group permissions by module
    const grouped = permissions.reduce<Record<string, typeof permissions>>(
        (acc, perm) => {
            const { module } = parseCodename(perm.codename);
            if (!acc[module]) acc[module] = [];
            acc[module].push(perm);
            return acc;
        },
        {}
    );

    const initials =
        user?.full_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() ?? "?";

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-10 p-4 lg:p-8 max-w-5xl"
        >
            {/* Page Header */}
            <motion.header variants={item} className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
                    Security &amp;{" "}
                    <span className="text-indigo-600 italic">Access</span>
                </h2>
                <p className="text-slate-500 font-semibold mt-1 text-lg">
                    Your account credentials and{" "}
                    <span className="text-indigo-500 font-black underline decoration-indigo-400/20 decoration-4 underline-offset-4">
                        role permissions
                    </span>
                    .
                </p>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* ── Left column: Profile + Permissions ── */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <motion.div variants={item}>
                        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] bg-white rounded-[2rem] overflow-hidden">
                            {/* Banner */}
                            <div className="h-20 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
                            </div>
                            <CardContent className="px-7 pb-7 -mt-8 relative">
                                {/* Avatar */}
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-600/30 text-white text-xl font-black mb-5 border-4 border-white">
                                    {initials}
                                </div>

                                <p className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                                    {user?.full_name ?? "—"}
                                </p>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">
                                    {roleName ?? "Standard User"}
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="bg-slate-50 h-8 w-8 rounded-xl flex items-center justify-center flex-none">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <span className="font-semibold truncate">{user?.email ?? "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="bg-slate-50 h-8 w-8 rounded-xl flex items-center justify-center flex-none">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <span className="font-semibold">{user?.location ?? "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="bg-slate-50 h-8 w-8 rounded-xl flex items-center justify-center flex-none">
                                            <Fingerprint className="h-4 w-4 text-slate-400" />
                                        </div>
                                        {user?.is_active ? (
                                            <Badge className="bg-emerald-500 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider hover:bg-emerald-600">
                                                Active Account
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-slate-200 text-slate-500 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                                                Inactive
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Role badge */}
                    <motion.div variants={item}>
                        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] bg-white rounded-[2rem] overflow-hidden">
                            <CardContent className="p-7">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`p-3 rounded-2xl ${isAdmin
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "bg-slate-50 text-slate-500"
                                            }`}
                                    >
                                        {isAdmin ? (
                                            <ShieldCheck className="h-6 w-6" />
                                        ) : (
                                            <ShieldAlert className="h-6 w-6" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                            System Role
                                        </p>
                                        <p className="text-lg font-black text-slate-900 leading-none">
                                            {roleName ?? "—"}
                                        </p>
                                        <p className="text-xs text-slate-400 font-semibold mt-2 leading-relaxed">
                                            {isAdmin
                                                ? "Full administrative access to all modules and settings."
                                                : "Scoped access to specific modules based on role."}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* ── Right column: Permissions + Password ── */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Permissions Panel */}
                    <motion.div variants={item}>
                        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] bg-white rounded-[2rem] overflow-hidden">
                            <CardHeader className="px-8 pt-8 pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-50 p-3 rounded-2xl">
                                        <Shield className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black text-slate-900">
                                            Access Permissions
                                        </CardTitle>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                            {permissions.length} permission{permissions.length !== 1 ? "s" : ""} granted to your role
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                {permissions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                                        <div className="bg-slate-50 p-6 rounded-2xl">
                                            <Lock className="h-10 w-10 text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
                                            No explicit permissions assigned
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {Object.entries(grouped).map(([module, perms]) => (
                                            <div key={module}>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                                    {module}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {perms.map((perm) => {
                                                        const { actionLabel, colorClass } = parseCodename(perm.codename);
                                                        return (
                                                            <span
                                                                key={perm.codename}
                                                                className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border ${colorClass}`}
                                                            >
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                {actionLabel}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Change Password */}
                    <motion.div variants={item}>
                        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] bg-white rounded-[2rem] overflow-hidden">
                            <CardHeader className="px-8 pt-8 pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="bg-rose-50 p-3 rounded-2xl">
                                        <Key className="h-5 w-5 text-rose-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black text-slate-900">
                                            Change Password
                                        </CardTitle>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                            Keep your account secure
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                                    {/* Current password */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-500">
                                            Current Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                            <Input
                                                type={showCurrent ? "text" : "password"}
                                                value={currentPw}
                                                onChange={(e) => setCurrentPw(e.target.value)}
                                                placeholder="Enter current password"
                                                className="pl-11 pr-11 h-14 rounded-2xl border-slate-100 bg-slate-50/70 focus:ring-2 focus:ring-indigo-500/10 font-semibold"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrent((v) => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                            >
                                                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New password */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-500">
                                            New Password
                                        </Label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                            <Input
                                                type={showNew ? "text" : "password"}
                                                value={newPw}
                                                onChange={(e) => setNewPw(e.target.value)}
                                                placeholder="Min. 8 characters"
                                                className="pl-11 pr-11 h-14 rounded-2xl border-slate-100 bg-slate-50/70 focus:ring-2 focus:ring-indigo-500/10 font-semibold"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNew((v) => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                            >
                                                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {/* Strength hint */}
                                        {newPw.length > 0 && (
                                            <div className="flex items-center gap-2 mt-1">
                                                {[...Array(4)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < Math.min(Math.floor(newPw.length / 3), 4)
                                                            ? newPw.length < 8
                                                                ? "bg-rose-400"
                                                                : newPw.length < 12
                                                                    ? "bg-amber-400"
                                                                    : "bg-emerald-400"
                                                            : "bg-slate-100"
                                                            }`}
                                                    />
                                                ))}
                                                <span className="text-[10px] font-black text-slate-400 uppercase ml-1">
                                                    {newPw.length < 8
                                                        ? "Weak"
                                                        : newPw.length < 12
                                                            ? "Fair"
                                                            : "Strong"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm password */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-500">
                                            Confirm New Password
                                        </Label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                            <Input
                                                type={showConfirm ? "text" : "password"}
                                                value={confirmPw}
                                                onChange={(e) => setConfirmPw(e.target.value)}
                                                placeholder="Repeat new password"
                                                className={`pl-11 pr-11 h-14 rounded-2xl border-slate-100 bg-slate-50/70 focus:ring-2 font-semibold transition-all ${confirmPw.length > 0 && newPw !== confirmPw
                                                    ? "border-rose-200 focus:ring-rose-500/10"
                                                    : confirmPw.length > 0 && newPw === confirmPw
                                                        ? "border-emerald-200 focus:ring-emerald-500/10"
                                                        : "focus:ring-indigo-500/10"
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm((v) => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                            >
                                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                            {confirmPw.length > 0 && (
                                                <div className="absolute right-11 top-1/2 -translate-y-1/2">
                                                    {newPw === confirmPw ? (
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-rose-400" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            disabled={passwordMutation.isPending}
                                            className="w-full h-14 rounded-2xl font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 transition-all active:scale-95 text-sm uppercase tracking-wider"
                                        >
                                            {passwordMutation.isPending ? (
                                                <span className="flex items-center gap-3">
                                                    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    Updating…
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-3">
                                                    <Shield className="h-4 w-4" />
                                                    Update Password
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
