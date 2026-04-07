import { RefreshCw } from "lucide-react";

interface ExchangeRatesHeaderProps {
  isFetching: boolean;
  refetch: () => void;
}

export function ExchangeRatesHeader({ isFetching, refetch }: ExchangeRatesHeaderProps) {
  return (
    <header className="flex items-end justify-between">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading">
          Daily <span className="text-primary italic">Exchange Rates</span>
        </h2>
        <p className="text-slate-500 font-medium mt-2">
          Monitoring currency fluctuations for global seafood trade operations.
        </p>
      </div>
      <button
        onClick={() => refetch()} disabled={isFetching}
        className="bg-white p-4 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-95 group border border-slate-50"
      >
        <RefreshCw className={`h-5 w-5 text-primary ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
      </button>
    </header>
  );
}
