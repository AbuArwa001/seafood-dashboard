import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, ChevronRight, Calendar, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface ExchangeRatesTableProps {
  totalRates: number;
  isLoading: boolean;
  rates: any[];
  page: number;
  setPage: (arg: any) => void;
  hasPrev: boolean;
  hasNext: boolean;
  itemVariants: any;
}

export function ExchangeRatesTable({
  totalRates, isLoading, rates, page, setPage, hasPrev, hasNext, itemVariants
}: ExchangeRatesTableProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black tracking-tight flex items-center">
              <ArrowRightLeft className="h-5 w-5 mr-3 text-primary" /> Currency Conversion Matrix
            </CardTitle>
            <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">Active Treasury Rates</p>
          </div>
          <Badge variant="outline" className="rounded-full border-primary/20 text-primary font-black px-4 py-1">
            {totalRates} ACTIVE PAIRS
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-50">
                <TableHead className="font-black text-slate-900 px-8 h-14">CURRENCY PAIR</TableHead>
                <TableHead className="font-black text-slate-900 h-14">EXCHANGE RATE</TableHead>
                <TableHead className="font-black text-slate-900 h-14">EFFECTIVE DATE</TableHead>
                <TableHead className="font-black text-slate-900 h-14 text-right px-8">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i} className="border-slate-50">
                    <TableCell className="px-8 py-6"><Skeleton className="h-8 w-32 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-40 rounded-lg" /></TableCell>
                    <TableCell className="text-right px-8"><Skeleton className="h-8 w-20 ml-auto rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : rates?.length > 0 ? (
                rates.map((rate: any) => (
                  <TableRow key={rate.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-lg"><span className="font-black text-primary text-xs">{rate.from_currency.code}</span></div>
                        <ChevronRight className="h-3 w-3 text-slate-300" />
                        <div className="bg-secondary/10 p-2 rounded-lg"><span className="font-black text-secondary text-xs">{rate.to_currency.code}</span></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-black text-slate-900 tracking-tighter">{rate.rate}</span>
                        <span className="text-[10px] font-bold text-slate-400">{rate.to_currency.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-slate-500 font-medium">
                        <Calendar className="h-4 w-4 mr-2 opacity-50" /> {formatDate(rate.rate_date, "PPP")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex items-center justify-end">
                        <div className="flex items-center bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <TrendingUp className="h-3 w-3 mr-1" /> Active
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <p className="text-slate-400 font-bold italic">No exchange rates found.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-8 py-4 border-t border-slate-50 bg-slate-50/30">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {rates.length} of {totalRates} pairs</div>
            <div className="flex space-x-2">
              <button onClick={() => setPage((p: number) => Math.max(1, p - 1))} disabled={!hasPrev} className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors">
                PREVIOUS
              </button>
              <div className="flex items-center justify-center px-4 bg-primary/10 text-primary rounded-lg text-xs font-black">PAGE {page}</div>
              <button onClick={() => setPage((p: number) => p + 1)} disabled={!hasNext} className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors">
                NEXT
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
