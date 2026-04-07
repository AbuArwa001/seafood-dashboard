"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useSystemParametersLogic } from "./_hooks/useSystemParametersLogic";
import { SystemParametersHeader } from "./_components/SystemParametersHeader";
import { SystemParametersFilters } from "./_components/SystemParametersFilters";
import { SystemParametersList } from "./_components/SystemParametersList";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SystemParametersPage() {
  const logic = useSystemParametersLogic();

  if (!logic.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="bg-rose-50 p-6 rounded-full"><AlertCircle className="h-12 w-12 text-rose-500" /></div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Access Restricted</h2>
        <p className="text-slate-500 font-semibold max-w-md text-center">System configuration requires top-level administrative clearance.</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8 max-w-[1200px] mx-auto">
      <SystemParametersHeader isLoading={logic.isLoading} refetch={logic.refetch} />

      <SystemParametersFilters
        search={logic.search} setSearch={logic.setSearch}
        selectedCategory={logic.selectedCategory} setSelectedCategory={logic.setSelectedCategory}
      />

      <SystemParametersList
        filteredParameters={logic.filteredParameters} isLoading={logic.isLoading}
        pendingChanges={logic.pendingChanges} handleValueChange={logic.handleValueChange}
        handleSave={logic.handleSave} updateMutation={logic.updateMutation}
        itemVariants={item}
      />
    </motion.div>
  );
}
