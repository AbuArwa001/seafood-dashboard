"use client";

import { motion } from "framer-motion";
import { RoleGuard } from "@/components/auth/role-guard";
import { useCostsLogic } from "./_hooks/useCostsLogic";
import { CostsHeader } from "./_components/CostsHeader";
import { CostsAnalytics } from "./_components/CostsAnalytics";
import { CostsLedger } from "./_components/CostsLedger";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CostsPage() {
  const logic = useCostsLogic();

  return (
    <RoleGuard allowedRoles={["Admin", "Logistics Agent", "Finance Agent"]}>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 p-2">
        <CostsHeader
          isAddModalOpen={logic.isAddModalOpen} setIsAddModalOpen={logic.setIsAddModalOpen}
          isFetching={logic.isFetching} refetch={logic.refetch}
        />

        <CostsAnalytics totalCosts={logic.totalCosts} itemVariants={item} />

        <CostsLedger
          searchQuery={logic.searchQuery} setSearchQuery={logic.setSearchQuery}
          totalCount={logic.totalCount} isLoading={logic.isLoading}
          costs={logic.costs} page={logic.page} setPage={logic.setPage}
          hasPrev={logic.hasPrev} hasNext={logic.hasNext}
          itemVariants={item}
        />
      </motion.div>
    </RoleGuard>
  );
}
