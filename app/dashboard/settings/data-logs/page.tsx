"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Activity,
    Database,
    History,
    Search,
    Filter,
    ArrowLeft,
    Clock,
    User,
    Users,
    Tag,
    ChevronRight,
    Cpu,
    Server,
    Shield
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function DataLogsPage() {
    const [view, setView] = useState<"logs" | "stats">("logs");
    const [search, setSearch] = useState("");

    const { data: logs, isLoading: isLoadingLogs } = useQuery({
        queryKey: ["audit-logs", search],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.AUDIT.LOGS, {
                params: { search, page_size: 50 }
            });
            return response.data.results || response.data;
        },
    });

    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ["system-stats"],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.AUDIT.STATS);
            return response.data;
        },
    });

    const getActionBadge = (action: string) => {
        switch (action) {
            case "CREATE":
                return <Badge className="bg-emerald-500 hover:bg-emerald-600">Created</Badge>;
            case "UPDATE":
                return <Badge className="bg-blue-500 hover:bg-blue-600">Updated</Badge>;
            case "DELETE":
                return <Badge className="bg-rose-500 hover:bg-rose-600">Deleted</Badge>;
            default:
                return <Badge variant="outline">{action}</Badge>;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 lg:p-8 space-y-8"
        >
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center text-slate-500 hover:text-primary transition-colors mb-4 font-bold group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Settings
                    </Link>
                    <h1 className="text-4xl font-black text-slate-900 flex items-center">
                        Data & <span className="text-primary italic ml-2">Logs</span>
                        <Database className="ml-4 h-8 w-8 text-primary shadow-sm" />
                    </h1>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setView("logs")}
                        className={`flex items-center px-6 py-2.5 rounded-xl font-black transition-all ${view === "logs"
                            ? "bg-white text-primary shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <History className="h-4 w-4 mr-2" />
                        Audit Logs
                    </button>
                    <button
                        onClick={() => setView("stats")}
                        className={`flex items-center px-6 py-2.5 rounded-xl font-black transition-all ${view === "stats"
                            ? "bg-white text-primary shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <Activity className="h-4 w-4 mr-2" />
                        System Stats
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {view === "logs" ? (
                    <motion.div
                        key="logs"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <CardTitle className="text-2xl font-black">System Activity</CardTitle>
                                        <CardDescription>
                                            Detailed audit trail of all operational changes.
                                        </CardDescription>
                                    </div>
                                    <div className="relative w-full md:w-80">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Search logs..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-primary h-12"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="hover:bg-transparent border-slate-100">
                                            <TableHead className="px-8 h-14 font-black text-slate-500 uppercase tracking-widest text-[10px]">User</TableHead>
                                            <TableHead className="h-14 font-black text-slate-500 uppercase tracking-widest text-[10px]">Action</TableHead>
                                            <TableHead className="h-14 font-black text-slate-500 uppercase tracking-widest text-[10px]">Entity</TableHead>
                                            <TableHead className="h-14 font-black text-slate-500 uppercase tracking-widest text-[10px]">Reference</TableHead>
                                            <TableHead className="h-14 font-black text-slate-500 uppercase tracking-widest text-[10px]">Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingLogs ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <TableRow key={i} className="animate-pulse">
                                                    <TableCell colSpan={5} className="h-20 bg-slate-50/20" />
                                                </TableRow>
                                            ))
                                        ) : logs?.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-bold">
                                                    No activity logs found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            logs?.map((log: any) => (
                                                <TableRow key={log.id} className="hover:bg-slate-50/50 border-slate-100 group transition-colors">
                                                    <TableCell className="px-8 py-5">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs mr-3">
                                                                {log.user_details?.email?.charAt(0).toUpperCase() || "S"}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 break-all">{log.user_details?.email || "System"}</p>
                                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{log.ip_address || "Internal"}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{getActionBadge(log.action)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <span className="text-slate-600 font-bold px-3 py-1 bg-slate-100 rounded-lg text-xs">
                                                                {log.content_type_name?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-bold text-slate-500 max-w-[200px] truncate">
                                                        {log.object_repr}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center text-slate-500">
                                                            <Clock className="h-3 w-3 mr-1.5 opacity-40" />
                                                            <span className="text-xs font-bold">
                                                                {format(new Date(log.timestamp), "MMM dd, HH:mm")}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="stats"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="border-none shadow-lg rounded-3xl bg-blue-600 text-white p-6 relative overflow-hidden group">
                                <div className="absolute right-[-10%] bottom-[-10%] opacity-20 group-hover:scale-110 transition-transform duration-500">
                                    <Server className="h-32 w-32" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px] mb-2">Engine</p>
                                    <h3 className="text-3xl font-black mb-1">{stats?.database_engine?.toUpperCase() || "SQLITE"}</h3>
                                    <p className="text-blue-100/60 text-xs font-medium">Relational Core</p>
                                </div>
                            </Card>

                            <Card className="border-none shadow-lg rounded-3xl bg-emerald-600 text-white p-6 relative overflow-hidden group">
                                <div className="absolute right-[-10%] bottom-[-10%] opacity-20 group-hover:scale-110 transition-transform duration-500">
                                    <Shield className="h-32 w-32" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-emerald-100 font-bold uppercase tracking-widest text-[10px] mb-2">Recent Events</p>
                                    <h3 className="text-3xl font-black mb-1">{stats?.recent_activity_count || 0}</h3>
                                    <p className="text-emerald-100/60 text-xs font-medium">Capture in last 24h</p>
                                </div>
                            </Card>

                            <Card className="border-none shadow-lg rounded-3xl bg-amber-500 text-white p-6 relative overflow-hidden group">
                                <div className="absolute right-[-10%] bottom-[-10%] opacity-20 group-hover:scale-110 transition-transform duration-500">
                                    <Users className="h-32 w-32" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-amber-50 font-bold uppercase tracking-widest text-[10px] mb-2">Total Users</p>
                                    <h3 className="text-3xl font-black mb-1">{stats?.user_stats?.total || 0}</h3>
                                    <p className="text-amber-50/60 text-xs font-medium">{stats?.user_stats?.active || 0} currently active</p>
                                </div>
                            </Card>

                            <Card className="border-none shadow-lg rounded-3xl bg-indigo-600 text-white p-6 relative overflow-hidden group">
                                <div className="absolute right-[-10%] bottom-[-10%] opacity-20 group-hover:scale-110 transition-transform duration-500">
                                    <Cpu className="h-32 w-32" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-indigo-100 font-bold uppercase tracking-widest text-[10px] mb-2">Status</p>
                                    <h3 className="text-3xl font-black mb-1">HEALTHY</h3>
                                    <p className="text-indigo-100/60 text-xs font-medium">System responsive</p>
                                </div>
                            </Card>
                        </div>

                        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
                            <CardTitle className="text-2xl font-black mb-8 flex items-center">
                                Entity Statistics
                                <ChevronRight className="h-5 w-5 mx-2 text-slate-300" />
                                <span className="text-slate-400">Object Counts</span>
                            </CardTitle>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {stats?.model_counts && Object.entries(stats.model_counts).map(([name, count]: [string, any]) => (
                                    <div key={name} className="p-6 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{name}</p>
                                        <p className="text-3xl font-black text-slate-900 group-hover:scale-105 transition-transform origin-left">
                                            {count}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
