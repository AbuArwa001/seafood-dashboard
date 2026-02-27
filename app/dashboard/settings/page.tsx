"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Settings as SettingsIcon,
  Globe,
  ShieldCheck,
  Bell,
  Cpu,
  ChevronRight,
  Database,
  Users,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: "Currency & Rates",
      description: "Manage global currencies and real-time exchange monitoring.",
      icon: Globe,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "System Parameters",
      description: "Configure core application behaviors and facility defaults.",
      icon: Cpu,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Notifications",
      description: "Set up automated alerts for shipments and payment deadlines.",
      icon: Bell,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Access Control",
      description: "Manage role-based permissions and security protocols.",
      icon: ShieldCheck,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      title: "User Management",
      description: "Administrate team accounts and operational roles.",
      icon: Users,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      title: "Data & Logs",
      description: "Audit system logs and manage database maintenance.",
      icon: Database,
      color: "text-slate-500",
      bg: "bg-slate-50",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 p-4 lg:p-8"
    >
      <header>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
          System <span className="text-blue-600 italic">Configuration</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-3 text-lg">
          Managing application preferences and{" "}
          <span className="text-blue-500 font-black underline decoration-blue-500/20 decoration-4 underline-offset-4">administrative protocols</span>.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {settingsCategories.map((category, index) => {
          const cardContent = (
            <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-pointer border border-transparent hover:border-slate-100 h-full">
              <CardHeader className="p-8 pb-0 flex flex-row items-start justify-between">
                <div className={`${category.bg} p-5 rounded-xl group-hover:scale-110 transition-transform duration-500`}>
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                </div>
                <ChevronRight className="h-6 w-6 text-slate-200 group-hover:translate-x-2 transition-transform duration-500 group-hover:text-slate-400" />
              </CardHeader>
              <CardContent className="p-8">
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900 mb-3">
                  {category.title}
                </CardTitle>
                <CardDescription className="text-slate-500 font-semibold text-base leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          );

          if (category.title === "User Management") {
            return (
              <motion.div key={index} variants={item}>
                <Link href="/dashboard/users">
                  {cardContent}
                </Link>
              </motion.div>
            );
          }

          if (category.title === "Data & Logs") {
            return (
              <motion.div key={index} variants={item}>
                <Link href="/dashboard/settings/data-logs">
                  {cardContent}
                </Link>
              </motion.div>
            );
          }

          return (
            <motion.div key={index} variants={item}>
              {cardContent}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
