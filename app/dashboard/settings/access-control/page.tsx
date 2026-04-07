"use client";

import { motion } from "framer-motion";
import { Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RolePermissionsDialog } from "@/components/forms/RolePermissionsDialog";
import { useAccessControlLogic } from "./_hooks/useAccessControlLogic";
import { AccessControlHeader } from "./_components/AccessControlHeader";
import { AccessControlRoles } from "./_components/AccessControlRoles";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AccessControlPage() {
  const logic = useAccessControlLogic();

  if (!logic.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="bg-rose-50 p-6 rounded-full"><AlertCircle className="h-12 w-12 text-rose-500" /></div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Access Denied</h2>
        <p className="text-slate-500 font-semibold max-w-md text-center">
          Only system administrators have permission to manage roles and security protocols.
        </p>
        <Button variant="outline" onClick={() => window.history.back()} className="rounded-lg   font-bold">Go Back</Button>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8 max-w-[1400px] mx-auto">
      <AccessControlHeader isLoading={logic.isLoading} refetch={logic.refetch} />

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search system roles..."
          className="h-16 pl-14 pr-6 rounded-lg  border-none shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] bg-white font-semibold text-lg focus:ring-2 focus:ring-indigo-500/20 transition-all"
          value={logic.search} onChange={(e) => logic.setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AccessControlRoles
          filteredRoles={logic.filteredRoles} isLoading={logic.isLoading} error={logic.error}
          setSelectedRole={logic.setSelectedRole} setIsDialogOpen={logic.setIsDialogOpen}
          itemVariants={item}
        />
      </div>

      <RolePermissionsDialog
        isOpen={logic.isDialogOpen}
        onClose={() => { logic.setIsDialogOpen(false); logic.setSelectedRole(null); }}
        role={logic.selectedRole}
      />
    </motion.div>
  );
}
