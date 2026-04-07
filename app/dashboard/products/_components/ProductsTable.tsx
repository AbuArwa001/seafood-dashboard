import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Package, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface ProductsTableProps {
  searchQuery: string;
  handleSearch: (val: string) => void;
  count: number;
  isLoading: boolean;
  products: any[];
  page: number;
  setPage: (arg: any) => void;
  hasPrevious: boolean;
  hasNext: boolean;
  setSelectedProduct: (p: any) => void;
  setIsEditModalOpen: (open: boolean) => void;
  handleDelete: (id: string) => void;
  itemVariants: any;
}

export function ProductsTable({
  searchQuery, handleSearch, count, isLoading, products,
  page, setPage, hasPrevious, hasNext, setSelectedProduct,
  setIsEditModalOpen, handleDelete, itemVariants
}: ProductsTableProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search products by name or category..."
            value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
            className="pl-14 h-16 rounded-lgborder-none bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-[#1a365d]/10 transition-all text-lg font-semibold placeholder:text-slate-300"
          />
        </div>
        <Button variant="outline" className="rounded-lgh-16 px-8 border-none bg-white font-bold text-slate-600 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:bg-slate-50 transition-all gap-3">
          <Filter className="h-5 w-5" /> Filters
        </Button>
      </div>

      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-lgoverflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                Inventory <span className="text-[#1a365d] italic">List</span>
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                <Package className="h-4 w-4" /> {count} Products Identified
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-50/50 h-16">
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 px-8">Product Details</TableHead>
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Category</TableHead>
                  <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Unit Type</TableHead>
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
                ) : products?.length > 0 ? (
                  products.map((product: any) => (
                    <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors border-slate-50/50 group h-24">
                      <TableCell className="px-8 flex items-center h-24">
                        <div className="flex items-center space-x-4">
                          <div className="bg-slate-100 p-3 rounded-2xl text-slate-400 group-hover:bg-[#1a365d] group-hover:text-white group-hover:scale-110 transition-all duration-500">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 tracking-tighter text-lg leading-none mb-1">{product.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">SKU: {product.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-lg border-slate-100 bg-slate-50/50 text-slate-500 font-black text-[10px] px-3 py-1 uppercase tracking-widest">
                          {product.category?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-slate-600">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-black">{product.unit?.description || "N/A"}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{product.unit?.code || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full mr-3 shadow-sm ${product.is_active ? "bg-emerald-500 shadow-emerald-200" : "bg-slate-300"}`} />
                          <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${product.is_active ? "text-emerald-600" : "text-slate-400"}`}>
                            {product.is_active ? "In Catalog" : "Archived"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg hover:bg-slate-100 h-10 w-10">
                              <MoreVertical className="h-5 w-5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-lg border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] p-3 min-w-[200px] bg-white/95 backdrop-blur-xl">
                            <DropdownMenuItem className="rounded-2xl font-black text-xs py-4 px-4 cursor-pointer text-slate-600 focus:bg-slate-50 focus:text-slate-900 transition-all" onClick={() => { setSelectedProduct(product); setIsEditModalOpen(true); }}>
                              <Edit2 className="h-4 w-4 mr-3 text-slate-300" /> EDIT ASSET
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-2xl font-black text-xs py-4 px-4 cursor-pointer text-destructive focus:bg-destructive/5 focus:text-destructive transition-all" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="h-4 w-4 mr-3 opacity-40" /> ARCHIVE PRODUCT
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-slate-50 p-10 rounded-lg"><Package className="h-16 w-16 text-slate-200" /></div>
                        <p className="text-slate-400 font-black italic uppercase tracking-widest text-xs">No cargo found for "{searchQuery}"</p>
                        <Button variant="ghost" onClick={() => handleSearch("")} className="text-[#1a365d] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1a365d]/5 rounded-lg">
                          Reset Search Registry
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-8 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Page {page}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p: number) => Math.max(1, p - 1))} disabled={!hasPrevious || isLoading} className="rounded-lg font-bold text-xs px-4">
                PREVIOUS
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p: number) => p + 1)} disabled={!hasNext || isLoading} className="rounded-lg font-bold text-xs px-4">
                NEXT
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
