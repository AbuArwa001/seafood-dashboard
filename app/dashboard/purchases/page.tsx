"use client";

import { motion } from "framer-motion";
import { RoleGuard } from "@/components/auth/role-guard";
import { usePurchasesLogic } from "./_hooks/usePurchasesLogic";
import { PurchasesHeader } from "./_components/PurchasesHeader";
import { PurchasesAnalytics } from "./_components/PurchasesAnalytics";
import { PurchasesTable } from "./_components/PurchasesTable";
import { PurchaseDetailDialog } from "@/components/modals/PurchaseDetailDialog";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PurchasesPage() {
  const logic = usePurchasesLogic();

  return (
    <RoleGuard allowedRoles={["Admin", "Mozambique Agent", "Finance Agent"]}>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 p-2">
        <PurchasesHeader
          isAddModalOpen={logic.isAddModalOpen} setIsAddModalOpen={logic.setIsAddModalOpen}
          isFetching={logic.isFetching} refetch={logic.refetch}
        />

        <PurchasesAnalytics totalKg={logic.totalKg} itemVariants={item} />

        <PurchasesTable
          searchQuery={logic.searchQuery} setSearchQuery={logic.setSearchQuery}
          totalCount={logic.totalCount} isLoading={logic.isLoading}
          purchases={logic.purchases} page={logic.page} setPage={logic.setPage}
          hasPrev={logic.hasPrev} hasNext={logic.hasNext}
          handleRowClick={logic.handleRowClick} itemVariants={item}
        />

        <PurchaseDetailDialog
          purchase={logic.selectedPurchase}
          isOpen={logic.isDetailModalOpen}
          onClose={() => logic.setIsDetailModalOpen(false)}
        />
      </motion.div>
    </RoleGuard>
  );
}
