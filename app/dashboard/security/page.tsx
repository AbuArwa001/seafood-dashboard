"use client";

import { motion } from "framer-motion";
import { useSecurityLogic } from "./_hooks/useSecurityLogic";
import { ProfileCard } from "./_components/ProfileCard";
import { RoleCard } from "./_components/RoleCard";
import { PermissionsCard } from "./_components/PermissionsCard";
import { PasswordCard } from "./_components/PasswordCard";
import { SecurityHeader } from "./_components/SecurityHeader";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } },
};

export default function SecurityPage() {
  const logic = useSecurityLogic();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 p-4 lg:p-8 max-w-5xl">
      <SecurityHeader itemVariants={item} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <ProfileCard user={logic.user} roleName={logic.roleName} initials={logic.initials} itemVariants={item} />
          <RoleCard isAdmin={logic.isAdmin} roleName={logic.roleName} itemVariants={item} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <PermissionsCard permissions={logic.permissions} groupedPermissions={logic.groupedPermissions} itemVariants={item} />
          <PasswordCard
            currentPw={logic.currentPw} setCurrentPw={logic.setCurrentPw}
            newPw={logic.newPw} setNewPw={logic.setNewPw}
            confirmPw={logic.confirmPw} setConfirmPw={logic.setConfirmPw}
            showCurrent={logic.showCurrent} setShowCurrent={logic.setShowCurrent}
            showNew={logic.showNew} setShowNew={logic.setShowNew}
            showConfirm={logic.showConfirm} setShowConfirm={logic.setShowConfirm}
            passwordMutation={logic.passwordMutation} handlePasswordSubmit={logic.handlePasswordSubmit}
            itemVariants={item}
          />
        </div>
      </div>
    </motion.div>
  );
}
