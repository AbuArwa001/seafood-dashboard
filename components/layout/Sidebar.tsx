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

const navigation = [
  {
    name: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Shipments", href: "/dashboard/shipments", icon: Ship },
      { name: "Products", href: "/dashboard/products", icon: Package },
      { name: "Sales", href: "/dashboard/sales", icon: ShoppingCart },
    ],
  },
  {
    name: "Operations",
    items: [
      {
        name: "Exchange Rates",
        href: "/dashboard/exchange-rates",
        icon: ArrowRightLeft,
      },
      { name: "Currencies", href: "/dashboard/currencies", icon: Banknote },
      { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
      { name: "Purchases", href: "/dashboard/purchases", icon: ShoppingBag },
      { name: "Costs", href: "/dashboard/costs", icon: DollarSign },
      { name: "Logistics", href: "/dashboard/logistics", icon: Truck },
    ],
  },
  {
    name: "Settings",
    items: [
      { name: "Users", href: "/dashboard/users", icon: Users },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-66 flex-col border-r bg-white/80 backdrop-blur-xl shadow-premium z-20">
      {/* Logo */}
      <div className="flex h-20 items-center px-8 mb-6">
        <Link href="/dashboard" className="flex items-center space-x-4 group">
          <div className="relative h-12 w-48 overflow-hidden transform group-hover:scale-105 transition-all duration-300">
            <img
              src="/logo.png"
              alt="SeaFood Registry"
              className="h-full w-full object-contain object-left"
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-8 overflow-y-auto px-6 py-2">
        {navigation.map((group) => (
          <div key={group.name} className="space-y-3">
            <h3 className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400/80">
              {group.name}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center space-x-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-600 group-hover:scale-110",
                      )}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-glow"
                        className="absolute inset-0 bg-white/10 rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6">{/* Removed Enterprise Tier Card */}</div>
    </div>
  );
}
