import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit2, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface CurrenciesTableProps {
  totalCount: number;
  isLoading: boolean;
  currencies: any[];
  page: number;
  setPage: (arg: any) => void;
  hasPrev: boolean;
  hasNext: boolean;
  sortConfig: { field: string | null; direction: "asc" | "desc" | null };
  toggleSort: (field: string) => void;
  setEditingCurrency: (curr: any) => void;
  handleDelete: (id: string) => void;
  itemVariants: any;
}

export function CurrenciesTable({
  totalCount, isLoading, currencies, page, setPage,
  hasPrev, hasNext, sortConfig, toggleSort, setEditingCurrency, handleDelete, itemVariants
}: CurrenciesTableProps) {
  const getSortIcon = (field: string) => {
    if (sortConfig.field !== field) return <ChevronsUpDown className="h-4 w-4 ml-2 opacity-20" />;
    if (sortConfig.direction === "asc") return <ChevronUp className="h-4 w-4 ml-2 text-primary" />;
    return <ChevronDown className="h-4 w-4 ml-2 text-primary" />;
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black tracking-tight">Active Currencies</CardTitle>
            <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">Treasury Master List</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-50">
                <TableHead className="font-black text-slate-900 px-8 h-14 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => toggleSort("code")}>
                  <div className="flex items-center">CODE {getSortIcon("code")}</div>
                </TableHead>
                <TableHead className="font-black text-slate-900 h-14 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => toggleSort("name")}>
                  <div className="flex items-center">NAME {getSortIcon("name")}</div>
                </TableHead>
                <TableHead className="font-black text-slate-900 h-14 text-center cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => toggleSort("symbol")}>
                  <div className="flex items-center justify-center">SYMBOL {getSortIcon("symbol")}</div>
                </TableHead>
                <TableHead className="font-black text-slate-900 h-14 text-right px-8">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i} className="border-slate-50">
                    <TableCell className="px-8 py-6"><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-8 mx-auto" /></TableCell>
                    <TableCell className="text-right px-8"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : currencies?.map((curr: any) => (
                <TableRow key={curr.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                  <TableCell className="px-8 py-6">
                    <div className="bg-primary/10 text-primary font-black px-3 py-1 rounded-lg text-center inline-block">{curr.code}</div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-700">{curr.name}</TableCell>
                  <TableCell className="text-center">
                    <span className="bg-slate-100 p-2 rounded-lg font-black text-slate-500 w-10 inline-block text-center">{curr.symbol || "-"}</span>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => setEditingCurrency(curr)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(curr.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-8 py-4 border-t border-slate-50 bg-slate-50/30">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {currencies.length} of {totalCount} currencies</div>
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
