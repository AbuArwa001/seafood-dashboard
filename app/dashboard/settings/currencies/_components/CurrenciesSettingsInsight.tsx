import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface CurrenciesSettingsInsightProps {
  itemVariants: any;
}

export function CurrenciesSettingsInsight({ itemVariants }: CurrenciesSettingsInsightProps) {
  return (
    <motion.div variants={itemVariants} className="mt-20">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-12 rounded-[3.5rem] text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mt-64 -mr-64 animate-pulse" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-blue-600/20 w-fit p-4 rounded-lg   mb-8">
              <ShieldAlert className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-3xl font-black mb-6 leading-tight">
              Treasury <span className="text-blue-400 italic">Protection</span> Protocol
            </h3>
            <p className="text-slate-400 font-semibold text-lg max-w-lg mb-8">
              All conversions in the SeaFood Registry apply a weighted margin to mitigate local currency volatility risk.
              <span className="text-white"> Admin overrides are logged and audited automatically.</span>
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">System Default</p>
                <p className="font-black text-xl">2.00%</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Auto-Sync</p>
                <p className="font-black text-xl text-emerald-400 underline decoration-emerald-400/30 underline-offset-4">ENABLED</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-2 rounded-[3rem] shadow-inner group">
            <img
              src="https://images.unsplash.com/photo-1611974717482-99617dd04942?q=80&w=2070&auto=format&fit=crop"
              alt="Market Monitoring"
              className="rounded-[2.8rem] opacity-60 group-hover:opacity-80 transition-opacity duration-500 grayscale hover:grayscale-0"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
