import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface OperationalPulseProps {
  avgTransit: number;
  complianceRate: number;
  topRegion: { name: string; percent: number };
  itemVariants: any;
}

export function OperationalPulse({ avgTransit, complianceRate, topRegion, itemVariants }: OperationalPulseProps) {
  return (
    <motion.div variants={itemVariants} className="flex-1 min-w-full lg:min-w-[400px]">
      <Card className="border-none shadow-premium bg-primary text-white h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-20 -mr-20" />
        <CardHeader>
          <CardTitle className="text-xl font-black flex items-center">
            <TrendingUp className="h-5 w-5 mr-3 text-secondary" />
            Operational Pulse
          </CardTitle>
          <p className="text-sm text-primary-foreground/60 font-bold uppercase tracking-widest mt-1">Supply Chain Efficiency</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/10 p-6 rounded-[2rem] border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/50 mb-2">Avg. Transit</p>
              <p className="text-3xl font-black">{avgTransit} <span className="text-sm font-bold opacity-50">Days</span></p>
            </div>
            <div className="bg-white/10 p-6 rounded-[2rem] border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/50 mb-2">Compliance</p>
              <p className="text-3xl font-black">{complianceRate} <span className="text-sm font-bold opacity-50">%</span></p>
            </div>
          </div>
          <div className="mt-8 p-6 bg-white/5 rounded-[2rem] border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-black">Regional Logistics Status</p>
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${topRegion.percent}%` }} />
              </div>
              <p className="text-[10px] font-bold text-primary-foreground/60 uppercase text-center tracking-widest">
                {topRegion.percent}% Capacity Utilization in {topRegion.name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
