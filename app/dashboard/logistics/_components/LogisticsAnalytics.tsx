import { Card, CardContent } from "@/components/ui/card";
import { Scale, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface LogisticsAnalyticsProps {
  totalNetWeight: number;
  totalLosses: number;
  itemVariants: any;
}

export function LogisticsAnalytics({ totalNetWeight, totalLosses, itemVariants }: LogisticsAnalyticsProps) {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-[#1a365d] text-white rounded-lgoverflow-hidden relative group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-emerald-500/20 transition-colors duration-700" />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-2">Net Inventory Inbound</p>
              <p className="text-5xl font-black tracking-tighter">
                {totalNetWeight.toLocaleString()} <span className="text-sm font-black text-blue-300/40">KG</span>
              </p>
            </div>
            <div className="bg-white/10 p-5 rounded-lg backdrop-blur-md">
              <Scale className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-lgoverflow-hidden relative group border border-slate-50">
        <div className="absolute top-0 right-0 w-48 h-48 bg-destructive/5 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-destructive/10 transition-colors duration-700" />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Accumulated Losses</p>
              <p className="text-5xl font-black tracking-tighter text-destructive">
                {totalLosses.toLocaleString()} <span className="text-sm font-black text-destructive/40">KG</span>
              </p>
            </div>
            <div className="bg-destructive/5 p-5 rounded-lg group-hover:bg-destructive/10 transition-colors">
              <Flame className="h-8 w-8 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
