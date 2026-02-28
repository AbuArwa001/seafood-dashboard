"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    Save,
    RefreshCw,
    Search,
    AlertCircle,
    CheckCircle2,
    Info,
    Mail,
    Clock,
    Users,
    Shield,
    Loader2,
    Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SystemParameter, Role } from "@/types/models";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export default function NotificationsSettingsPage() {
    const { isAdmin } = useAuth();
    const queryClient = useQueryClient();
    const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

    const { data: parameters, isLoading: paramsLoading, refetch: refetchParams } = useQuery<SystemParameter[]>({
        queryKey: ["system-parameters", "notifications"],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.SYSTEM_PARAMETERS, {
                params: { category: "notifications", page_size: 100 }
            });
            return Array.isArray(response.data) ? response.data : (response.data.results ?? []);
        },
        enabled: isAdmin,
    });

    const { data: roles, isLoading: rolesLoading } = useQuery<Role[]>({
        queryKey: ["roles"],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.ROLES);
            return Array.isArray(response.data) ? response.data : (response.data.results ?? []);
        },
        enabled: isAdmin,
    });

    const updateMutation = useMutation({
        mutationFn: async ({ key, value }: { key: string; value: string }) => {
            await apiClient.patch(API_ENDPOINTS.SYSTEM_PARAMETER(key), { value });
        },
        onSuccess: (_, variables) => {
            toast.success(`Setting finalized`);
            setPendingChanges(prev => {
                const next = { ...prev };
                delete next[variables.key];
                return next;
            });
            queryClient.invalidateQueries({ queryKey: ["system-parameters"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Failed to update configuration");
        },
    });

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="bg-rose-50 p-6 rounded-full">
                    <AlertCircle className="h-12 w-12 text-rose-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Access Restricted</h2>
                <p className="text-slate-500 font-semibold max-w-md text-center">
                    Notification architecture requires system admin privileges to modify.
                </p>
            </div>
        );
    }

    const handleValueChange = (key: string, value: string) => {
        setPendingChanges(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = (key: string) => {
        const value = pendingChanges[key];
        if (value !== undefined) {
            updateMutation.mutate({ key, value });
        }
    };

    const toggleRole = (currentValue: string, roleName: string) => {
        let selectedRoles: string[] = [];
        try {
            selectedRoles = JSON.parse(currentValue);
        } catch (e) {
            selectedRoles = [];
        }

        if (selectedRoles.includes(roleName)) {
            selectedRoles = selectedRoles.filter(r => r !== roleName);
        } else {
            selectedRoles.push(roleName);
        }

        return JSON.stringify(selectedRoles);
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-12 p-4 lg:p-8 max-w-[1000px] mx-auto"
        >
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-amber-100 p-2 rounded-xl">
                            <Bell className="h-6 w-6 text-amber-600" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-amber-600 border-amber-200 bg-amber-50">
                            Automated Alerts
                        </Badge>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
                        Notification <span className="text-amber-500 italic">Settings</span>
                    </h2>
                    <p className="text-slate-500 font-semibold mt-3 text-lg">
                        Configure automated triggers and recipient protocols.
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => refetchParams()}
                    className="rounded-xl hover:bg-slate-100 text-slate-500"
                >
                    <RefreshCw className={`h-5 w-5 ${paramsLoading ? 'animate-spin' : ''}`} />
                </Button>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {paramsLoading ? (
                    [...Array(3)].map((_, i) => (
                        <Card key={i} className="border-none shadow-premium rounded-[2.5rem] bg-white">
                            <CardContent className="p-10">
                                <Skeleton className="h-8 w-1/3 mb-6" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    parameters?.map((param) => (
                        <motion.div key={param.id} variants={item}>
                            <Card className="border-none shadow-premium bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-premium-hover transition-all duration-500">
                                <CardContent className="p-8 md:p-10">
                                    <div className="flex flex-col lg:flex-row gap-10">
                                        <div className="flex-1 space-y-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                                        {param.name}
                                                    </h3>
                                                    {param.data_type === 'boolean' && (
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] uppercase tracking-widest px-2 py-0">Global</Badge>
                                                    )}
                                                </div>
                                                <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                                                    {param.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    {param.key.includes('days') ? <Clock className="h-4 w-4 text-amber-500" /> :
                                                        param.key.includes('email') ? <Mail className="h-4 w-4 text-blue-500" /> :
                                                            param.key.includes('roles') ? <Users className="h-4 w-4 text-indigo-500" /> :
                                                                <Shield className="h-4 w-4 text-emerald-500" />}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    PROPRIETARY PARAMETER: <span className="text-slate-600">{param.key}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-[360px] flex flex-col justify-center gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                                    Configuration Value
                                                </label>

                                                {param.data_type === "boolean" ? (
                                                    <div className="h-16 flex items-center justify-between px-8 bg-slate-50 rounded-[1.25rem] border border-slate-100 shadow-sm">
                                                        <span className={cn(
                                                            "text-xs font-black uppercase tracking-widest",
                                                            (pendingChanges[param.key] ?? param.value).toLowerCase() === "true" ? "text-emerald-600" : "text-slate-400"
                                                        )}>
                                                            {(pendingChanges[param.key] ?? param.value).toLowerCase() === "true" ? "Enabled" : "Disabled"}
                                                        </span>
                                                        <Switch
                                                            checked={(pendingChanges[param.key] ?? param.value).toLowerCase() === "true"}
                                                            onCheckedChange={(checked) => handleValueChange(param.key, checked ? "true" : "false")}
                                                        />
                                                    </div>
                                                ) : param.data_type === "json" && param.key === "notify_roles" ? (
                                                    <div className="space-y-2 max-h-[200px] overflow-y-auto p-2 bg-slate-50 rounded-[1.25rem] border border-slate-100 no-scrollbar">
                                                        {roles?.map(role => {
                                                            const currentVal = pendingChanges[param.key] ?? param.value;
                                                            let isSelected = false;
                                                            try {
                                                                isSelected = JSON.parse(currentVal).includes(role.role_name);
                                                            } catch (e) { }

                                                            return (
                                                                <button
                                                                    key={role.id}
                                                                    onClick={() => handleValueChange(param.key, toggleRole(currentVal, role.role_name))}
                                                                    className={cn(
                                                                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-tight",
                                                                        isSelected
                                                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                                                            : "bg-white text-slate-500 hover:bg-slate-100"
                                                                    )}
                                                                >
                                                                    {role.role_name}
                                                                    {isSelected && <Check className="h-3 w-3" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <Input
                                                            type={param.data_type === "number" ? "number" : "text"}
                                                            value={pendingChanges[param.key] ?? param.value}
                                                            onChange={(e) => handleValueChange(param.key, e.target.value)}
                                                            className="h-16 px-8 rounded-[1.25rem] border-slate-100 bg-slate-50 focus:bg-white focus:border-amber-200 font-bold text-slate-900 transition-all text-lg shadow-sm"
                                                        />
                                                        {param.data_type === "number" && (
                                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
                                                                Days
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <AnimatePresence>
                                                {pendingChanges[param.key] !== undefined && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    >
                                                        <Button
                                                            className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-200"
                                                            onClick={() => handleSave(param.key)}
                                                            disabled={updateMutation.isPending}
                                                        >
                                                            {updateMutation.isPending && updateMutation.variables?.key === param.key ? (
                                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Save className="h-5 w-5 mr-3" />
                                                                    Update Environment
                                                                </>
                                                            )}
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            <footer className="pt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                        Settings are applied in real-time to background workers.
                    </span>
                </div>
            </footer>
        </motion.div>
    );
}
