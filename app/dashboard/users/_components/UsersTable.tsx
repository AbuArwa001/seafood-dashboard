import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users as UsersIcon, Search, MoreVertical, Edit2, Trash2, Mail, MapPin, Shield } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface UsersTableProps {
  users: any[];
  isLoading: boolean;
  isFetching: boolean;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  setPage: (p: any) => void;
  page: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  setSelectedUser: (u: any) => void;
  setIsEditModalOpen: (b: boolean) => void;
  deleteMutation: any;
  itemVariants: any;
}

export function UsersTable({
  users, isLoading, isFetching, searchQuery, setSearchQuery, setPage, page, totalCount, hasNext, hasPrev,
  setSelectedUser, setIsEditModalOpen, deleteMutation, itemVariants
}: UsersTableProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search team members by name or email..." value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          className="pl-14 h-16 rounded-lg  border-none bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-rose-500/10 transition-all text-lg font-semibold placeholder:text-slate-300"
        />
      </div>

      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-lg  overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                Team <span className="text-rose-600 italic">Directory</span>
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                <UsersIcon className="h-4 w-4" /> {totalCount} Verified Members
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-50/50 h-16">
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 px-8">Member Details</TableHead>
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">System Role</TableHead>
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Location</TableHead>
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Active</TableHead>
                  <TableHead className="text-right px-8 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3].map((i) => <TableRow key={i} className="border-slate-50 h-24"><TableCell colSpan={5} className="px-8"><Skeleton className="h-12 w-full rounded-2xl" /></TableCell></TableRow>)
                ) : users.length > 0 ? (
                  users.map((user: any) => (
                    <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors border-slate-50/50 group h-24">
                      <TableCell className="px-8">
                        <div className="flex items-center space-x-4">
                          <div className="bg-slate-100 h-12 w-12 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500"><UsersIcon className="h-6 w-6" /></div>
                          <div>
                            <p className="font-black text-slate-900 tracking-tighter text-lg leading-none mb-1">{user.full_name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none flex items-center gap-1"><Mail className="h-2.5 w-2.5" /> {user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-lg   border-rose-100 bg-rose-50/50 text-rose-600 font-black text-[10px] px-3 py-1 uppercase tracking-widest flex items-center w-fit gap-2"><Shield className="h-3 w-3" /> {user.role_name}</Badge>
                      </TableCell>
                      <TableCell><div className="flex items-center text-slate-600 font-bold gap-2"><MapPin className="h-4 w-4 text-slate-300" /> {user.location}</div></TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "secondary"} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${user.is_active ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-200 text-slate-500"}`}>{user.is_active ? "Active" : "Disabled"}</Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg   hover:bg-slate-100 h-10 w-10"><MoreVertical className="h-5 w-5 text-slate-400" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-lg   border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] p-3 min-w-[200px] bg-white/95 backdrop-blur-xl">
                            <DropdownMenuItem className="rounded-2xl font-black text-xs py-4 px-4 cursor-pointer text-slate-600 focus:bg-slate-50 focus:text-slate-900 transition-all" onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}><Edit2 className="h-4 w-4 mr-3 text-slate-300" /> EDIT PROFILE</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-2xl font-black text-xs py-4 px-4 cursor-pointer text-destructive focus:bg-destructive/5 focus:text-destructive transition-all" onClick={() => { if (confirm(`Are you sure you want to delete ${user.full_name}?`)) { deleteMutation.mutate(user.id); } }}><Trash2 className="h-4 w-4 mr-3 opacity-40" /> REMOVE ACCOUNT</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-slate-50 p-10 rounded-lg  "><UsersIcon className="h-16 w-16 text-slate-200" /></div>
                        <p className="text-slate-400 font-black italic uppercase tracking-widest text-xs">No team members matched "{searchQuery}"</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-8 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Page {page}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p: number) => Math.max(1, p - 1))} disabled={!hasPrev || isFetching} className="rounded-lg   font-bold text-xs px-4">PREVIOUS</Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p: number) => p + 1)} disabled={!hasNext || isFetching} className="rounded-lg   font-bold text-xs px-4">NEXT</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
