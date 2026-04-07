import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm } from "@/components/forms/ProductForm";

interface ProductsHeaderProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  selectedProduct: any;
  isFetching: boolean;
  refetch: () => void;
}

export function ProductsHeader({
  isAddModalOpen, setIsAddModalOpen,
  isEditModalOpen, setIsEditModalOpen,
  selectedProduct, isFetching, refetch
}: ProductsHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
          Product <span className="text-[#1a365d] italic">Catalog</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-3 text-lg">
          Centralized management of your seafood inventory and{" "}
          <span className="text-primary font-black underline decoration-primary/20 decoration-4 underline-offset-4">
            SKU registry
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
            <Button className="rounded-2xl font-black bg-[#1a365d] hover:bg-[#2c5282] h-12 px-6 md:px-8 shadow-xl shadow-[#1a365d]/20 transition-all active:scale-95 flex-1 md:flex-none justify-center whitespace-nowrap">
              <Plus className="h-5 w-5 mr-3" /> ADD PRODUCT
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] rounded-lg   border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
            <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
              <DialogTitle className="text-3xl font-black tracking-tight">New Asset</DialogTitle>
              <p className="text-blue-100/70 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">Create catalog entry</p>
            </div>
            <div className="p-8">
              <ProductForm onSuccess={() => setIsAddModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[550px] rounded-lg   border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
            <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
              <DialogTitle className="text-3xl font-black tracking-tight">Edit Asset</DialogTitle>
              <p className="text-blue-100/70 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">Update catalog entry</p>
            </div>
            <div className="p-8">
              {selectedProduct && <ProductForm product={selectedProduct} onSuccess={() => setIsEditModalOpen(false)} />}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
