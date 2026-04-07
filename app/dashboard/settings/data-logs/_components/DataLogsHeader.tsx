import { RefreshCw } from "lucide-react";

interface DataLogsHeaderProps {
  isFetching: boolean;
  refetch: () => void;
}

export function DataLogsHeader({ isFetching, refetch }: DataLogsHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading">
          System <span className="text-indigo-600 italic">Audit Logs</span>
        </h2>
        <p className="text-slate-500 font-medium mt-2">
          Comprehensive security and operational activity tracker.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-white p-4 rounded-2xl shadow-premium border border-slate-50 hover:bg-slate-50 transition-all active:scale-95 group flex items-center"
        >
          <RefreshCw className={`h-5 w-5 text-indigo-600 ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
        </button>
      </div>
    </header>
  );
}
