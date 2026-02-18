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
  ShoppingCart,
  Plus,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  ArrowUpRight,
  TrendingUp,
  Package,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
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
import { SaleForm } from "@/components/forms/SaleForm";
import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { SalesCard } from "@/components/dashboard/SalesCard";

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

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: salesData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["sales", searchQuery, page],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SALES, {
        params: { search: searchQuery, page },
      });
      return response.data;
    },
  });

  const sales = salesData?.results || [];
  const totalCount = salesData?.count || 0;
  const hasNext = !!salesData?.next;
  const hasPrev = !!salesData?.previous;

  const totalSalesVolume =
    salesData?.results?.reduce(
      (acc: number, s: any) => acc + parseFloat(s.total_sale_amount || 0),
      0,
    ) || 0;

  return (
    <RoleGuard allowedRoles={["Admin", "Sales Agent", "Finance Agent"]}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12 p-4 lg:p-8"
      >
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
              Sales <span className="text-secondary italic">Ledger</span>
            </h2>
            <p className="text-slate-500 font-semibold mt-3 text-lg">
              Monitoring revenue generation and{" "}
              <span className="text-secondary font-black underline decoration-secondary/20 decoration-4 underline-offset-4">customer transactions</span>.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-2xl border-slate-200 h-12 w-12 hover:bg-slate-50 shadow-sm transition-all"
            >
              <RefreshCw
                className={`h-5 w-5 text-slate-600 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl font-black bg-secondary hover:bg-secondary/90 h-12 px-8 shadow-xl shadow-secondary/20 transition-all active:scale-95 text-white">
                  <Plus className="h-5 w-5 mr-3" /> RECORD SALE
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] rounded-xl border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -mt-10 -mr-10" />
                  <DialogTitle className="text-3xl font-black tracking-tight">
                    Post Transaction
                  </DialogTitle>
                  <p className="text-slate-400 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">
                    Revenue Entry registry
                  </p>
                </div>
                <div className="p-8">
                  <SaleForm onSuccess={() => setIsAddModalOpen(false)} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Analytics Summary */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <SalesCard
            totalSalesVolume={totalSalesVolume}
            salesData={sales}
          />
        </motion.div>

        {/* Content Area */}
        <motion.div variants={item} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by shipment ID or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-16 rounded-[1.5rem] border-none bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-secondary/10 transition-all text-lg font-semibold placeholder:text-slate-300"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-[1.5rem] h-16 px-8 border-none bg-white font-bold text-slate-600 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:bg-slate-50 transition-all gap-3"
            >
              <Filter className="h-5 w-5" />
              Advanced Filters
            </Button>
          </div>

          <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-slate-50 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                    Transaction <span className="text-secondary italic">History</span>
                  </CardTitle>
                  <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Live Sales Registry
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-50/50 h-16">
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 px-8">Reference ID</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Cargo Link</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Volume</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Unit Price</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Total Asset Value</TableHead>
                      <TableHead className="text-right px-8 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Entry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      [1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i} className="border-slate-50 h-24">
                          <TableCell colSpan={6} className="px-8">
                            <Skeleton className="h-12 w-full rounded-2xl" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : sales?.length > 0 ? (
                      sales.map((sale: any) => (
                        <TableRow
                          key={sale.id}
                          className="hover:bg-slate-50/50 transition-colors border-slate-50/50 group h-24"
                        >
                          <TableCell className="px-8 py-6">
                            <span className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] bg-slate-100 px-3 py-1 rounded-lg group-hover:bg-slate-200 transition-colors">
                              SAL-{sale.id.substring(0, 6)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="bg-slate-100 p-2.5 rounded-xl text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary transition-all">
                                <Package className="h-4 w-4" />
                              </div>
                              <span className="font-black text-slate-900 text-sm tracking-tight">
                                SHP#
                                {typeof sale.shipment === "string"
                                  ? sale.shipment.substring(0, 6)
                                  : sale.shipment?.id?.substring(0, 6) ||
                                  sale.id.substring(0, 6)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-black text-slate-900 leading-none text-lg tracking-tighter">
                                {sale.quantity_sold} {sale.unit?.code || "Units"}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                                {sale.kg_sold} KG TOTAL
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-black text-slate-600 tracking-tight">
                              {sale.currency?.symbol || "$"}
                              {sale.selling_price}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl font-black text-secondary tracking-tighter">
                                $
                                {parseFloat(
                                  sale.total_sale_amount,
                                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                              <div className="bg-emerald-50 p-1 rounded-lg">
                                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <span className="text-slate-400 font-black text-xs uppercase tracking-widest">
                              {formatDate(sale.created_at, "MMM d, yyyy")}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="bg-slate-50 p-10 rounded-xl">
                              <ShoppingCart className="h-16 w-16 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-black italic uppercase tracking-widest text-xs">
                              No records found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between px-8 py-6 border-t border-slate-50 bg-slate-50/30">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Registry Index: {sales.length} / {totalCount}
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
                  <div className="flex items-center justify-center px-6 bg-white border border-slate-100 text-secondary rounded-2xl h-11 text-[11px] font-black shadow-sm">
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
