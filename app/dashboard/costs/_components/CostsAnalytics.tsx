import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface CostsAnalyticsProps {
  totalCosts: number;
  itemVariants: any;
}

export function CostsAnalytics({ totalCosts, itemVariants }: CostsAnalyticsProps) {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-none shadow-premium bg-slate-900 text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/20 rounded-full blur-3xl -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-700" />
        <CardContent className="pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 font-heading">
                Accumulated Costs
              </p>
              <p className="text-4xl font-black tracking-tighter">
                ${totalCosts.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
