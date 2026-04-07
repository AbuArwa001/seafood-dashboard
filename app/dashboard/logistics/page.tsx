"use client";

import { motion } from "framer-motion";
import { RoleGuard } from "@/components/auth/role-guard";
import { useLogisticsLogic } from "./_hooks/useLogisticsLogic";
import { LogisticsHeader } from "./_components/LogisticsHeader";
import { LogisticsAnalytics } from "./_components/LogisticsAnalytics";
import { LogisticsLedger } from "./_components/LogisticsLedger";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LogisticsPage() {
  const logic = useLogisticsLogic();

  return (
    <RoleGuard allowedRoles={["Admin", "Logistics Agent", "Finance Agent"]}>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8">
        <LogisticsHeader
          isAddModalOpen={logic.isAddModalOpen} setIsAddModalOpen={logic.setIsAddModalOpen}
          isFetching={logic.isFetching} refetch={logic.refetch}
        />

        <LogisticsAnalytics
          totalNetWeight={logic.totalNetWeight} totalLosses={logic.totalLosses}
          itemVariants={item}
        />

        <LogisticsLedger
          searchQuery={logic.searchQuery} setSearchQuery={logic.setSearchQuery}
          totalCount={logic.totalCount} isLoading={logic.isLoading}
          receipts={logic.receipts} page={logic.page} setPage={logic.setPage}
          hasPrev={logic.hasPrev} hasNext={logic.hasNext}
          itemVariants={item}
        />
      </motion.div>
    </RoleGuard>
  );
}
