"use client";

import { motion } from "framer-motion";
import { RoleGuard } from "@/components/auth/role-guard";
import { usePaymentsLogic } from "./_hooks/usePaymentsLogic";
import { PaymentsHeader } from "./_components/PaymentsHeader";
import { PaymentsAnalytics } from "./_components/PaymentsAnalytics";
import { PaymentsLedger } from "./_components/PaymentsLedger";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PaymentsPage() {
  const logic = usePaymentsLogic();

  return (
    <RoleGuard allowedRoles={["Admin", "Finance Agent"]}>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8">
        <PaymentsHeader
          isAddModalOpen={logic.isAddModalOpen} setIsAddModalOpen={logic.setIsAddModalOpen}
          isFetching={logic.isFetching} refetch={logic.refetch}
        />

        <PaymentsAnalytics
          totalPaid={logic.totalPaid} pendingAmount={logic.pendingAmount}
          itemVariants={item}
        />

        <PaymentsLedger
          searchQuery={logic.searchQuery} setSearchQuery={logic.setSearchQuery}
          isLoading={logic.isLoading} payments={logic.payments}
          itemVariants={item}
        />
      </motion.div>
    </RoleGuard>
  );
}
