"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  ShoppingBag,
  DollarSign,
  Truck,
  Users,
  Settings,
  Ship,
  ArrowRightLeft,
  Banknote,
} from "lucide-react";
import { motion } from "framer-motion";

import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import { useAuth } from "@/components/providers/auth-provider";

const navigation = [
  {
    name: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permissions: [], // Accessible to all authenticated users
      },
      {
        name: "Shipments",
        href: "/dashboard/shipments",
        icon: Ship,
        permissions: [PERMISSIONS.VIEW_SHIPMENT],
      },
      {
        name: "Products",
        href: "/dashboard/products",
        icon: Package,
        permissions: [PERMISSIONS.VIEW_PRODUCT],
      },
      {
        name: "Sales",
        href: "/dashboard/sales",
        icon: ShoppingCart,
        permissions: [PERMISSIONS.VIEW_SALE],
      },
    ],
  },
  {
    name: "Operations",
    items: [
      {
        name: "Exchange Rates",
        href: "/dashboard/exchange-rates",
        icon: ArrowRightLeft,
        permissions: [PERMISSIONS.VIEW_EXCHANGERATE],
      },
      {
        name: "Currencies",
        href: "/dashboard/currencies",
        icon: Banknote,
        permissions: [PERMISSIONS.VIEW_CURRENCY],
      },
      {
        name: "Payments",
        href: "/dashboard/payments",
        icon: CreditCard,
        permissions: [PERMISSIONS.VIEW_PAYMENT],
      },
      {
        name: "Purchases",
        href: "/dashboard/purchases",
        icon: ShoppingBag,
        permissions: [PERMISSIONS.VIEW_SUPPLIERPURCHASE],
      },
      {
        name: "Costs",
        href: "/dashboard/costs",
        icon: DollarSign,
        permissions: [PERMISSIONS.VIEW_COSTLEDGER],
      },
      {
        name: "Logistics",
        href: "/dashboard/logistics",
        icon: Truck,
        permissions: [PERMISSIONS.VIEW_LOGISTICSRECEIPT],
      },
    ],
  },
  {
    name: "Settings",
    items: [
      {
        name: "Users",
        href: "/dashboard/users",
        icon: Users,
        permissions: [PERMISSIONS.VIEW_USER],
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        permissions: [PERMISSIONS.VIEW_USER, PERMISSIONS.VIEW_PAYMENT], // Admin and Finance see Settings
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
}

export function Sidebar({ className, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  /* Redundant useQuery removed - using useAuth user instead */
  const userRole = user?.role_name || "Manager";

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-300",
        isMobile
          ? "h-full w-full bg-transparent p-0"
          : "h-screen w-72 border-r border-slate-200/60 bg-gradient-to-b from-white to-slate-50/50 backdrop-blur-xl z-20",
        className
      )}
    >
      {/* Logo Section */}
      <div className="flex h-24 items-center px-8 mb-4">
        <Link href="/dashboard" className="flex items-center space-x-4 group">
          <div className="relative h-14 w-full overflow-hidden">
            <img
              src="/logo.png"
              alt="SeaFood Registry"
              className="h-full w-auto object-contain object-left filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-500 transform group-hover:scale-[1.02]"
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-6 py-4 custom-scrollbar">
        {navigation.map((group) => {
          const filteredItems = group.items.filter(
            (item) => !item.permissions || item.permissions.length === 0 || isAdmin || item.permissions.some(p => hasPermission(user, p)),
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={group.name} className="space-y-2">
              <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                {group.name}
              </h3>
              <div className="space-y-1">
                {filteredItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center space-x-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                        isActive
                          ? "bg-[#1a365d] text-white shadow-xl shadow-[#1a365d]/20"
                          : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isActive
                            ? "text-blue-300"
                            : "text-slate-400 group-hover:text-slate-600 group-hover:scale-110",
                        )}
                      />
                      <span className="relative z-10">{item.name}</span>

                      {isActive && (
                        <motion.div
                          layoutId="active-nav-glow"
                          className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute left-0 w-1 h-6 bg-blue-400 rounded-r-full"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Status Card */}
      <div className="p-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-5 shadow-2xl group">
          {/* Decorative background blur */}
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-blue-500/20 blur-2xl group-hover:bg-blue-400/30 transition-colors duration-500" />

          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest truncate">
                  System Role
                </p>
                <p className="text-sm font-black text-white truncate">
                  {user?.role_name || "Accessing..."}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Status</span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400">Verified</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                {userRole === "Admin"
                  ? "Full administrative control enabled."
                  : "Standard operational permissions."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
