import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Star, FileSpreadsheet, Plus } from "lucide-react";
import { ProductForm } from "@/components/forms/ProductForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  handleExecutiveReport: () => void;
  handleModuleReport: (type: string, data: any[], format?: "pdf" | "excel") => void;
  sales: any[];
  shipments: any[];
  payments: any[];
  products: any[];
  canManageCatalog: boolean;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (val: boolean) => void;
}

export function DashboardHeader({
  handleExecutiveReport, handleModuleReport, sales, shipments, payments, products,
  canManageCatalog, isAddModalOpen, setIsAddModalOpen
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
          Executive <span className="text-[#1a365d] italic">Overview</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-3 text-lg">
          Welcome back. Your global seafood operations are{" "}
          <span className="text-emerald-500 font-black underline decoration-emerald-200 decoration-4 underline-offset-4">
            running smoothly
          </span>
          .
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200 font-bold hover:bg-slate-50 h-12 px-4 md:px-6 shadow-sm transition-all flex items-center gap-2 flex-1 md:flex-none justify-center"
            >
              <Download className="h-4 w-4" /> <span className="whitespace-nowrap">Generate Report</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-none bg-white/95 backdrop-blur-xl">
            <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400 p-3">Select Report Type</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleExecutiveReport} className="rounded-lg p-4 cursor-pointer hover:bg-primary/5 group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors"><Star className="h-4 w-4 text-amber-600" /></div>
                <div><p className="font-bold text-slate-900">Executive Report</p><p className="text-[10px] text-slate-500 font-semibold italic">Integrated All-in-One</p></div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2 bg-slate-100" />
            <DropdownMenuItem onClick={() => handleModuleReport("Sales", sales || [], "pdf")} className="rounded-lg p-3 cursor-pointer hover:bg-slate-50">
              <div className="flex items-center gap-3"><FileSpreadsheet className="h-4 w-4 text-blue-500" /><span className="font-bold text-slate-700">Sales Report (PDF)</span></div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModuleReport("Shipments", shipments || [], "pdf")} className="rounded-lg p-3 cursor-pointer hover:bg-slate-50">
              <div className="flex items-center gap-3"><FileSpreadsheet className="h-4 w-4 text-emerald-500" /><span className="font-bold text-slate-700">Shipments (PDF)</span></div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModuleReport("Payments", payments || [], "pdf")} className="rounded-lg p-3 cursor-pointer hover:bg-slate-50">
              <div className="flex items-center gap-3"><FileSpreadsheet className="h-4 w-4 text-amber-500" /><span className="font-bold text-slate-700">Payments (PDF)</span></div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModuleReport("Products", products || [], "pdf")} className="rounded-lg p-3 cursor-pointer hover:bg-slate-50">
              <div className="flex items-center gap-3"><FileSpreadsheet className="h-4 w-4 text-indigo-500" /><span className="font-bold text-slate-700">Products (PDF)</span></div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2 bg-slate-100" />
            <DropdownMenuItem onClick={() => handleModuleReport("Sales", sales || [], "excel")} className="rounded-lg p-2 cursor-pointer hover:bg-slate-50 opacity-60">
              <div className="flex items-center gap-3"><Download className="h-3 w-3" /><span className="text-xs font-semibold">Sales Data (Excel)</span></div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {canManageCatalog && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl font-black bg-[#1a365d] hover:bg-[#2c5282] h-12 px-6 md:px-8 shadow-xl shadow-[#1a365d]/20 transition-all active:scale-95 flex-1 md:flex-none justify-center whitespace-nowrap">
                <Plus className="h-5 w-5 mr-3" /> REGISTER ASSET
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-lg border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
              <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-8 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
                <DialogTitle className="text-3xl font-black tracking-tight">Product Registry</DialogTitle>
                <p className="text-blue-100/70 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">Digital asset creation system</p>
              </div>
              <div className="p-10">
                <ProductForm onSuccess={() => setIsAddModalOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  );
}
