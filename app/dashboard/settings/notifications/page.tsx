"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useNotificationsSettingsLogic } from "./_hooks/useNotificationsSettingsLogic";
import { NotificationsHeader } from "./_components/NotificationsHeader";
import { NotificationsList } from "./_components/NotificationsList";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function NotificationsSettingsPage() {
  const logic = useNotificationsSettingsLogic();

  if (!logic.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="bg-rose-50 p-6 rounded-full"><AlertCircle className="h-12 w-12 text-rose-500" /></div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Access Restricted</h2>
        <p className="text-slate-500 font-semibold max-w-md text-center">Notification architecture requires system admin privileges to modify.</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8 max-w-[1000px] mx-auto">
      <NotificationsHeader paramsLoading={logic.paramsLoading} refetchParams={logic.refetchParams} />

      <NotificationsList
        parameters={logic.parameters} roles={logic.roles} paramsLoading={logic.paramsLoading}
        pendingChanges={logic.pendingChanges} handleValueChange={logic.handleValueChange}
        handleSave={logic.handleSave} toggleRole={logic.toggleRole}
        updateMutation={logic.updateMutation} itemVariants={item}
      />

      <footer className="pt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-full">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Settings are applied in real-time to background workers.</span>
        </div>
      </footer>
    </motion.div>
  );
}
