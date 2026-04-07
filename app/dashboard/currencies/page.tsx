"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CurrencyForm } from "@/components/forms/CurrencyForm";
import { useCurrenciesLogic } from "./_hooks/useCurrenciesLogic";
import { CurrenciesHeader } from "./_components/CurrenciesHeader";
import { CurrenciesAnalytics } from "./_components/CurrenciesAnalytics";
import { CurrenciesTable } from "./_components/CurrenciesTable";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CurrenciesPage() {
  const logic = useCurrenciesLogic();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 p-2">
      <CurrenciesHeader
        isAddModalOpen={logic.isAddModalOpen} setIsAddModalOpen={logic.setIsAddModalOpen}
        isFetching={logic.isFetching} refetch={logic.refetch}
      />

      <CurrenciesAnalytics totalCount={logic.totalCount} itemVariants={item} />

      <CurrenciesTable
        totalCount={logic.totalCount} isLoading={logic.isLoading}
        currencies={logic.currencies} page={logic.page} setPage={logic.setPage}
        hasPrev={logic.hasPrev} hasNext={logic.hasNext}
        sortConfig={logic.sortConfig} toggleSort={logic.toggleSort}
        setEditingCurrency={logic.setEditingCurrency} handleDelete={logic.handleDelete}
        itemVariants={item}
      />

      <Dialog open={!!logic.editingCurrency} onOpenChange={(open) => !open && logic.setEditingCurrency(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-slate-900 p-6 text-white text-center">
            <DialogTitle className="text-2xl font-black">Edit Currency</DialogTitle>
            <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">Modify currency properties</p>
          </div>
          <div className="p-8">
            <CurrencyForm initialData={logic.editingCurrency} onSuccess={() => logic.setEditingCurrency(null)} />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
