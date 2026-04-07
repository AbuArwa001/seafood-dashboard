import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CurrencyForm } from "@/components/forms/CurrencyForm";

interface CurrenciesHeaderProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isFetching: boolean;
  refetch: () => void;
}

export function CurrenciesHeader({ isAddModalOpen, setIsAddModalOpen, isFetching, refetch }: CurrenciesHeaderProps) {
  return (
    <header className="flex items-end justify-between">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading">
          Currency <span className="text-primary italic">Vault</span>
        </h2>
        <p className="text-slate-500 font-medium mt-2">
          Configure global currencies used for pricing, cost, and logistics.
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => refetch()} disabled={isFetching}
          className="bg-white p-4 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-95 group border border-slate-50"
        >
          <RefreshCw className={`h-5 w-5 text-primary ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
        </button>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <button className="bg-primary text-white px-6 py-4 rounded-2xl shadow-xl shadow-primary/25 font-black flex items-center hover:bg-primary/90 transition-all active:scale-95">
              <Plus className="h-5 w-5 mr-2" /> NEW CURRENCY
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-lg border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-primary p-6 text-white text-center">
              <DialogTitle className="text-2xl font-black">Register Currency</DialogTitle>
              <p className="text-primary-foreground/80 text-[10px] font-bold mt-1 uppercase tracking-widest">Add to global treasury system</p>
            </div>
            <div className="p-8">
              <CurrencyForm onSuccess={() => setIsAddModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
