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
  Truck,
  Plus,
  Search,
  RefreshCw,
  MoreVertical,
  MapPin,
  Flame,
  Scale,
  ArrowRightLeft,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogisticsReceiptForm } from "@/components/forms/LogisticsReceiptForm";

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

import { RoleGuard } from "@/components/auth/role-guard";

export default function LogisticsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: logisticsData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["logistics", searchQuery, page],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.LOGISTICS, {
        params: { search: searchQuery, page },
      });
      return response.data;
    },
  });

  const receipts = logisticsData?.results || [];
  const totalCount = logisticsData?.count || 0;
  const hasNext = !!logisticsData?.next;
  const hasPrev = !!logisticsData?.previous;

  const totalNetWeight =
    receipts?.reduce(
      (acc: number, r: any) => acc + parseFloat(r.net_received_kg || 0),
      0,
    ) || 0;
  const totalLosses =
    receipts?.reduce(
      (acc: number, r: any) =>
        acc +
        parseFloat(r.transport_loss_kg || 0) +
        parseFloat(r.freezing_loss_kg || 0),
      0,
    ) || 0;

  return (
    <RoleGuard allowedRoles={["Admin", "Logistics Agent", "Finance Agent"]}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12 p-4 lg:p-8"
      >
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
              Fleet <span className="text-emerald-700 italic">Registry</span>
            </h2>
            <p className="text-slate-500 font-semibold mt-3 text-lg">
              Monitoring facility receipts and{" "}
              <span className="text-emerald-600 font-black underline decoration-emerald-600/20 decoration-4 underline-offset-4">
                supply chain losses
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
                <Button className="rounded-2xl font-black bg-emerald-600 hover:bg-emerald-700 h-12 px-6 md:px-8 shadow-xl shadow-emerald-600/20 transition-all active:scale-95 text-white flex-1 md:flex-none justify-center whitespace-nowrap">
                  <Plus className="h-5 w-5 mr-3" /> RECORD RECEIPT
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] rounded-xl border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
                  <DialogTitle className="text-3xl font-black tracking-tight">
                    Facility Receipt
                  </DialogTitle>
                  <p className="text-emerald-100 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">
                    Inventory Inbound registry
                  </p>
                </div>
                <div className="p-8">
                  <LogisticsReceiptForm
                    onSuccess={() => setIsAddModalOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Analytics Summary */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-[#1a365d] text-white rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-emerald-500/20 transition-colors duration-700" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-2">
                    Net Inventory Inbound
                  </p>
                  <p className="text-5xl font-black tracking-tighter">
                    {totalNetWeight.toLocaleString()}{" "}
                    <span className="text-sm font-black text-blue-300/40">
                      KG
                    </span>
                  </p>
                </div>
                <div className="bg-white/10 p-5 rounded-xl backdrop-blur-md">
                  <Scale className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden relative group border border-slate-50">
            <div className="absolute top-0 right-0 w-48 h-48 bg-destructive/5 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-destructive/10 transition-colors duration-700" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Accumulated Losses
                  </p>
                  <p className="text-5xl font-black tracking-tighter text-destructive">
                    {totalLosses.toLocaleString()}{" "}
                    <span className="text-sm font-black text-destructive/40">
                      KG
                    </span>
                  </p>
                </div>
                <div className="bg-destructive/5 p-5 rounded-xl group-hover:bg-destructive/10 transition-colors">
                  <Flame className="h-8 w-8 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Area */}
        <motion.div variants={item} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by location or shipment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-16 rounded-[1.5rem] border-none bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-emerald-600/10 transition-all text-lg font-semibold placeholder:text-slate-300"
              />
            </div>
          </div>

          <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-slate-50 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                    Receipt{" "}
                    <span className="text-emerald-700 italic">Ledger</span>
                  </CardTitle>
                  <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    Port and Facility Registry
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
                        Location Node
                      </TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        Cargo Link
                      </TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        Net Weight
                      </TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        Loss Metrics (T / F)
                      </TableHead>
                      <TableHead className="text-right px-8 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        Log Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading
                      ? [1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i} className="border-slate-50 h-24">
                          <TableCell colSpan={5} className="px-8">
                            <Skeleton className="h-12 w-full rounded-2xl" />
                          </TableCell>
                        </TableRow>
                      ))
                      : receipts?.map((receipt: any) => (
                        <TableRow
                          key={receipt.id}
                          className="hover:bg-slate-50/50 transition-colors border-slate-50/50 group h-24"
                        >
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                              <div className="bg-slate-100 p-3 rounded-2xl text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                <MapPin className="h-5 w-5" />
                              </div>
                              <span className="font-black text-slate-900 text-lg tracking-tighter">
                                {receipt.facility_location}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] bg-slate-100 px-3 py-1 rounded-lg group-hover:bg-slate-200 transition-colors">
                              SHP-{receipt.shipment?.substring(0, 8) || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-black text-slate-900 text-lg tracking-tighter">
                              {receipt.net_received_kg}{" "}
                              <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">
                                KG
                              </span>
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3 text-[11px] font-black">
                              <span className="text-destructive px-2 py-1 bg-destructive/5 rounded-lg border border-destructive/10">
                                T: {receipt.transport_loss_kg}
                              </span>
                              <ArrowRightLeft className="h-3 w-3 text-slate-300" />
                              <span className="text-destructive px-2 py-1 bg-destructive/5 rounded-lg border border-destructive/10">
                                F: {receipt.freezing_loss_kg}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <span className="text-slate-400 font-black text-xs uppercase tracking-widest">
                              {formatDate(receipt.created_at, "MMM d, yyyy")}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between px-8 py-6 border-t border-slate-50 bg-slate-50/30">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Registry Index: {receipts.length} / {totalCount}
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrev}
                    className="px-6 rounded-2xl h-11 border-slate-200 font-black text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-white active:scale-95 transition-all shadow-sm"
                  >
                    PREVIOUS
                  </Button>
                  <div className="flex items-center justify-center px-6 bg-white border border-slate-100 text-emerald-600 rounded-2xl h-11 text-[11px] font-black shadow-sm">
                    PORT {page}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNext}
                    className="px-6 rounded-2xl h-11 border-slate-200 font-black text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-white active:scale-95 transition-all shadow-sm"
                  >
                    NEXT
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </RoleGuard>
  );
}
