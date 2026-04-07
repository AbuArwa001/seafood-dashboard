import { MarginConfigDialog } from "@/components/forms/MarginConfigDialog";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface ExchangeRatesInsightProps {
  itemVariants: any;
}

export function ExchangeRatesInsight({ itemVariants }: ExchangeRatesInsightProps) {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-slate-900 p-8 rounded-[1.5rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mt-20 -mr-20" />
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-4">
            Market <span className="text-secondary italic">Sentiment</span>
          </h3>
          <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
            Treasury operations recommend using daily average rates for all logistics costs recorded in KES while calculating revenue in USD for export markets.
          </p>
          <div className="flex space-x-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Base Currency</p>
              <p className="text-xl font-black">USD</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Reference</p>
              <p className="text-xl font-black text-secondary">KES</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary p-8 rounded-[1.5rem] text-white flex flex-col justify-between shadow-2xl shadow-primary/20">
        <div>
          <div className="bg-white/20 h-12 w-12 rounded-2xl flex items-center justify-center mb-6">
            <DollarSign className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-black mb-2">Automated Conversion</h3>
          <p className="text-primary-foreground/70 font-medium text-sm">
            All sales recorded in foreign currencies are automatically converted using the prevailing daily rate at 12:00 AM UTC.
          </p>
        </div>
        <MarginConfigDialog />
      </div>
    </motion.div>
  );
}
