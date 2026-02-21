"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Edit2,
  Trash2,
  Mail,
  MapPin,
  Shield,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";

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
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: userData,
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

  const isArray = Array.isArray(userData);
  const users = isArray ? userData : (userData?.results || []);
  const totalCount = isArray ? userData.length : (userData?.count || 0);
  const hasNext = !isArray && !!userData?.next;
  const hasPrev = !isArray && !!userData?.previous;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`${API_ENDPOINTS.USERS}${id}/`);
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete user");
    },
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 p-4 lg:p-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
            Team <span className="text-rose-600 italic">Management</span>
          </h2>
          <p className="text-slate-500 font-semibold mt-3 text-lg">
            Administrate operational staff and system{" "}
            <span className="text-rose-500 font-black underline decoration-rose-500/20 decoration-4 underline-offset-4">
              access privileges
            </span>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-2xl border-slate-200 h-12 w-12 hover:bg-slate-50 shadow-sm transition-all flex-none"
          >
            <RefreshCw
              className={`h-5 w-5 text-slate-600 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl font-black bg-rose-600 hover:bg-rose-700 h-12 px-6 md:px-8 shadow-xl shadow-rose-600/20 transition-all active:scale-95 flex-1 md:flex-none justify-center whitespace-nowrap">
                <Plus className="h-5 w-5 mr-3" /> ADD USER
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] rounded-xl border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
              <div className="bg-gradient-to-br from-rose-600 to-rose-700 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
                <DialogTitle className="text-3xl font-black tracking-tight">
                  New Account
                </DialogTitle>
                <p className="text-rose-100/70 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">
                  Register team member
                </p>
              </div>
              <div className="p-8">
                <UserForm onSuccess={() => setIsAddModalOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[650px] rounded-xl border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
                <DialogTitle className="text-3xl font-black tracking-tight">
                  Edit Account
                </DialogTitle>
                <p className="text-slate-300 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">
                  Modify team member profile
                </p>
              </div>
              <div className="p-8">
                {selectedUser && (
                  <UserForm
                    user={selectedUser}
                    onSuccess={() => setIsEditModalOpen(false)}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <motion.div variants={item} className="space-y-8">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search team members by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-14 h-16 rounded-[1.5rem] border-none bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-rose-500/10 transition-all text-lg font-semibold placeholder:text-slate-300"
          />
        </div>

        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="border-b border-slate-50 p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                  Team <span className="text-rose-600 italic">Directory</span>
                </CardTitle>
                <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  {totalCount} Verified Members
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-50/50 h-16">
                    <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 px-8">
                      Member Details
                    </TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      System Role
                    </TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Location
                    </TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Active
                    </TableHead>
                    <TableHead className="text-right px-8 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [1, 2, 3].map((i) => (
                      <TableRow key={i} className="border-slate-50 h-24">
                        <TableCell colSpan={5} className="px-8">
                          <Skeleton className="h-12 w-full rounded-2xl" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : users.length > 0 ? (
                    users.map((user: any) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-slate-50/50 transition-colors border-slate-50/50 group h-24"
                      >
                        <TableCell className="px-8">
                          <div className="flex items-center space-x-4">
                            <div className="bg-slate-100 h-12 w-12 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500">
                              <UsersIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 tracking-tighter text-lg leading-none mb-1">
                                {user.full_name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none flex items-center gap-1">
                                <Mail className="h-2.5 w-2.5" /> {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="rounded-xl border-rose-100 bg-rose-50/50 text-rose-600 font-black text-[10px] px-3 py-1 uppercase tracking-widest flex items-center w-fit gap-2"
                          >
                            <Shield className="h-3 w-3" />
                            {user.role_name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-slate-600 font-bold gap-2">
                            <MapPin className="h-4 w-4 text-slate-300" />
                            {user.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.is_active ? "default" : "secondary"}
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${user.is_active ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-200 text-slate-500"}`}
                          >
                            {user.is_active ? "Active" : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl hover:bg-slate-100 h-10 w-10"
                              >
                                <MoreVertical className="h-5 w-5 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] p-3 min-w-[200px] bg-white/95 backdrop-blur-xl"
                            >
                              <DropdownMenuItem
                                className="rounded-2xl font-black text-xs py-4 px-4 cursor-pointer text-slate-600 focus:bg-slate-50 focus:text-slate-900 transition-all"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4 mr-3 text-slate-300" />
                                EDIT PROFILE
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="rounded-2xl font-black text-xs py-4 px-4 cursor-pointer text-destructive focus:bg-destructive/5 focus:text-destructive transition-all"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${user.full_name}?`)) {
                                    deleteMutation.mutate(user.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-3 opacity-40" />
                                REMOVE ACCOUNT
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-6">
                          <div className="bg-slate-50 p-10 rounded-xl">
                            <UsersIcon className="h-16 w-16 text-slate-200" />
                          </div>
                          <p className="text-slate-400 font-black italic uppercase tracking-widest text-xs">
                            No team members matched "{searchQuery}"
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="p-8 border-t border-slate-50 flex items-center justify-between">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Page {page}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev || isFetching}
                  className="rounded-xl font-bold text-xs px-4"
                >
                  PREVIOUS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext || isFetching}
                  className="rounded-xl font-bold text-xs px-4"
                >
                  NEXT
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
