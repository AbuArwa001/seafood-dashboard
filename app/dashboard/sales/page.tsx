"use client";

import { motion } from "framer-motion";
import { RoleGuard } from "@/components/auth/role-guard";
import { useSalesLogic } from "./_hooks/useSalesLogic";
import { SalesHeader } from "./_components/SalesHeader";
import { SalesLedger } from "./_components/SalesLedger";
import { SalesCard } from "@/components/dashboard/SalesCard";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SalesPage() {
  const logic = useSalesLogic();

  return (
    <RoleGuard allowedRoles={["Admin", "Sales Agent", "Finance Agent"]}>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8">
        <SalesHeader
          isAddModalOpen={logic.isAddModalOpen} setIsAddModalOpen={logic.setIsAddModalOpen}
          isFetching={logic.isFetching} refetch={logic.refetch}
        />

        <motion.div variants={item}>
          <SalesCard totalSalesVolume={logic.totalSalesVolume} salesData={logic.sales} />
        </motion.div>

        <SalesLedger
          searchQuery={logic.searchQuery} setSearchQuery={logic.setSearchQuery}
          totalCount={logic.totalCount} isLoading={logic.isLoading}
          sales={logic.sales} page={logic.page} setPage={logic.setPage}
          hasPrev={logic.hasPrev} hasNext={logic.hasNext}
          itemVariants={item}
        />
      </motion.div>
    </RoleGuard>
  );
}
