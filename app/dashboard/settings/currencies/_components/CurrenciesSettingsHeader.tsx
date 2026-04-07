import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CurrencyForm } from "@/components/forms/CurrencyForm";
import { ExchangeRateForm } from "@/components/forms/ExchangeRateForm";
import { MarginForm } from "@/components/forms/MarginForm";
import { Globe, Plus } from "lucide-react";

interface CurrenciesSettingsHeaderProps {
  activeTab: string;
  isAddModalOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  editingItem: any;
}

export function CurrenciesSettingsHeader({
  activeTab, isAddModalOpen, handleOpenChange, editingItem
}: CurrenciesSettingsHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-blue-600/10 p-2 rounded-lg">
            <Globe className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/60">Financial Configuration</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
          Treasury <span className="text-blue-600 italic">& Rates</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-3 text-lg max-w-2xl">
          Centralized management of global currencies, exchange pairs, and
          <span className="text-blue-600 font-black"> risk-adjusted margins</span>.
        </p>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl shadow-slate-900/20 font-black flex items-center hover:bg-slate-800 transition-all active:scale-95 group shrink-0">
            <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
            {activeTab === "currencies" ? "ADD CURRENCY" : activeTab === "rates" ? "RECORD RATE" : "NEW MARGIN RULE"}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] rounded-[1.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mt-10 -mr-10" />
            <DialogTitle className="text-2xl font-black">{editingItem ? "Modify Registry" : "New Financial Entry"}</DialogTitle>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{activeTab.toUpperCase()} CONFIGURATION</p>
          </div>
          <div className="p-10">
            {activeTab === "currencies" && <CurrencyForm initialData={editingItem} onSuccess={() => handleOpenChange(false)} />}
            {activeTab === "rates" && <ExchangeRateForm initialData={editingItem} onSuccess={() => handleOpenChange(false)} />}
            {activeTab === "margins" && <MarginForm initialData={editingItem} onSuccess={() => handleOpenChange(false)} />}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
