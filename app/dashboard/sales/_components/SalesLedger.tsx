import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ShoppingCart, Package, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface SalesLedgerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
  isLoading: boolean;
  sales: any[];
  page: number;
  setPage: (arg: any) => void;
  hasPrev: boolean;
  hasNext: boolean;
  itemVariants: any;
}

export function SalesLedger({
  searchQuery, setSearchQuery, totalCount, isLoading, sales,
  page, setPage, hasPrev, hasNext, itemVariants
}: SalesLedgerProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by shipment ID or amount..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 h-16 rounded-lg  border-none bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-secondary/10 transition-all text-lg font-semibold placeholder:text-slate-300"
          />
        </div>
        <Button variant="outline" className="rounded-lg  h-16 px-8 border-none bg-white font-bold text-slate-600 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:bg-slate-50 transition-all gap-3">
          <Filter className="h-5 w-5" /> Advanced Filters
        </Button>
      </div>

      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-lg  overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                Transaction <span className="text-secondary italic">History</span>
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" /> Live Sales Registry
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
                      <TableCell colSpan={6} className="px-8"><Skeleton className="h-12 w-full rounded-2xl" /></TableCell>
                    </TableRow>
                  ))
                ) : sales?.length > 0 ? (
                  sales.map((sale: any) => (
                    <TableRow key={sale.id} className="hover:bg-slate-50/50 transition-colors border-slate-50/50 group h-24">
                      <TableCell className="px-8 py-6">
                        <span className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] bg-slate-100 px-3 py-1 rounded-lg   group-hover:bg-slate-200 transition-colors">
                          SAL-{sale.id.substring(0, 6)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-slate-100 p-2.5 rounded-lg   text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary transition-all">
                            <Package className="h-4 w-4" />
                          </div>
                          <span className="font-black text-slate-900 text-sm tracking-tight">
                            SHP#{typeof sale.shipment === "string" ? sale.shipment.substring(0, 6) : sale.shipment?.id?.substring(0, 6) || sale.id.substring(0, 6)}
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
                          {sale.currency?.symbol || "$"}{sale.selling_price}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-black text-secondary tracking-tighter">
                            ${parseFloat(sale.total_sale_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <div className="bg-emerald-50 p-1 rounded-lg  "><ArrowUpRight className="h-4 w-4 text-emerald-500" /></div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <span className="text-slate-400 font-black text-xs uppercase tracking-widest">{formatDate(sale.created_at, "MMM d, yyyy")}</span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-slate-50 p-10 rounded-lg  "><ShoppingCart className="h-16 w-16 text-slate-200" /></div>
                        <p className="text-slate-400 font-black italic uppercase tracking-widest text-xs">No records found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-8 py-6 border-t border-slate-50 bg-slate-50/30">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registry Index: {sales.length} / {totalCount}</div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setPage((p: number) => Math.max(1, p - 1))} disabled={!hasPrev} className="px-6 rounded-2xl h-11 border-slate-200 font-black text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-white active:scale-95 transition-all shadow-sm">
                PREVIOUS
              </Button>
              <div className="flex items-center justify-center px-6 bg-white border border-slate-100 text-secondary rounded-2xl h-11 text-[11px] font-black shadow-sm">
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
