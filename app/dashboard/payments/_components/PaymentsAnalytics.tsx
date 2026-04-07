import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface PaymentsAnalyticsProps {
  totalPaid: number;
  pendingAmount: number;
  itemVariants: any;
}

export function PaymentsAnalytics({ totalPaid, pendingAmount, itemVariants }: PaymentsAnalyticsProps) {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-emerald-600 text-white rounded-lg  overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-white/10 transition-colors duration-700" />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/60 mb-2">Total Liquidated</p>
              <p className="text-5xl font-black tracking-tighter">
                ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white/10 p-5 rounded-lg   backdrop-blur-md">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-amber-500 text-white rounded-lg  overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-white/10 transition-colors duration-700" />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-100/60 mb-2">Pending Collection</p>
              <p className="text-5xl font-black tracking-tighter">
                ${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white/10 p-5 rounded-lg   backdrop-blur-md">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
