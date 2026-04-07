import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PurchaseForm } from "@/components/forms/PurchaseForm";

interface PurchasesHeaderProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isFetching: boolean;
  refetch: () => void;
}

export function PurchasesHeader({ isAddModalOpen, setIsAddModalOpen, isFetching, refetch }: PurchasesHeaderProps) {
  return (
    <header className="flex items-end justify-between">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading">
          Supplier <span className="text-blue-600 italic">Procurement</span>
        </h2>
        <p className="text-slate-500 font-medium mt-2">Managing inbound inventory and supplier transactions.</p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => refetch()} disabled={isFetching}
          className="bg-white p-4 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-95 group border border-slate-50"
        >
          <RefreshCw className={`h-5 w-5 text-blue-600 ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
        </button>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-xl shadow-blue-600/25 font-black flex items-center hover:bg-blue-700 transition-all active:scale-95">
              <Plus className="h-5 w-5 mr-2" /> NEW PURCHASE
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-lg border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-blue-600 p-6 text-white text-center">
              <DialogTitle className="text-2xl font-black">Supplier Purchase</DialogTitle>
              <p className="text-blue-100 text-[10px] font-bold mt-1 uppercase tracking-widest">Inventory Procurement Registry</p>
            </div>
            <div className="p-8">
              <PurchaseForm onSuccess={() => setIsAddModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
