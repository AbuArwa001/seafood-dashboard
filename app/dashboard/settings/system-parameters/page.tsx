"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings2,
    Save,
    RefreshCw,
    Search,
    AlertCircle,
    CheckCircle2,
    Info,
    LayoutDashboard,
    DollarSign,
    Truck,
    Bell,
    Cpu,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SystemParameter, ParameterCategory } from "@/types/models";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

// ─── Animations ───────────────────────────────────────────────────────────────
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<ParameterCategory, { label: string; icon: any; color: string }> = {
    general: { label: "General", icon: LayoutDashboard, color: "text-indigo-600 bg-indigo-50" },
    financial: { label: "Financial", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    logistics: { label: "Logistics", icon: Truck, color: "text-amber-600 bg-amber-50" },
    notifications: { label: "Notifications", icon: Bell, color: "text-rose-600 bg-rose-50" },
    system: { label: "System", icon: Cpu, color: "text-slate-600 bg-slate-50" },
};

export default function SystemParametersPage() {
    const { isAdmin } = useAuth();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<ParameterCategory | "all">("all");
    const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

    const { data: parameters, isLoading, error, refetch } = useQuery<SystemParameter[]>({
        queryKey: ["system-parameters"],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.SYSTEM_PARAMETERS);
            return response.data;
        },
        enabled: isAdmin,
    });

    const updateMutation = useMutation({
        mutationFn: async ({ key, value }: { key: string; value: string }) => {
            await apiClient.patch(API_ENDPOINTS.SYSTEM_PARAMETER(key), { value });
        },
        onSuccess: (_, variables) => {
            toast.success(`Updated ${variables.key.replace(/_/g, " ")}`);
            setPendingChanges(prev => {
                const next = { ...prev };
                delete next[variables.key];
                return next;
            });
            queryClient.invalidateQueries({ queryKey: ["system-parameters"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Failed to update parameter");
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
                    System configuration requires top-level administrative clearance.
                </p>
            </div>
        );
    }

    const filteredParameters = parameters?.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.key.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleValueChange = (key: string, value: string) => {
        setPendingChanges(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = (key: string) => {
        const value = pendingChanges[key];
        if (value !== undefined) {
            updateMutation.mutate({ key, value });
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-12 p-4 lg:p-8 max-w-[1200px] mx-auto"
        >
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
                        System <span className="text-indigo-600 italic">Parameters</span>
                    </h2>
                    <p className="text-slate-500 font-semibold mt-3 text-lg">
                        Fine-tuning core application behaviors and facility defaults.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => refetch()}
                        className="rounded-xl hover:bg-slate-100 text-slate-500"
                    >
                        <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search parameters by name or identifier..."
                        className="h-12 pl-11 rounded-2xl border-none shadow-sm bg-white font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
                    <Button
                        variant={selectedCategory === "all" ? "default" : "ghost"}
                        onClick={() => setSelectedCategory("all")}
                        className={`rounded-xl px-4 h-10 font-bold text-xs uppercase tracking-widest ${selectedCategory === "all" ? "bg-indigo-600 hover:bg-indigo-700" : ""
                            }`}
                    >
                        All
                    </Button>
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                        <Button
                            key={key}
                            variant={selectedCategory === key ? "default" : "ghost"}
                            onClick={() => setSelectedCategory(key as ParameterCategory)}
                            className={`rounded-xl px-4 h-10 font-bold text-xs uppercase tracking-widest ${selectedCategory === key ? "bg-indigo-600 hover:bg-indigo-700" : ""
                                }`}
                        >
                            <config.icon className="h-3 w-3 mr-2" />
                            {config.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                            <CardContent className="p-8">
                                <Skeleton className="h-6 w-1/3 mb-4" />
                                <Skeleton className="h-12 w-full rouned-xl" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredParameters?.map((param) => (
                            <motion.div
                                key={param.id}
                                layout
                                variants={item}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Card className="border-none shadow-premium bg-white rounded-[2rem] overflow-hidden hover:shadow-premium-hover transition-all duration-300">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-xl ${CATEGORY_CONFIG[param.category].color}`}>
                                                        {(() => {
                                                            const Icon = CATEGORY_CONFIG[param.category].icon;
                                                            return <Icon className="h-4 w-4" />;
                                                        })()}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                                                            {param.name}
                                                        </h3>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                            ID: {param.key}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                                                    <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                        {param.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-[400px] space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 ml-1">
                                                        Setting Value
                                                    </label>
                                                    <div className="relative group">
                                                        {param.data_type === "boolean" ? (
                                                            <div className="h-14 flex items-center justify-between px-6 bg-slate-50 rounded-2xl border border-slate-100">
                                                                <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                                                                    {(pendingChanges[param.key] ?? param.value) === "True" ? "Enabled" : "Disabled"}
                                                                </span>
                                                                <Switch
                                                                    checked={(pendingChanges[param.key] ?? param.value) === "True"}
                                                                    onCheckedChange={(checked) => handleValueChange(param.key, checked ? "True" : "False")}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <Input
                                                                type={param.data_type === "number" ? "number" : "text"}
                                                                value={pendingChanges[param.key] ?? param.value}
                                                                onChange={(e) => handleValueChange(param.key, e.target.value)}
                                                                className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-200 font-bold text-slate-900 transition-all text-lg shadow-sm"
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {pendingChanges[param.key] !== undefined && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                        >
                                                            <Button
                                                                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200"
                                                                onClick={() => handleSave(param.key)}
                                                                disabled={updateMutation.isPending}
                                                            >
                                                                {updateMutation.isPending && updateMutation.variables?.key === param.key ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        <Save className="h-4 w-4 mr-2" />
                                                                        Commit Change
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                                        <Badge variant="outline" className="bg-white text-[9px] font-black uppercase tracking-widest border-slate-200 px-2 py-0.5 rounded-md">
                                            Type: {param.data_type}
                                        </Badge>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            Synchronized: {new Date(param.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    );
}
