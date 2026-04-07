import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, DollarSign, Layers, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface CostsLedgerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
  isLoading: boolean;
  costs: any[];
  page: number;
  setPage: (arg: any) => void;
  hasPrev: boolean;
  hasNext: boolean;
  itemVariants: any;
}

export function CostsLedger({
  searchQuery, setSearchQuery, totalCount, isLoading, costs,
  page, setPage, hasPrev, hasNext, itemVariants
}: CostsLedgerProps) {
  return (
    <>
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search costs by category or shipment ID..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black tracking-tight flex items-center">
                <DollarSign className="h-5 w-5 mr-3 text-destructive" /> Expenditure Log
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                Operational Overhead Stream
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="font-black text-slate-900 px-8 h-14">CATEGORY</TableHead>
                  <TableHead className="font-black text-slate-900 h-14">SHIPMENT</TableHead>
                  <TableHead className="font-black text-slate-900 h-14">ORIGINAL AMOUNT</TableHead>
                  <TableHead className="font-black text-slate-900 h-14">CONVERTED (USD)</TableHead>
                  <TableHead className="font-black text-slate-900 h-14 text-right px-8">DATE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i} className="border-slate-50">
                      <TableCell className="px-8 py-6"><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="text-right px-8"><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : costs?.map((cost: any) => (
                  <TableRow key={cost.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-destructive/10 p-2.5 rounded-lg text-destructive">
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{cost.cost_category}</p>
                          {cost.other_category && (
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cost.other_category}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-600 text-sm">
                        SHP-{cost.shipment?.substring(0, 8) || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-black text-slate-900">
                          {cost.currency?.symbol || "$"}{parseFloat(cost.amount).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{cost.currency?.code}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="h-3 w-3 text-slate-300" />
                        <span className="text-lg font-black text-destructive tracking-tighter">
                          ${parseFloat(cost.converted_amount).toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <span className="text-slate-500 font-bold text-sm">{formatDate(cost.created_at, "MMM d, yyyy")}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-8 py-4 border-t border-slate-50 bg-slate-50/30">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {costs.length} of {totalCount} records
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setPage((p: number) => Math.max(1, p - 1))} disabled={!hasPrev} className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors">
                  PREVIOUS
                </button>
                <div className="flex items-center justify-center px-4 bg-destructive/10 text-destructive rounded-lg text-xs font-black">
                  PAGE {page}
                </div>
                <button onClick={() => setPage((p: number) => p + 1)} disabled={!hasNext} className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors">
                  NEXT
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
