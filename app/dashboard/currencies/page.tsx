"use client";

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
import {
  Banknote,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  MoreVertical,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CurrencyForm } from "@/components/forms/CurrencyForm";
import { useState } from "react";
import { toast } from "sonner";

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

export default function CurrenciesPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<any>(null);
  const [page, setPage] = useState(1);

  const {
    data: currencyData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["currencies", page],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CURRENCIES, {
        params: { page },
      });
      return response.data;
    },
  });

  const currencies = currencyData?.results || [];
  const totalCount = currencyData?.count || 0;
  const hasNext = !!currencyData?.next;
  const hasPrev = !!currencyData?.previous;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`${API_ENDPOINTS.CURRENCIES}${id}/`);
    },
    onSuccess: () => {
      toast.success("Currency deleted");
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail ||
        "Delete failed. This currency might be in use.",
      );
    },
  });

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
            Currency <span className="text-primary italic">Vault</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Configure global currencies used for pricing, cost, and logistics.
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
                NEW CURRENCY
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-primary p-6 text-white text-center">
                <DialogTitle className="text-2xl font-black">
                  Register Currency
                </DialogTitle>
                <p className="text-primary-foreground/80 text-[10px] font-bold mt-1 uppercase tracking-widest">
                  Add to global treasury system
                </p>
              </div>
              <div className="p-8">
                <CurrencyForm onSuccess={() => setIsAddModalOpen(false)} />
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
        <Card className="border-none shadow-premium bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mt-10 -mr-10" />
          <CardContent className="pt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                  Total Currencies
                </p>
                <p className="text-4xl font-black">{totalCount}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <Banknote className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Currencies Table */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black tracking-tight">
                Active Currencies
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                Treasury Master List
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="font-black text-slate-900 px-8 h-14">
                    CODE
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    NAME
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14 text-center">
                    SYMBOL
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14 text-right px-8">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? [1, 2, 3].map((i) => (
                    <TableRow key={i} className="border-slate-50">
                      <TableCell className="px-8 py-6">
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-8 mx-auto" />
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                  : currencies?.map((curr: any) => (
                    <TableRow
                      key={curr.id}
                      className="hover:bg-slate-50/50 transition-colors border-slate-50"
                    >
                      <TableCell className="px-8 py-6">
                        <div className="bg-primary/10 text-primary font-black px-3 py-1 rounded-lg text-center inline-block">
                          {curr.code}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-700">
                        {curr.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="bg-slate-100 p-2 rounded-xl font-black text-slate-500 w-10 inline-block text-center">
                          {curr.symbol || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setEditingCurrency(curr)}
                            className="p-2 text-slate-400 hover:text-primary transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this currency?"))
                                deleteMutation.mutate(curr.id);
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-8 py-4 border-t border-slate-50 bg-slate-50/30">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {currencies.length} of {totalCount} currencies
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

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCurrency}
        onOpenChange={(open) => !open && setEditingCurrency(null)}
      >
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-slate-900 p-6 text-white text-center">
            <DialogTitle className="text-2xl font-black">
              Edit Currency
            </DialogTitle>
            <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">
              Modify currency properties
            </p>
          </div>
          <div className="p-8">
            <CurrencyForm
              initialData={editingCurrency}
              onSuccess={() => setEditingCurrency(null)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
