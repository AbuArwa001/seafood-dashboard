import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, CreditCard, User, Calendar, CheckCircle2, Clock, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface PaymentsLedgerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  payments: any[];
  itemVariants: any;
}

export function PaymentsLedger({
  searchQuery, setSearchQuery, isLoading, payments, itemVariants
}: PaymentsLedgerProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by buyer name or transaction ID..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 h-16 rounded-lg  border-none bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-amber-500/10 transition-all text-lg font-semibold placeholder:text-slate-300"
          />
        </div>
      </div>

      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-lg  overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                Receivables <span className="text-amber-600 italic">History</span>
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-500" /> Financial Liquidation Stream
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
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i} className="border-slate-50 h-24">
                      <TableCell colSpan={5} className="px-8"><Skeleton className="h-12 w-full rounded-2xl" /></TableCell>
                    </TableRow>
                  ))
                ) : payments?.map((payment: any) => (
                  <TableRow key={payment.id} className="hover:bg-slate-50/50 transition-colors border-slate-50/50 group h-24">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-slate-100 p-3 rounded-2xl text-slate-400 group-hover:bg-[#1a365d] group-hover:text-white transition-all duration-300">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900 tracking-tighter leading-none mb-1">{payment.buyer_name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                            SALE REF: {payment.sale?.substring(0, 8) || "N/A"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                          {payment.currency?.symbol || "$"}{parseFloat(payment.amount_paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                          <CheckCircle2 className="h-3 w-3 mr-2" /> Paid {formatDate(payment.actual_payment_date, "MMM d")}
                        </div>
                      ) : (
                        <div className="inline-flex items-center bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-sm">
                          <Clock className="h-3 w-3 mr-2" /> Pending Collection
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <Button variant="ghost" size="icon" className="rounded-lg   hover:bg-slate-100 h-10 w-10">
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
  );
}
