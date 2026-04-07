import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface CurrenciesTabProps {
  currencies: any[];
  loadingCurrencies: boolean;
  handleEdit: (data: any) => void;
  deleteCurrencyMutation: any;
  itemVariants: any;
}

export function CurrenciesTab({
  currencies, loadingCurrencies, handleEdit, deleteCurrencyMutation, itemVariants
}: CurrenciesTabProps) {
  return (
    <motion.div variants={itemVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-8">
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-md rounded-lgoverflow-hidden border border-white/40">
        <CardHeader className="p-8 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black text-slate-900">Active Registry</CardTitle>
            <CardDescription className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mt-1">Global Currency Standards</CardDescription>
          </div>
          <Badge className="bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 border-none px-4 py-1.5 rounded-full font-black">
            {currencies?.length || 0} ASSETS
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="px-8 font-black text-slate-900 uppercase tracking-tighter text-xs">ISO Code</TableHead>
                <TableHead className="font-black text-slate-900 uppercase tracking-tighter text-xs">Currency Name</TableHead>
                <TableHead className="text-center font-black text-slate-900 uppercase tracking-tighter text-xs">Symbol</TableHead>
                <TableHead className="text-center font-black text-slate-900 uppercase tracking-tighter text-xs">Status</TableHead>
                <TableHead className="text-right px-8 font-black text-slate-900 uppercase tracking-tighter text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingCurrencies ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  </TableCell>
                </TableRow>
              ) : (
                currencies?.map((curr: any) => (
                  <TableRow key={curr.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                    <TableCell className="px-8 py-6">
                      <div className="bg-slate-900 text-white font-black px-4 py-1.5 rounded-lg text-center inline-block text-xs">{curr.code}</div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-700">{curr.name}</TableCell>
                    <TableCell className="text-center">
                      <span className="bg-slate-100 p-2.5 rounded-lg font-black text-slate-500 min-w-[40px] inline-block text-center text-sm">{curr.symbol || "-"}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${curr.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${curr.is_active ? "text-emerald-500" : "text-slate-400"}`}>
                          {curr.is_active ? "Active" : "Archived"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleEdit(curr)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => confirm("Delete currency?") && deleteCurrencyMutation.mutate(curr.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
