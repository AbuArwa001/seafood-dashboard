"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  RefreshCw,
  Activity,
  User,
  Database,
  CalendarDays,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { RoleGuard } from "@/components/auth/role-guard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  UPDATE: "bg-amber-100 text-amber-700 border-amber-200",
  DELETE: "bg-rose-100 text-rose-700 border-rose-200",
  LOGIN: "bg-blue-100 text-blue-700 border-blue-200",
  LOGOUT: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function DataLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const {
    data: logsData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["audit_logs", searchQuery, actionFilter, page],
    queryFn: async () => {
      const params: any = { search: searchQuery, page };
      if (actionFilter !== "ALL") params.action = actionFilter;
      const response = await apiClient.get(API_ENDPOINTS.AUDIT.LOGS, { params });
      return response.data;
    },
  });

  const logs = logsData?.results || [];
  const totalCount = logsData?.count || 0;
  const hasNext = !!logsData?.next;
  const hasPrev = !!logsData?.previous;

  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-10 p-2"
      >
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading">
              System <span className="text-indigo-600 italic">Audit Logs</span>
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              Comprehensive security and operational activity tracker.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-white p-4 rounded-2xl shadow-premium border border-slate-50 hover:bg-slate-50 transition-all active:scale-95 group flex items-center"
            >
              <RefreshCw
                className={`h-5 w-5 text-indigo-600 ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
              />
            </button>
          </div>
        </header>

        {/* Filters */}
        <motion.div variants={item}>
          <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search logs by object or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={actionFilter} onValueChange={(val) => { setActionFilter(val); setPage(1); }}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-semibold px-4">
                    <SelectValue placeholder="Filter by Action" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl font-medium">
                    <SelectItem value="ALL">All Actions</SelectItem>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div variants={item}>
          <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between bg-white">
              <div>
                <CardTitle className="text-xl font-black tracking-tight flex items-center">
                  <Activity className="h-5 w-5 mr-3 text-indigo-600" />
                  Activity Stream
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">
                  Immutable security records
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-50">
                    <TableHead className="font-black text-slate-900 px-8 h-14 w-48">USER</TableHead>
                    <TableHead className="font-black text-slate-900 h-14 w-32">ACTION</TableHead>
                    <TableHead className="font-black text-slate-900 h-14 w-48">MODULE</TableHead>
                    <TableHead className="font-black text-slate-900 h-14">DETAILS / RECORD</TableHead>
                    <TableHead className="font-black text-slate-900 h-14 text-right px-8 w-48">TIMESTAMP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? [1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i} className="border-slate-50">
                          <TableCell className="px-8 py-5"><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                          <TableCell className="text-right px-8"><Skeleton className="h-5 w-32 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    : logs?.map((log: any) => (
                        <TableRow key={log.id} className="hover:bg-slate-50/70 transition-colors border-slate-50">
                          {/* User */}
                          <TableCell className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="bg-slate-100 p-2 rounded-lg text-slate-500 flex-none hidden sm:block">
                                <User className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-slate-900 truncate">
                                  {log.user_details ? `${log.user_details.first_name} ${log.user_details.last_name}`.trim() || log.user_details.email : "System"}
                                </span>
                                {log.user_details && (
                                  <span className="text-[10px] text-slate-400 font-semibold truncate uppercase tracking-wider">
                                    {log.user_details.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          
                          {/* Action */}
                          <TableCell>
                            <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-700"}`}>
                              {log.action}
                            </span>
                          </TableCell>
                          
                          {/* Module */}
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                              <Database className="h-3.5 w-3.5 text-slate-400" />
                              <span className="capitalize">{log.content_type_name || "Unknown"}</span>
                            </div>
                          </TableCell>
                          
                          {/* Details */}
                          <TableCell>
                            <div className="flex flex-col">
       <span className="text-sm font-bold text-slate-800 line-clamp-1">{log.object_repr || `Object ID: ${log.object_id}`}</span>
                              <span className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                {log.details ? JSON.stringify(log.details) : `Record ID: ${log.object_id}`}
                              </span>
                            </div>
                          </TableCell>
                          
                          {/* Timestamp */}
                          <TableCell className="text-right px-8">
                            <div className="flex items-center justify-end gap-2 text-sm text-slate-600 font-medium">
                              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                              {formatDate(log.timestamp, "MMM d, yyyy h:mm a")}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  {logs.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48 text-center text-slate-500 font-medium">
                        No logs found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <div className="flex items-center justify-between px-8 py-4 border-t border-slate-50 bg-slate-50/30">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Showing {logs.length} of {totalCount} records
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrev}
                    className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors"
                  >
                    PREVIOUS
                  </button>
                  <div className="flex items-center justify-center px-4 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black">
                    PAGE {page}
                  </div>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNext}
                    className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </RoleGuard>
  );
}
