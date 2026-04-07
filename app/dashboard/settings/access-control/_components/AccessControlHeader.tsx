import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AccessControlHeaderProps {
  isLoading: boolean;
  refetch: () => void;
}

export function AccessControlHeader({ isLoading, refetch }: AccessControlHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
          Access <span className="text-indigo-600 italic">Control</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-3 text-lg">
          Managing role-based access levels and{" "}
          <span className="text-indigo-500 font-black underline decoration-indigo-500/20 decoration-4 underline-offset-4">
            security policies
          </span>
          .
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost" size="icon" onClick={() => refetch()}
          className="rounded-lg   hover:bg-slate-100 text-slate-500 transition-all duration-300"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </header>
  );
}
