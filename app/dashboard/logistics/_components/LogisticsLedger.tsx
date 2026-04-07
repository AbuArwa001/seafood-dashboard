import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Truck, MapPin, ArrowRightLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogisticsLedgerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
  isLoading: boolean;
  receipts: any[];
  page: number;
  setPage: (arg: any) => void;
  hasPrev: boolean;
  hasNext: boolean;
  itemVariants: any;
}

export function LogisticsLedger({
  searchQuery, setSearchQuery, totalCount, isLoading, receipts,
  page, setPage, hasPrev, hasNext, itemVariants
}: LogisticsLedgerProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by location or shipment ID..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 h-16 rounded-lg  border-none bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-emerald-600/10 transition-all text-lg font-semibold placeholder:text-slate-300"
          />
        </div>
      </div>

      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-lg  overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                Receipt <span className="text-emerald-700 italic">Ledger</span>
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600" /> Port and Facility Registry
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-50/50 h-16">
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 px-8">Location Node</TableHead>
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Cargo Link</TableHead>
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Net Weight</TableHead>
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Loss Metrics (T / F)</TableHead>
                  <TableHead className="text-right px-8 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Log Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i} className="border-slate-50 h-24">
                      <TableCell colSpan={5} className="px-8"><Skeleton className="h-12 w-full rounded-2xl" /></TableCell>
                    </TableRow>
                  ))
                ) : receipts?.map((receipt: any) => (
                  <TableRow key={receipt.id} className="hover:bg-slate-50/50 transition-colors border-slate-50/50 group h-24">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-slate-100 p-3 rounded-2xl text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <span className="font-black text-slate-900 text-lg tracking-tighter">{receipt.facility_location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] bg-slate-100 px-3 py-1 rounded-lg   group-hover:bg-slate-200 transition-colors">
                        SHP-{receipt.shipment?.substring(0, 8) || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-slate-900 text-lg tracking-tighter">
                        {receipt.net_received_kg} <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">KG</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3 text-[11px] font-black">
                        <span className="text-destructive px-2 py-1 bg-destructive/5 rounded-lg   border border-destructive/10">
                          T: {receipt.transport_loss_kg}
                        </span>
                        <ArrowRightLeft className="h-3 w-3 text-slate-300" />
                        <span className="text-destructive px-2 py-1 bg-destructive/5 rounded-lg   border border-destructive/10">
                          F: {receipt.freezing_loss_kg}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <span className="text-slate-400 font-black text-xs uppercase tracking-widest">{formatDate(receipt.created_at, "MMM d, yyyy")}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-8 py-6 border-t border-slate-50 bg-slate-50/30">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registry Index: {receipts.length} / {totalCount}</div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setPage((p: number) => Math.max(1, p - 1))} disabled={!hasPrev} className="px-6 rounded-2xl h-11 border-slate-200 font-black text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-white active:scale-95 transition-all shadow-sm">
                PREVIOUS
              </Button>
              <div className="flex items-center justify-center px-6 bg-white border border-slate-100 text-emerald-600 rounded-2xl h-11 text-[11px] font-black shadow-sm">
                PORT {page}
              </div>
              <Button variant="outline" onClick={() => setPage((p: number) => p + 1)} disabled={!hasNext} className="px-6 rounded-2xl h-11 border-slate-200 font-black text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-white active:scale-95 transition-all shadow-sm">
                NEXT
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
