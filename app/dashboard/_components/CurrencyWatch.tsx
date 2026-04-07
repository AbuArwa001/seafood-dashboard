import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

interface CurrencyWatchProps {
  kshRates: any[];
  itemVariants: any;
}

export function CurrencyWatch({ kshRates, itemVariants }: CurrencyWatchProps) {
  return (
    <motion.div variants={itemVariants} className="flex-1 min-w-full lg:min-w-[400px]">
      <Card className="border-none shadow-premium bg-white h-full">
        <CardHeader className="border-b border-slate-50 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black tracking-tight flex items-center">
                <ArrowRightLeft className="h-5 w-5 mr-3 text-secondary" />
                Currency Watch
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">Regional Rates to KSH</p>
            </div>
            <div className="bg-secondary/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-black text-secondary tracking-widest">REAL-TIME</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-1">
            {kshRates.length > 0 ? (
              kshRates.map((curr: any) => (
                <div key={curr.code} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-lg   flex items-center justify-center font-black text-xs bg-slate-100">{curr.code}</div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{curr.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{curr.code} / KSH</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 tracking-tighter">{curr.rate}</p>
                    <p className="text-[10px] font-bold text-slate-400">Current Unit Rate</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-bold italic text-sm">No KSH pairs configured in Vault</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
