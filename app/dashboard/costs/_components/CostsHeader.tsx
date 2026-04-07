import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CostForm } from "@/components/forms/CostForm";

interface CostsHeaderProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isFetching: boolean;
  refetch: () => void;
}

export function CostsHeader({ isAddModalOpen, setIsAddModalOpen, isFetching, refetch }: CostsHeaderProps) {
  return (
    <header className="flex items-end justify-between">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading">
          Operational <span className="text-destructive italic">Costs</span>
        </h2>
        <p className="text-slate-500 font-medium mt-2">
          Ledger for tracking expenditures and logistics overhead.
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => refetch()} disabled={isFetching}
          className="bg-white p-4 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-95 group border border-slate-50"
        >
          <RefreshCw className={`h-5 w-5 text-destructive ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
        </button>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <button className="bg-destructive text-white px-6 py-4 rounded-2xl shadow-xl shadow-destructive/25 font-black flex items-center hover:bg-destructive/90 transition-all active:scale-95">
              <Plus className="h-5 w-5 mr-2" /> ADD COST RECORD
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-lg border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-destructive p-6 text-white text-center">
              <DialogTitle className="text-2xl font-black">Expense Ledger</DialogTitle>
              <p className="text-destructive-foreground/80 text-[10px] font-bold mt-1 uppercase tracking-widest">
                Cost Allocation Registry
              </p>
            </div>
            <div className="p-8">
              <CostForm onSuccess={() => setIsAddModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
