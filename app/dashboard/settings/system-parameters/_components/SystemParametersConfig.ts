import { LayoutDashboard, DollarSign, Truck, Bell, Cpu } from "lucide-react";
import { ParameterCategory } from "@/types/models";

export const CATEGORY_CONFIG: Record<ParameterCategory, { label: string; icon: any; color: string }> = {
  general: { label: "General", icon: LayoutDashboard, color: "text-indigo-600 bg-indigo-50" },
  financial: { label: "Financial", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
  logistics: { label: "Logistics", icon: Truck, color: "text-amber-600 bg-amber-50" },
  notifications: { label: "Notifications", icon: Bell, color: "text-rose-600 bg-rose-50" },
  system: { label: "System", icon: Cpu, color: "text-slate-600 bg-slate-50" },
};
