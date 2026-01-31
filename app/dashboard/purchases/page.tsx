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
  ShoppingBag,
  Plus,
  Search,
  RefreshCw,
  MoreVertical,
  ImageIcon,
  Scale,
  Anchor,
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
import { PurchaseForm } from "@/components/forms/PurchaseForm";

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

export default function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: purchasesData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["purchases", searchQuery, page],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PURCHASES, {
        params: { search: searchQuery, page },
      });
      return response.data;
    },
  });

  const purchases = purchasesData?.results || [];
  const totalCount = purchasesData?.count || 0;
  const hasNext = !!purchasesData?.next;
  const hasPrev = !!purchasesData?.previous;

  const totalKg =
    purchases?.reduce(
      (acc: number, p: any) => acc + parseFloat(p.kg_purchased || 0),
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
            Supplier <span className="text-blue-600 italic">Procurement</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Managing inbound inventory and supplier transactions.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-white p-4 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-95 group border border-slate-50"
          >
            <RefreshCw
              className={`h-5 w-5 text-blue-600 ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
            />
          </button>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <button className="bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-xl shadow-blue-600/25 font-black flex items-center hover:bg-blue-700 transition-all active:scale-95">
                <Plus className="h-5 w-5 mr-2" />
                NEW PURCHASE
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-blue-600 p-6 text-white text-center">
                <DialogTitle className="text-2xl font-black">
                  Supplier Purchase
                </DialogTitle>
                <p className="text-blue-100 text-[10px] font-bold mt-1 uppercase tracking-widest">
                  Inventory Procurement Registry
                </p>
              </div>
              <div className="p-8">
                <PurchaseForm onSuccess={() => setIsAddModalOpen(false)} />
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-700" />
          <CardContent className="pt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 font-heading">
                  Total Procurement
                </p>
                <p className="text-4xl font-black tracking-tighter">
                  {totalKg.toLocaleString()} KG
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <Scale className="h-6 w-6 text-blue-600" />
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
                placeholder="Search purchases by shipment or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Purchases Table */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black tracking-tight flex items-center">
                <ShoppingBag className="h-5 w-5 mr-3 text-blue-600" />
                Procurement Log
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                Supplier Supply Chain Stream
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="font-black text-slate-900 px-8 h-14">
                    PURCHASE ID
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    SHIPMENT
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    VOLUME
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    CURRENCY
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    DOCUMENT
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14 text-right px-8">
                    DATE
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? [1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i} className="border-slate-50">
                        <TableCell className="px-8 py-6">
                          <Skeleton className="h-6 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-12" />
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <Skeleton className="h-6 w-24 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  : purchases?.map((purchase: any) => (
                      <TableRow
                        key={purchase.id}
                        className="hover:bg-slate-50/50 transition-colors border-slate-50 group"
                      >
                        <TableCell className="px-8 py-6">
                          <span className="font-black text-slate-400 text-xs uppercase tracking-tighter">
                            PUR-{purchase.id.substring(0, 8)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Anchor className="h-4 w-4 text-slate-400" />
                            <span className="font-bold text-slate-600">
                              SHP-{purchase.shipment?.substring(0, 8) || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-black text-slate-900">
                            {purchase.kg_purchased} KG
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-slate-500 uppercase">
                          {purchase.currency?.code || "USD"}
                        </TableCell>
                        <TableCell>
                          {purchase.image_url ? (
                            <button className="bg-blue-50 text-blue-600 p-2 rounded-xl hover:bg-blue-100 transition-colors">
                              <ImageIcon className="h-4 w-4" />
                            </button>
                          ) : (
                            <span className="text-slate-300 italic text-xs font-bold">
                              No Image
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <span className="text-slate-500 font-bold text-sm">
                            {formatDate(purchase.created_at, "MMM d, yyyy")}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-8 py-4 border-t border-slate-50 bg-slate-50/30">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {purchases.length} of {totalCount} records
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev}
                  className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  PREVIOUS
                </button>
                <div className="flex items-center justify-center px-4 bg-blue-600/10 text-blue-600 rounded-xl text-xs font-black">
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
