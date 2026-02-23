"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
    Bell,
    AlertCircle,
    AlertTriangle,
    Info,
    Ship,
    CreditCard,
    CheckCheck,
    Loader2,
    X,
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Notification {
    id: string;
    type: string;
    severity: "critical" | "warning" | "info";
    title: string;
    message: string;
    link: string;
    created_at: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
    critical: {
        icon: AlertCircle,
        dot: "bg-rose-500",
        badge: "bg-rose-50 text-rose-600 border-rose-100",
        icon_class: "text-rose-500",
        label: "Critical",
    },
    warning: {
        icon: AlertTriangle,
        dot: "bg-amber-400",
        badge: "bg-amber-50 text-amber-600 border-amber-100",
        icon_class: "text-amber-500",
        label: "Warning",
    },
    info: {
        icon: Info,
        dot: "bg-blue-400",
        badge: "bg-blue-50 text-blue-600 border-blue-100",
        icon_class: "text-blue-500",
        label: "Info",
    },
};

const TYPE_ICON: Record<string, React.ElementType> = {
    payment_overdue: CreditCard,
    shipment_late: Ship,
    shipment_arriving: Ship,
    shipment_pending: Ship,
};

// ─── Component ────────────────────────────────────────────────────────────────
export function NotificationsPanel() {
    const { data, isLoading, isFetching } = useQuery<{
        count: number;
        results: Notification[];
    }>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS);
            return res.data;
        },
        refetchInterval: 60_000, // auto-refresh every 60 s
        staleTime: 30_000,
    });

    const notifications = data?.results ?? [];
    const count = data?.count ?? 0;
    const hasCritical = notifications.some((n) => n.severity === "critical");

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-slate-100/80 rounded-2xl h-12 w-12 transition-all duration-300 group shadow-sm bg-white/50"
                >
                    <Bell
                        className={cn(
                            "h-5 w-5 transition-all duration-300",
                            isFetching
                                ? "text-slate-400 animate-pulse"
                                : "text-slate-600 group-hover:text-[#1a365d]"
                        )}
                    />
                    {/* Count badge */}
                    <AnimatePresence>
                        {count > 0 && (
                            <motion.span
                                key="badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className={cn(
                                    "absolute right-2.5 top-2.5 h-4 min-w-[1rem] rounded-full border-2 border-white text-[9px] font-black flex items-center justify-center px-0.5 shadow-sm leading-none",
                                    hasCritical
                                        ? "bg-rose-500 text-white ring-2 ring-rose-500/20"
                                        : "bg-blue-500 text-white ring-2 ring-blue-500/20"
                                )}
                            >
                                {count > 9 ? "9+" : count}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="w-[380px] p-0 rounded-[2rem] border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] bg-white/95 backdrop-blur-2xl mt-4 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
                    <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">
                            Notifications
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                            {isLoading
                                ? "Loading…"
                                : count === 0
                                    ? "All clear"
                                    : `${count} active alert${count !== 1 ? "s" : ""}`}
                        </p>
                    </div>
                    {isFetching && (
                        <Loader2 className="h-4 w-4 text-slate-300 animate-spin" />
                    )}
                </div>

                {/* Body */}
                <ScrollArea className="max-h-[420px]">
                    {isLoading ? (
                        <div className="space-y-3 p-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-16 rounded-2xl bg-slate-50 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 gap-4 text-center px-6">
                            <div className="bg-emerald-50 p-5 rounded-2xl">
                                <CheckCheck className="h-8 w-8 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-700">
                                    All caught up!
                                </p>
                                <p className="text-xs text-slate-400 font-semibold mt-1">
                                    No shipment or payment alerts right now.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 space-y-2">
                            {notifications.map((notif) => {
                                const cfg = SEVERITY_CONFIG[notif.severity];
                                const SeverityIcon = cfg.icon;
                                const TypeIcon = TYPE_ICON[notif.type] ?? Bell;

                                return (
                                    <Link key={notif.id} href={notif.link}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer group",
                                                notif.severity === "critical"
                                                    ? "bg-rose-50/50 border-rose-100 hover:bg-rose-50"
                                                    : notif.severity === "warning"
                                                        ? "bg-amber-50/50 border-amber-100 hover:bg-amber-50"
                                                        : "bg-blue-50/50 border-blue-100 hover:bg-blue-50"
                                            )}
                                        >
                                            {/* Icon */}
                                            <div
                                                className={cn(
                                                    "flex-none p-2 rounded-xl",
                                                    notif.severity === "critical"
                                                        ? "bg-rose-100"
                                                        : notif.severity === "warning"
                                                            ? "bg-amber-100"
                                                            : "bg-blue-100"
                                                )}
                                            >
                                                <TypeIcon className={cn("h-4 w-4", cfg.icon_class)} />
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-xs font-black text-slate-800 truncate">
                                                        {notif.title}
                                                    </p>
                                                    <span
                                                        className={cn(
                                                            "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border flex-none",
                                                            cfg.badge
                                                        )}
                                                    >
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                                    {notif.message}
                                                </p>
                                            </div>

                                            {/* Severity dot */}
                                            <span
                                                className={cn(
                                                    "h-2 w-2 rounded-full flex-none mt-1",
                                                    cfg.dot
                                                )}
                                            />
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-50 flex justify-between items-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Auto-updates every 60s
                        </p>
                        <Link
                            href="/dashboard/shipments"
                            className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest transition-colors"
                        >
                            View All →
                        </Link>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
