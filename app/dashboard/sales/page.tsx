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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 p-2"
    >
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading">
            Sales <span className="text-secondary italic">Ledger</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Monitoring revenue generation and customer transactions.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-white p-4 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-95 group border border-slate-50"
          >
            <RefreshCw
              className={`h-5 w-5 text-secondary ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
            />
          </button>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <button className="bg-secondary text-white px-6 py-4 rounded-2xl shadow-xl shadow-secondary/25 font-black flex items-center hover:bg-secondary/90 transition-all active:scale-95">
                <Plus className="h-5 w-5 mr-2" />
                RECORD SALE
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-secondary p-6 text-white text-center">
                <DialogTitle className="text-2xl font-black text-white">
                  Capture Transaction
                </DialogTitle>
                <p className="text-white/80 text-[10px] font-bold mt-1 uppercase tracking-widest">
                  Post-shipment revenue entry
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
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="border-none shadow-premium bg-slate-900 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-700" />
          <CardContent className="pt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 font-heading">
                  Accumulated Revenue
                </p>
                <p className="text-4xl font-black tracking-tighter">
                  $
                  {totalSalesVolume.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search by shipment ID or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
                />
              </div>
              <button className="flex items-center justify-center space-x-2 px-6 h-14 bg-white border border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sales Table */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black tracking-tight flex items-center">
                <ShoppingCart className="h-5 w-5 mr-3 text-secondary" />
                Transaction History
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                Real-time sales tracking
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="font-black text-slate-900 px-8 h-14">
                    REF #
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    SHIPMENT
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    QUANTITY
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    PRICE
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    TOTAL AMOUNT
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14 text-right px-8">
                    DATE
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i} className="border-slate-50">
                      <TableCell className="px-8 py-6">
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32" />
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Skeleton className="h-6 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sales?.length > 0 ? (
                  sales.map((sale: any) => (
                    <TableRow
                      key={sale.id}
                      className="hover:bg-slate-50/50 transition-colors border-slate-50"
                    >
                      <TableCell className="px-8 py-6">
                        <span className="font-black text-slate-400 text-xs uppercase tracking-tighter">
                          SAL-{sale.id.substring(0, 6)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500">
                            <Package className="h-3 w-3" />
                          </div>
                          <span className="font-bold text-slate-700 text-sm">
                            SHP#
                            {sale.shipment?.substring(0, 6) ||
                              sale.id.substring(0, 6)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-black text-slate-900 leading-none">
                            {sale.quantity_sold} {sale.unit?.code || "Units"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {sale.kg_sold} KG Total
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-600">
                          {sale.currency?.symbol || "$"}
                          {sale.selling_price}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-black text-secondary tracking-tighter">
                            $
                            {parseFloat(
                              sale.total_sale_amount,
                            ).toLocaleString()}
                          </span>
                          <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <span className="text-slate-500 font-bold text-sm">
                          {formatDate(sale.created_at, "MMM d, yyyy")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <p className="text-slate-400 font-bold italic">
                        No sales records found.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-8 py-4 border-t border-slate-50 bg-slate-50/30">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {sales.length} of {totalCount} transactions
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev}
                  className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  PREVIOUS
                </button>
                <div className="flex items-center justify-center px-4 bg-secondary/10 text-secondary rounded-xl text-xs font-black">
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
