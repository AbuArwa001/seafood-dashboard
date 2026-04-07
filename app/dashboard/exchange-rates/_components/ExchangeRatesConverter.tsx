import { RefreshCw, ArrowRightLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface ExchangeRatesConverterProps {
  amount: string;
  setAmount: (amt: string) => void;
  fromCurrency: string;
  setFromCurrency: (curr: string) => void;
  toCurrency: string;
  setToCurrency: (curr: string) => void;
  currencies: any[];
  selectedRate: any;
  itemVariants: any;
}

export function ExchangeRatesConverter({
  amount, setAmount, fromCurrency, setFromCurrency, toCurrency, setToCurrency, currencies, selectedRate, itemVariants
}: ExchangeRatesConverterProps) {
  return (
    <motion.div variants={itemVariants}>
      <div className="bg-slate-900 p-8 rounded-lg   text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mt-32 -mr-32" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/10 p-3 rounded-2xl">
              <RefreshCw className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-xl font-black">Dynamic Converter</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Real-time pair discovery</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-9 items-center gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Amount</label>
              <div className="relative group">
                <input
                  type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1.00"
                  className="w-full bg-white/5 border border-white/10 h-16 rounded-lg   px-6 text-lg font-black focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-white/20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold select-none pointer-events-none group-focus-within:text-primary transition-colors">
                  {currencies?.find((c: any) => c.id === fromCurrency)?.code || "---"}
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Base Currency</label>
              <Select onValueChange={setFromCurrency} value={fromCurrency}>
                <SelectTrigger className="bg-white/5 border-white/10 h-16 rounded-lg   px-6 text-lg font-black focus:ring-primary focus:border-primary transition-all">
                  <SelectValue placeholder="Select Base" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/10 bg-slate-900 text-white">
                  {currencies?.map((c: any) => (
                    <SelectItem key={c.id} value={c.id} className="focus:bg-primary focus:text-white rounded-lg   py-3">
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  const temp = fromCurrency;
                  setFromCurrency(toCurrency);
                  setToCurrency(temp);
                }}
                className="bg-primary hover:bg-primary/90 h-12 w-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 transform hover:rotate-180 active:scale-90 transition-all duration-500"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Target Currency</label>
              <Select onValueChange={setToCurrency} value={toCurrency}>
                <SelectTrigger className="bg-white/5 border-white/10 h-16 rounded-lg   px-6 text-lg font-black focus:ring-primary focus:border-primary transition-all">
                  <SelectValue placeholder="Select Target" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/10 bg-slate-900 text-white">
                  {currencies?.map((c: any) => (
                    <SelectItem key={c.id} value={c.id} className="focus:bg-primary focus:text-white rounded-lg   py-3">
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedRate && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-6 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-4xl font-black tracking-tighter">
                  {parseFloat(amount || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-bold text-slate-500 ml-2">{currencies?.find((c: any) => c.id === fromCurrency)?.code}</span>
                </div>
                <ChevronRight className="h-6 w-6 text-primary" />
                <div className="text-4xl font-black tracking-tighter text-secondary">
                  {(parseFloat(amount || "0") * parseFloat(selectedRate.rate)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} <span className="text-sm font-bold text-slate-500 ml-2">{currencies?.find((c: any) => c.id === toCurrency)?.code}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stability Index</p>
                <div className="flex items-center text-emerald-400 font-bold mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" /> +0.24%
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
