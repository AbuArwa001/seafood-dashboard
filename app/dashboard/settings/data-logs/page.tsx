"use client";

import { motion } from "framer-motion";
import { RoleGuard } from "@/components/auth/role-guard";
import { useDataLogsLogic } from "./_hooks/useDataLogsLogic";
import { DataLogsHeader } from "./_components/DataLogsHeader";
import { DataLogsFilters } from "./_components/DataLogsFilters";
import { DataLogsTable } from "./_components/DataLogsTable";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DataLogsPage() {
  const logic = useDataLogsLogic();

  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 p-2">
        <DataLogsHeader isFetching={logic.isFetching} refetch={logic.refetch} />

        <DataLogsFilters
          searchQuery={logic.searchQuery} setSearchQuery={logic.setSearchQuery}
          actionFilter={logic.actionFilter} setActionFilter={logic.setActionFilter}
          setPage={logic.setPage} itemVariants={item}
        />

        <DataLogsTable
          logs={logic.logs} isLoading={logic.isLoading} totalCount={logic.totalCount}
          page={logic.page} setPage={logic.setPage} hasNext={logic.hasNext} hasPrev={logic.hasPrev}
          itemVariants={item}
        />
      </motion.div>
    </RoleGuard>
  );
}
