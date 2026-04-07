import { Card, CardContent } from "@/components/ui/card";
import { Anchor, Truck, Box } from "lucide-react";
import { motion } from "framer-motion";

interface ShipmentsAnalyticsProps {
  totalCount: number;
  shipments: any[];
  itemVariants: any;
}

export function ShipmentsAnalytics({ totalCount, shipments, itemVariants }: ShipmentsAnalyticsProps) {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-[#1a365d] text-white rounded-lgoverflow-hidden relative group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-white/10 transition-colors duration-700" />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-2">Total Shipments</p>
              <p className="text-5xl font-black tracking-tighter">{totalCount}</p>
            </div>
            <div className="bg-white/10 p-5 rounded-lg backdrop-blur-md">
              <Anchor className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-lgoverflow-hidden relative group border border-slate-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Active Transit</p>
              <p className="text-5xl font-black tracking-tighter text-[#1a365d]">
                {shipments?.filter((s: any) => s.status === "IN_TRANSIT").length || 0}
              </p>
            </div>
            <div className="bg-amber-50 p-5 rounded-lg group-hover:bg-amber-100 transition-colors">
              <Truck className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-slate-50/50 rounded-lgoverflow-hidden relative group">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Completed Delivery</p>
              <p className="text-5xl font-black tracking-tighter text-emerald-600">
                {shipments?.filter((s: any) => s.status === "COMPLETED").length || 0}
              </p>
            </div>
            <div className="bg-emerald-50 p-5 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <Box className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
