"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
    Shield,
    Lock,
    ShieldCheck,
    CheckCircle2,
    Search,
    RefreshCw,
    AlertCircle,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Role } from "@/types/models";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import { RolePermissionsDialog } from "@/components/forms/RolePermissionsDialog";

// ─── Animations ───────────────────────────────────────────────────────────────
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

// ─── Module Map ───────────────────────────────────────────────────────────────
const MODULE_DISPLAY: Record<string, string> = {
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

const ACTION_COLOR: Record<string, string> = {
    view: "bg-blue-50 text-blue-600 border-blue-100",
    add: "bg-emerald-50 text-emerald-600 border-emerald-100",
    change: "bg-amber-50 text-amber-600 border-amber-100",
    delete: "bg-rose-50 text-rose-600 border-rose-100",
};

function formatPermission(codename: string) {
    const parts = codename.split("_");
    const action = parts[0];
    const model = parts.slice(1).join("_");

    return {
        action: action.charAt(0).toUpperCase() + action.slice(1),
        module: MODULE_DISPLAY[model] || model,
        color: ACTION_COLOR[action] || "bg-slate-50 text-slate-600 border-slate-100",
    };
}

export default function AccessControlPage() {
    const { isAdmin } = useAuth();
    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: roles, isLoading, error, refetch } = useQuery<Role[]>({
        queryKey: ["roles"],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.ROLES);
            return response.data;
        },
        enabled: isAdmin,
    });

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="bg-rose-50 p-6 rounded-full">
                    <AlertCircle className="h-12 w-12 text-rose-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Access Denied</h2>
                <p className="text-slate-500 font-semibold max-w-md text-center">
                    Only system administrators have permission to manage roles and security protocols.
                </p>
                <Button variant="outline" onClick={() => window.history.back()} className="rounded-xl font-bold">
                    Go Back
                </Button>
            </div>
        );
    }

    const filteredRoles = roles?.filter(role =>
        role.role_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-12 p-4 lg:p-8 max-w-[1400px] mx-auto"
        >
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
                        Access <span className="text-indigo-600 italic">Control</span>
                    </h2>
                    <p className="text-slate-500 font-semibold mt-3 text-lg">
                        Managing role-based access levels and{" "}
                        <span className="text-indigo-500 font-black underline decoration-indigo-500/20 decoration-4 underline-offset-4">security policies</span>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => refetch()}
                        className="rounded-xl hover:bg-slate-100 text-slate-500 transition-all duration-300"
                    >
                        <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </header>

            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                    placeholder="Search system roles..."
                    className="h-16 pl-14 pr-6 rounded-[1.5rem] border-none shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] bg-white font-semibold text-lg focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading ? (
                    [...Array(6)].map((_, i) => (
                        <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                            <CardHeader className="p-8">
                                <Skeleton className="h-8 w-1/2 rounded-lg" />
                                <Skeleton className="h-4 w-3/4 mt-2 rounded-lg" />
                            </CardHeader>
                            <CardContent className="px-8 pb-8 space-y-4">
                                <Skeleton className="h-24 w-full rounded-2xl" />
                            </CardContent>
                        </Card>
                    ))
                ) : error ? (
                    <div className="col-span-full py-20 text-center space-y-6">
                        <div className="bg-amber-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle className="h-10 w-10 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Failed to load roles</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            There was an error communicating with the authentication server. Please try again.
                        </p>
                    </div>
                ) : (
                    filteredRoles?.map((role) => (
                        <motion.div
                            key={role.id}
                            variants={item}
                            onClick={() => {
                                setSelectedRole(role);
                                setIsDialogOpen(true);
                            }}
                            className="cursor-pointer"
                        >
                            <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] bg-white rounded-[2.5rem] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 border border-transparent hover:border-indigo-100 flex flex-col h-full group">
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="bg-indigo-50 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                            <ShieldCheck className="h-8 w-8 text-indigo-600" />
                                        </div>
                                        <Badge className="bg-slate-100 text-slate-500 border-none font-bold px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">
                                            {role.permissions.length} Policies
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-black tracking-tight text-slate-900 mt-6">
                                        {role.role_name}
                                    </CardTitle>
                                    <p className="text-slate-500 font-semibold text-sm mt-2">
                                        Standard permissions and data access protocols.
                                    </p>
                                </CardHeader>
                                <CardContent className="p-8 pt-4 flex-1">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Granted Permissions
                                        </p>
                                        <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                            {role.permissions.map((perm) => {
                                                const { action, module, color } = formatPermission(perm.codename);
                                                return (
                                                    <div
                                                        key={perm.id}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider ${color}`}
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span>{action} {module}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            Modified: {role.updated_at ? format(new Date(role.updated_at), "MMM dd, yyyy") : "Recently"}
                                        </span>
                                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            <RolePermissionsDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setSelectedRole(null);
                }}
                role={selectedRole}
            />
        </motion.div>
    );
}
