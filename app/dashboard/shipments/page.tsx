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
  TableCaption,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Ship,
  Plus,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Anchor,
  Globe,
  Truck,
  Box,
  Activity,
  ArrowRight,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
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
import { ShipmentForm } from "@/components/forms/ShipmentForm";
import { ShipmentDetailsDialog } from "@/components/shipments/ShipmentDetailsDialog";
import { VesselTrackingDialog } from "@/components/shipments/VesselTrackingDialog";

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

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isViewCargoOpen, setIsViewCargoOpen] = useState(false);
  const [isTrackVesselOpen, setIsTrackVesselOpen] = useState(false);

  const {
    data: shipmentsData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["shipments", searchQuery, page],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS, {
        params: { search: searchQuery, page },
      });
      return response.data;
    },
  });

  const shipments = shipmentsData?.results || [];
  const totalCount = shipmentsData?.count || 0;
  const hasNext = !!shipmentsData?.next;
  const hasPrev = !!shipmentsData?.previous;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "COMPLETED":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "IN_TRANSIT":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 p-4 lg:p-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
            Cargo <span className="text-[#1a365d] italic">Manifest</span>
          </h2>
          <p className="text-slate-500 font-semibold mt-3 text-lg">
            Real-time tracking of seafood shipments across{" "}
            <span className="text-primary font-black underline decoration-primary/20 decoration-4 underline-offset-4">
              international waters
            </span>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-2xl border-slate-200 h-12 w-12 hover:bg-slate-50 shadow-sm transition-all flex-none"
          >
            <RefreshCw
              className={`h-5 w-5 text-slate-600 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl font-black bg-[#1a365d] hover:bg-[#2c5282] h-12 px-6 md:px-8 shadow-xl shadow-[#1a365d]/20 transition-all active:scale-95 text-white flex-1 md:flex-none justify-center whitespace-nowrap">
                <Plus className="h-5 w-5 mr-3" /> LOG SHIPMENT
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-xl border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
              <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-8 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
                <DialogTitle className="text-3xl font-black tracking-tight">
                  Cargo Entry
                </DialogTitle>
                <p className="text-blue-100/70 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">
                  Initialize logistics registry
                </p>
              </div>
              <div className="p-8">
                <ShipmentForm onSuccess={() => setIsAddModalOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Analytics Summary */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-[#1a365d] text-white rounded-[2.5rem] overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-white/10 transition-colors duration-700" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-2">
                  Total Shipments
                </p>
                <p className="text-5xl font-black tracking-tighter">
                  {totalCount}
                </p>
              </div>
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-md">
                <Anchor className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden relative group border border-slate-50">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Active Transit
                </p>
                <p className="text-5xl font-black tracking-tighter text-[#1a365d]">
                  {shipments?.filter((s: any) => s.status === "IN_TRANSIT")
                    .length || 0}
                </p>
              </div>
              <div className="bg-amber-50 p-5 rounded-xl group-hover:bg-amber-100 transition-colors">
                <Truck className="h-8 w-8 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-slate-50/50 rounded-[2.5rem] overflow-hidden relative group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Completed Delivery
                </p>
                <p className="text-5xl font-black tracking-tighter text-emerald-600">
                  {shipments?.filter((s: any) => s.status === "COMPLETED")
                    .length || 0}
                </p>
              </div>
              <div className="bg-emerald-50 p-5 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <Box className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search & Content Area */}
      <motion.div variants={item} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by ID, origin, or vessel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-16 rounded-[1.5rem] border-none bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-[#1a365d]/10 transition-all text-lg font-semibold placeholder:text-slate-300"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-[1.5rem] h-16 px-8 border-none bg-white font-bold text-slate-600 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:bg-slate-50 transition-all gap-3"
          >
            <Filter className="h-5 w-5" />
            Advanced Filter
          </Button>
        </div>

        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="border-b border-slate-50 p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                  Global Fleet{" "}
                  <span className="text-[#1a365d] italic">Tracking</span>
                </CardTitle>
                <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  Live Logistics Registry
                </p>
              </div>
              <Badge
                variant="outline"
                className="rounded-full px-4 py-1.5 border-slate-100 font-black text-[10px] text-slate-400 bg-slate-50/50 uppercase tracking-[0.1em]"
              >
                {totalCount} Entries Found
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-50/50 h-16">
                    <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 px-8">
                      Reference ID
                    </TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Origin
                    </TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Currency
                    </TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Volume
                    </TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Status
                    </TableHead>
                    <TableHead className="text-right px-8 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i} className="border-slate-50 h-24">
                        <TableCell colSpan={6} className="px-8">
                          <Skeleton className="h-12 w-full rounded-2xl" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : shipments?.length > 0 ? (
                    shipments.map((shipment: any) => (
                      <TableRow
                        key={shipment.id}
                        className="hover:bg-slate-50/50 transition-colors border-slate-50/50 group h-24"
                      >
                        <TableCell className="px-8 flex items-center h-24">
                          <div className="flex items-center space-x-4">
                            <div className="bg-slate-100 p-3 rounded-2xl text-slate-400 group-hover:bg-[#1a365d] group-hover:text-white group-hover:scale-110 transition-all duration-500">
                              <Box className="h-5 w-5" />
                            </div>
                            <span className="font-black text-slate-900 tracking-tighter text-lg uppercase">
                              #{shipment.id.substring(0, 8)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-slate-300" />
                            <span className="font-bold text-slate-600">
                              {shipment.country_origin}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-black text-slate-400 text-sm">
                          {shipment.currency?.code || "USD"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-bold">
                              {shipment.items?.length || 0} Items
                            </span>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                              Cargo Load
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`rounded-xl px-4 py-2 font-black text-[10px] uppercase tracking-widest shadow-sm shadow-black/5 ${getStatusStyle(shipment.status)}`}
                          >
                            {shipment.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl hover:bg-slate-100 h-10 w-10"
                              >
                                <MoreVertical className="h-5 w-5 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] p-3 min-w-[200px] bg-white/95 backdrop-blur-xl"
                            >
                              <DropdownMenuItem
                                className="rounded-2xl font-black text-xs py-4 px-4 cursor-pointer text-slate-600 focus:bg-slate-50 focus:text-slate-900 transition-all"
                                onClick={() => {
                                  setSelectedShipment(shipment);
                                  setIsViewCargoOpen(true);
                                }}
                              >
                                <ArrowRight className="h-4 w-4 mr-3 text-slate-300" />
                                VIEW FULL CARGO
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="rounded-2xl font-black text-xs py-4 px-4 cursor-pointer text-[#1a365d] focus:bg-[#1a365d]/5 focus:text-[#1a365d] transition-all"
                                onClick={() => {
                                  setSelectedShipment(shipment);
                                  setIsTrackVesselOpen(true);
                                }}
                              >
                                <Anchor className="h-4 w-4 mr-3 text-[#1a365d]/40" />
                                TRACK VESSEL
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <p className="text-slate-400 font-bold italic">
                          No cargo matches found for search.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-8 py-6 border-t border-slate-50 bg-slate-50/30">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Registry Index: {shipments.length} / {totalCount}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev}
                  className="px-6 rounded-2xl h-11 border-slate-200 font-black text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-white active:scale-95 transition-all shadow-sm"
                >
                  PREVIOUS
                </Button>
                <div className="flex items-center justify-center px-6 bg-white border border-slate-100 text-[#1a365d] rounded-2xl h-11 text-[11px] font-black shadow-sm">
                  PORT {page}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  className="px-6 rounded-2xl h-11 border-slate-200 font-black text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-white active:scale-95 transition-all shadow-sm"
                >
                  NEXT
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ShipmentDetailsDialog
        isOpen={isViewCargoOpen}
        onClose={() => setIsViewCargoOpen(false)}
        shipment={selectedShipment}
      />

      <VesselTrackingDialog
        isOpen={isTrackVesselOpen}
        onClose={() => setIsTrackVesselOpen(false)}
        shipment={selectedShipment}
      />
    </motion.div>
  );
}
