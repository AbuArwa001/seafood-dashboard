import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ShoppingBag, Anchor } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface PurchasesTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
  isLoading: boolean;
  purchases: any[];
  page: number;
  setPage: (arg: any) => void;
  hasPrev: boolean;
  hasNext: boolean;
  handleRowClick: (purchase: any) => void;
  itemVariants: any;
}

export function PurchasesTable({
  searchQuery, setSearchQuery, totalCount, isLoading, purchases,
  page, setPage, hasPrev, hasNext, handleRowClick, itemVariants
}: PurchasesTableProps) {
  return (
    <>
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search purchases by shipment or supplier..."
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
                <ShoppingBag className="h-5 w-5 mr-3 text-blue-600" /> Procurement Log
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">Supplier Supply Chain Stream</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="font-black text-slate-900 px-8 h-14">PURCHASE ID</TableHead>
                  <TableHead className="font-black text-slate-900 h-14">SHIPMENT</TableHead>
                  <TableHead className="font-black text-slate-900 h-14">VOLUME</TableHead>
                  <TableHead className="font-black text-slate-900 h-14">CURRENCY</TableHead>
                  <TableHead className="font-black text-slate-900 h-14">DOCUMENT</TableHead>
                  <TableHead className="font-black text-slate-900 h-14 text-right px-8">DATE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i} className="border-slate-50">
                      <TableCell className="px-8 py-6"><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                      <TableCell className="text-right px-8"><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : purchases?.map((purchase: any) => (
                  <TableRow
                    key={purchase.id} onClick={() => handleRowClick(purchase)}
                    className="hover:bg-slate-50/50 transition-colors border-slate-50 group cursor-pointer"
                  >
                    <TableCell className="px-8 py-6">
                      <span className="font-black text-slate-400 text-xs uppercase tracking-tighter">PUR-{purchase.id.substring(0, 8)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Anchor className="h-4 w-4 text-slate-400" />
                        <span className="font-bold text-slate-600">SHP-{purchase.shipment?.substring(0, 8) || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="font-black text-slate-900">{purchase.kg_purchased} KG</span></TableCell>
                    <TableCell className="font-bold text-slate-500 uppercase">{purchase.currency?.code || "USD"}</TableCell>
                    <TableCell>
                      {purchase.image_urls && purchase.image_urls.length > 0 ? (
                        <div className="flex -space-x-2 overflow-hidden">
                          {purchase.image_urls.slice(0, 3).map((url: string, i: number) => (
                            <img key={i} src={url} alt={`Receipt ${i + 1}`} className="inline-block h-8 w-8 rounded-lg border-2 border-white object-cover shadow-sm" />
                          ))}
                          {purchase.image_urls.length > 3 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-600 shadow-sm z-10 relative">
                              +{purchase.image_urls.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (<span className="text-slate-300 italic text-xs font-bold">No Image</span>)}
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <span className="text-slate-500 font-bold text-sm">{formatDate(purchase.created_at, "MMM d, yyyy")}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-8 py-4 border-t border-slate-50 bg-slate-50/30">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {purchases.length} of {totalCount} records</div>
              <div className="flex space-x-2">
                <button onClick={() => setPage((p: number) => Math.max(1, p - 1))} disabled={!hasPrev} className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-colors">
                  PREVIOUS
                </button>
                <div className="flex items-center justify-center px-4 bg-blue-600/10 text-blue-600 rounded-lg text-xs font-black">PAGE {page}</div>
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
