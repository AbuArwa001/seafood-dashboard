"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/forms/ProductForm";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: products,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, {
        params: { search: searchQuery },
      });
      return response.data.results || response.data;
    },
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 p-2"
    >
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading">
            Product <span className="text-primary italic">Catalog</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Centralized management of your seafood inventory and SKUs.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-white p-4 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-95 group border border-slate-50"
          >
            <RefreshCw
              className={`h-5 w-5 text-primary ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
            />
          </button>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <button className="bg-primary text-white px-6 py-4 rounded-2xl shadow-xl shadow-primary/25 font-black flex items-center hover:bg-primary/90 transition-all active:scale-95">
                <Plus className="h-5 w-5 mr-2" />
                ADD PRODUCT
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-primary p-6 text-white text-center">
                <DialogTitle className="text-2xl font-black">
                  New Product
                </DialogTitle>
                <p className="text-primary-foreground/80 text-[10px] font-bold mt-1 uppercase tracking-widest">
                  Create a new catalog entry
                </p>
              </div>
              <div className="p-8">
                <ProductForm onSuccess={() => setIsAddModalOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Filters & Search */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search products by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
                />
              </div>
              <button className="flex items-center justify-center space-x-2 px-6 h-14 bg-white border border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products Table */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black tracking-tight flex items-center">
                <Package className="h-5 w-5 mr-3 text-primary" />
                Inventory List
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                {products?.length || 0} Products Found
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="font-black text-slate-900 px-8 h-14">
                    PRODUCT
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    CATEGORY
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    UNIT
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    STATUS
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14 text-right px-8">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i} className="border-slate-50">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-10 w-10 rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-lg" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-lg" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-lg" />
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : products?.length > 0 ? (
                  products.map((product: any) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-slate-50/50 transition-colors border-slate-50 group"
                    >
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              ID: {product.id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-full border-slate-200 text-slate-500 font-bold px-3 py-0.5"
                        >
                          {product.category?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-slate-600">
                        {product.unit?.name || "N/A"} (
                        {product.unit?.code || "-"})
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${product.is_active ? "bg-emerald-500" : "bg-slate-300"}`}
                          />
                          <span
                            className={`text-xs font-black uppercase tracking-wider ${product.is_active ? "text-emerald-600" : "text-slate-400"}`}
                          >
                            {product.is_active ? "In Catalog" : "Archived"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                              <MoreVertical className="h-5 w-5 text-slate-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]"
                          >
                            <DropdownMenuItem className="rounded-xl font-bold py-3 cursor-pointer">
                              <Edit2 className="h-4 w-4 mr-3" /> Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold py-3 cursor-pointer text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-3" /> Archive
                              Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="bg-slate-50 p-6 rounded-[2.5rem]">
                          <Package className="h-12 w-12 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold italic">
                          No products found for "{searchQuery}"
                        </p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-primary font-black text-sm uppercase tracking-widest hover:underline"
                        >
                          Clear Search
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
