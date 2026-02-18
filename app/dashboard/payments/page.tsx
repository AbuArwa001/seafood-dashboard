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
  CreditCard,
  Plus,
  Search,
  RefreshCw,
  MoreVertical,
  Calendar,
  User,
  CheckCircle2,
  Clock,
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
import { PaymentForm } from "@/components/forms/PaymentForm";

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

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: payments,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["payments", searchQuery],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PAYMENTS, {
        params: { search: searchQuery },
      });
      return response.data.results || response.data;
    },
  });

  const totalPaid =
    payments?.reduce(
      (acc: number, p: any) =>
        p.actual_payment_date ? acc + parseFloat(p.amount_paid || 0) : acc,
      0,
    ) || 0;
  const pendingAmount =
    payments?.reduce(
      (acc: number, p: any) =>
        !p.actual_payment_date ? acc + parseFloat(p.amount_paid || 0) : acc,
      0,
    ) || 0;

  return (
    <RoleGuard allowedRoles={["Admin", "Finance Agent"]}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12 p-4 lg:p-8"
      >
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
              Receivables <span className="text-amber-600 italic">Management</span>
            </h2>
            <p className="text-slate-500 font-semibold mt-3 text-lg">
              Managing accounts receivable and{" "}
              <span className="text-amber-500 font-black underline decoration-amber-500/20 decoration-4 underline-offset-4">liquidation status</span>.
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
                <Button className="rounded-2xl font-black bg-[#1a365d] hover:bg-[#2c5282] h-12 px-6 md:px-8 shadow-xl shadow-[#1a365d]/20 transition-all active:scale-95 text-white flex-1 md:flex-none justify-center whitespace-nowrap">
                  <Plus className="h-5 w-5 mr-3" /> RECORD PAYMENT
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] rounded-xl border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
                  <DialogTitle className="text-3xl font-black tracking-tight">
                    Record Receipt
                  </DialogTitle>
                  <p className="text-amber-100 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">
                    Liquidation Entry Registry
                  </p>
                </div>
                <div className="p-8">
                  <PaymentForm onSuccess={() => setIsAddModalOpen(false)} />
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
          <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-emerald-600 text-white rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-white/10 transition-colors duration-700" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/60 mb-2">
                    Total Liquidated
                  </p>
                  <p className="text-5xl font-black tracking-tighter">
                    $
                    {totalPaid.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="bg-white/10 p-5 rounded-xl backdrop-blur-md">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-amber-500 text-white rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-white/10 transition-colors duration-700" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/60 mb-2">
                    Pending Collection
                  </p>
                  <p className="text-5xl font-black tracking-tighter">
                    $
                    {pendingAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="bg-white/10 p-5 rounded-xl backdrop-blur-md">
                  <Clock className="h-8 w-8 text-white" />
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
                placeholder="Search by buyer name or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-16 rounded-[1.5rem] border-none bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-amber-500/10 transition-all text-lg font-semibold placeholder:text-slate-300"
              />
            </div>
          </div>

          <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-slate-50 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                    Receivables <span className="text-amber-600 italic">History</span>
                  </CardTitle>
                  <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-amber-500" />
                    Financial Liquidation Stream
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-50/50 h-16">
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 px-8">Client / Buyer</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Settlement Amount</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Target Date</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Status</TableHead>
                      <TableHead className="text-right px-8 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Actions</TableHead>
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
                      : payments?.map((payment: any) => (
                        <TableRow
                          key={payment.id}
                          className="hover:bg-slate-50/50 transition-colors border-slate-50/50 group h-24"
                        >
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                              <div className="bg-slate-100 p-3 rounded-2xl text-slate-400 group-hover:bg-[#1a365d] group-hover:text-white transition-all duration-300">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-lg font-black text-slate-900 tracking-tighter leading-none mb-1">
                                  {payment.buyer_name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                                  SALE REF: {payment.sale?.substring(0, 8) || "N/A"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                {payment.currency?.symbol || "$"}
                                {parseFloat(payment.amount_paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center text-slate-900 font-black text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                                {formatDate(payment.expected_payment_date, "MMM d, yyyy")}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {payment.actual_payment_date ? (
                              <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                <CheckCircle2 className="h-3 w-3 mr-2" />
                                Paid {formatDate(payment.actual_payment_date, "MMM d")}
                              </div>
                            ) : (
                              <div className="inline-flex items-center bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-sm">
                                <Clock className="h-3 w-3 mr-2" />
                                Pending Collection
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 h-10 w-10">
                              <MoreVertical className="h-5 w-5 text-slate-400" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </RoleGuard>
  );
}
