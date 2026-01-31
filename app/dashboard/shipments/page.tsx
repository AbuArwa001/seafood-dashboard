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
  Ship,
  Plus,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Anchor,
  Globe,
  Truck,
  Box,
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
import { ShipmentForm } from "@/components/forms/ShipmentForm";

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

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: shipmentsData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["shipments", searchQuery, page],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS, {
        params: { search: searchQuery, page },
      });
      return response.data;
    },
  });

  const shipments = shipmentsData?.results || [];
  const totalCount = shipmentsData?.count || 0;
  const hasNext = !!shipmentsData?.next;
  const hasPrev = !!shipmentsData?.previous;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "COMPLETED":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "IN_TRANSIT":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

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
            Cargo <span className="text-primary italic">Manifest</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Real-time tracking of seafood shipments across international waters.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-white p-4 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-95 group border border-slate-50"
          >
            <RefreshCw
              className={`h-5 w-5 text-primary ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
            />
          </button>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <button className="bg-primary text-white px-6 py-4 rounded-2xl shadow-xl shadow-primary/25 font-black flex items-center hover:bg-primary/90 transition-all active:scale-95">
                <Plus className="h-5 w-5 mr-2" />
                LOG SHIPMENT
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-primary p-6 text-white text-center">
                <DialogTitle className="text-2xl font-black">
                  New Shipment
                </DialogTitle>
                <p className="text-primary-foreground/80 text-[10px] font-bold mt-1 uppercase tracking-widest">
                  Initialize cargo registry
                </p>
              </div>
              <div className="p-8">
                <ShipmentForm onSuccess={() => setIsAddModalOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Analytics Summary */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="border-none shadow-premium bg-slate-900 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-700" />
          <CardContent className="pt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 font-heading">
                  Total Shipments
                </p>
                <p className="text-4xl font-black tracking-tighter">
                  {totalCount}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <Anchor className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-premium bg-white h-full relative overflow-hidden group border border-slate-50">
          <CardContent className="pt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 font-heading">
                  Active Transit
                </p>
                <p className="text-4xl font-black tracking-tighter text-slate-900">
                  {shipments?.filter((s: any) => s.status === "IN_TRANSIT")
                    .length || 0}
                </p>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl group-hover:bg-amber-100 transition-colors">
                <Truck className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search by ID, origin, or vessel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
                />
              </div>
              <button className="flex items-center justify-center space-x-2 px-6 h-14 bg-white border border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Filter className="h-5 w-5" />
                <span>Advanced Search</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shipments Table */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black tracking-tight flex items-center">
                <Ship className="h-5 w-5 mr-3 text-primary" />
                Global Fleet Tracking
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                Active Cargo Log
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="font-black text-slate-900 px-8 h-14">
                    REFERENCE
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    ORIGIN
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    CURRENCY
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    LOGISTICS
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
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i} className="border-slate-50">
                      <TableCell className="px-8 py-6">
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : shipments?.length > 0 ? (
                  shipments.map((shipment: any) => (
                    <TableRow
                      key={shipment.id}
                      className="hover:bg-slate-50/50 transition-colors border-slate-50 group"
                    >
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/5 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <Box className="h-4 w-4" />
                          </div>
                          <span className="font-black text-slate-900 tracking-tighter uppercase">
                            SHP-{shipment.id.substring(0, 8)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-slate-400" />
                          <span className="font-bold text-slate-600">
                            {shipment.country_origin}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-slate-500 uppercase">
                        {shipment.currency?.code || "USD"}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-slate-400">
                          {shipment.items?.length || 0} Unique Items
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-wider ${getStatusStyle(shipment.status)}`}
                        >
                          {shipment.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                              <MoreVertical className="h-5 w-5 text-slate-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]"
                          >
                            <DropdownMenuItem className="rounded-xl font-bold py-3 cursor-pointer">
                              View Cargo Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold py-3 cursor-pointer text-primary focus:text-primary">
                              Track Vessel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <p className="text-slate-400 font-bold italic">
                        No shipments matching your search found.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-8 py-4 border-t border-slate-50 bg-slate-50/30">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {shipments.length} of {totalCount} shipments
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev}
                  className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  PREVIOUS
                </button>
                <div className="flex items-center justify-center px-4 bg-primary/10 text-primary rounded-xl text-xs font-black">
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
