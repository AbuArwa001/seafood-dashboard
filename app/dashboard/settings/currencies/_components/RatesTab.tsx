import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface RatesTabProps {
  rates: any[];
  loadingRates: boolean;
  itemVariants: any;
}

export function RatesTab({ rates, loadingRates, itemVariants }: RatesTabProps) {
  return (
    <motion.div variants={itemVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-8">
      <Card className="border-none shadow-[0_20px_50px_-15_rgba(0,0,0,0.05)] bg-white rounded-lgoverflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50">
          <div>
            <CardTitle className="text-2xl font-black text-slate-900">Rate Matrix</CardTitle>
            <CardDescription className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mt-1">Historical & Real-time Parity</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-100/30">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="px-8 font-black text-slate-900 text-xs">PAIR</TableHead>
                <TableHead className="font-black text-slate-900 text-xs text-center">VALUE</TableHead>
                <TableHead className="font-black text-slate-900 text-xs">EFFECTIVE DATE</TableHead>
                <TableHead className="font-black text-slate-900 text-xs text-right px-8">STABILITY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingRates ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" /></TableCell>
                </TableRow>
              ) : (
                rates?.map((rate: any) => (
                  <TableRow key={rate.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 text-white font-black px-3 py-1 rounded-lg text-[10px] shadow-sm">{rate.from_currency.code}</div>
                        <ChevronRight className="h-3 w-3 text-slate-300" />
                        <div className="bg-slate-200 text-slate-700 font-black px-3 py-1 rounded-lg text-[10px] shadow-sm">{rate.to_currency.code}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center space-x-2">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">{rate.rate}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{rate.to_currency.code}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-slate-500 font-bold text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-slate-300" /> {formatDate(rate.rate_date, "PPP")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[10px] px-3 py-1">MARKET ACTIVE</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
