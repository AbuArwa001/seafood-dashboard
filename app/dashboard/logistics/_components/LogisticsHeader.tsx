import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogisticsReceiptForm } from "@/components/forms/LogisticsReceiptForm";

interface LogisticsHeaderProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isFetching: boolean;
  refetch: () => void;
}

export function LogisticsHeader({ isAddModalOpen, setIsAddModalOpen, isFetching, refetch }: LogisticsHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
          Fleet <span className="text-emerald-700 italic">Registry</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-3 text-lg">
          Monitoring facility receipts and{" "}
          <span className="text-emerald-600 font-black underline decoration-emerald-600/20 decoration-4 underline-offset-4">
            supply chain losses
          </span>
          .
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}
          className="rounded-2xl border-slate-200 h-12 w-12 hover:bg-slate-50 shadow-sm transition-all flex-none"
        >
          <RefreshCw className={`h-5 w-5 text-slate-600 ${isFetching ? "animate-spin" : ""}`} />
        </Button>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl font-black bg-emerald-600 hover:bg-emerald-700 h-12 px-6 md:px-8 shadow-xl shadow-emerald-600/20 transition-all active:scale-95 text-white flex-1 md:flex-none justify-center whitespace-nowrap">
              <Plus className="h-5 w-5 mr-3" /> RECORD RECEIPT
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] rounded-lg   border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
              <DialogTitle className="text-3xl font-black tracking-tight">Facility Receipt</DialogTitle>
              <p className="text-emerald-100 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">Inventory Inbound registry</p>
            </div>
            <div className="p-8">
              <LogisticsReceiptForm onSuccess={() => setIsAddModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
