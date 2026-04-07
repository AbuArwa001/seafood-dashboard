import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface SystemParametersHeaderProps {
  isLoading: boolean;
  refetch: () => void;
}

export function SystemParametersHeader({ isLoading, refetch }: SystemParametersHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
          System <span className="text-indigo-600 italic">Parameters</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-3 text-lg">
          Fine-tuning core application behaviors and facility defaults.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => refetch()} className="rounded-lg   hover:bg-slate-100 text-slate-500">
          <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </header>
  );
}
