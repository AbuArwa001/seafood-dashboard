"use client";

import { motion } from "framer-motion";
import { useUsersLogic } from "./_hooks/useUsersLogic";
import { UsersHeader } from "./_components/UsersHeader";
import { UsersTable } from "./_components/UsersTable";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function UsersPage() {
  const logic = useUsersLogic();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8">
      <UsersHeader
        isFetching={logic.isFetching} refetch={logic.refetch}
        isAddModalOpen={logic.isAddModalOpen} setIsAddModalOpen={logic.setIsAddModalOpen}
        isEditModalOpen={logic.isEditModalOpen} setIsEditModalOpen={logic.setIsEditModalOpen}
        selectedUser={logic.selectedUser}
      />

      <UsersTable
        users={logic.users} isLoading={logic.isLoading} isFetching={logic.isFetching}
        searchQuery={logic.searchQuery} setSearchQuery={logic.setSearchQuery}
        setPage={logic.setPage} page={logic.page} totalCount={logic.totalCount}
        hasNext={logic.hasNext} hasPrev={logic.hasPrev}
        setSelectedUser={logic.setSelectedUser} setIsEditModalOpen={logic.setIsEditModalOpen}
        deleteMutation={logic.deleteMutation} itemVariants={item}
      />
    </motion.div>
  );
}
