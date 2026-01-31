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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users as UsersIcon,
  Plus,
  Search,
  RefreshCw,
  MoreVertical,
  Shield,
  MapPin,
  Mail,
  UserCheck,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from "@/components/forms/UserForm";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: usersData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["users", searchQuery, page],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS, {
        params: { search: searchQuery, page },
      });
      return response.data;
    },
  });

  const users = usersData?.results || [];
  const totalCount = usersData?.count || 0;
  const hasNext = !!usersData?.next;
  const hasPrev = !!usersData?.previous;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 p-2"
    >
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading">
            Team <span className="text-indigo-600 italic">Access</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Managing staff credentials and administrative privileges.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-white p-4 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-95 group border border-slate-50"
          >
            <RefreshCw
              className={`h-5 w-5 text-indigo-600 ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
            />
          </button>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <button className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl shadow-indigo-600/25 font-black flex items-center hover:bg-indigo-700 transition-all active:scale-95">
                <Plus className="h-5 w-5 mr-2" />
                PROVISION USER
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-indigo-600 p-6 text-white text-center">
                <DialogTitle className="text-2xl font-black">
                  New Team Member
                </DialogTitle>
                <p className="text-indigo-100 text-[10px] font-bold mt-1 uppercase tracking-widest">
                  Assign system credentials
                </p>
              </div>
              <div className="p-8">
                <UserForm onSuccess={() => setIsAddModalOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Analytics Summary */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="border-none shadow-premium bg-slate-900 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-700" />
          <CardContent className="pt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 font-heading">
                  Total Team Size
                </p>
                <p className="text-4xl font-black tracking-tighter">
                  {totalCount}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <UserCheck className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search staff by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black tracking-tight flex items-center">
                <UsersIcon className="h-5 w-5 mr-3 text-indigo-600" />
                Staff Directory
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                Role-Based Access Control Log
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="font-black text-slate-900 px-8 h-14">
                    STAFF MEMBER
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    ROLE
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    LOCATION
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    STATUS
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14 text-right px-8">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? [1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i} className="border-slate-50">
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-40" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24 rounded-lg" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24 rounded-lg" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 rounded-lg" />
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  : users?.map((user: any) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-slate-50/50 transition-colors border-slate-50"
                      >
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                              {user.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">
                                {user.full_name}
                              </p>
                              <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase">
                                <Mail className="h-2 w-2 mr-1" /> {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Shield className="h-3 w-3 text-indigo-500" />
                            <span className="font-black text-slate-600 text-xs uppercase tracking-wider">
                              {user.role?.role_name || "Staff"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-slate-500 font-bold text-sm">
                            <MapPin className="h-4 w-4 mr-2 opacity-50" />
                            {user.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-wider ${user.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}
                          >
                            {user.is_active ? "Active" : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <MoreVertical className="h-5 w-5 text-slate-400" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-8 py-4 border-t border-slate-50 bg-slate-50/30">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {users.length} of {totalCount} members
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev}
                  className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  PREVIOUS
                </button>
                <div className="flex items-center justify-center px-4 bg-indigo-600/10 text-indigo-600 rounded-xl text-xs font-black">
                  PAGE {page}
                </div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  NEXT
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
