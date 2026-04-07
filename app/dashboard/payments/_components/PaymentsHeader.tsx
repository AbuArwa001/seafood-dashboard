import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/forms/PaymentForm";

interface PaymentsHeaderProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isFetching: boolean;
  refetch: () => void;
}

export function PaymentsHeader({ isAddModalOpen, setIsAddModalOpen, isFetching, refetch }: PaymentsHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
          Receivables <span className="text-amber-600 italic">Management</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-3 text-lg">
          Managing accounts receivable and{" "}
          <span className="text-amber-500 font-black underline decoration-amber-500/20 decoration-4 underline-offset-4">
            liquidation status
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
            <Button className="rounded-2xl font-black bg-[#1a365d] hover:bg-[#2c5282] h-12 px-6 md:px-8 shadow-xl shadow-[#1a365d]/20 transition-all active:scale-95 text-white flex-1 md:flex-none justify-center whitespace-nowrap">
              <Plus className="h-5 w-5 mr-3" /> RECORD PAYMENT
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] rounded-lg border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
              <DialogTitle className="text-3xl font-black tracking-tight">Record Receipt</DialogTitle>
              <p className="text-amber-100 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">Liquidation Entry Registry</p>
            </div>
            <div className="p-8">
              <PaymentForm onSuccess={() => setIsAddModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
