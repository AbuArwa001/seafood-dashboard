"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { hasPermission } from "@/lib/permissions";
import { settingsCategories } from "./_components/SettingsConfig";
import { SettingsHeader } from "./_components/SettingsHeader";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const { user, isAdmin } = useAuth();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8">
      <SettingsHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {settingsCategories.map((category, index) => {
          if (category.isAdminOnly && !isAdmin) return null;
          if (category.permission && !hasPermission(user, category.permission) && !isAdmin) return null;

          const cardContent = (
            <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-lg  overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-pointer border border-transparent hover:border-slate-100 h-full">
              <CardHeader className="p-8 pb-0 flex flex-row items-start justify-between">
                <div className={`${category.bg} p-5 rounded-lg   group-hover:scale-110 transition-transform duration-500`}>
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                </div>
                <ChevronRight className="h-6 w-6 text-slate-200 group-hover:translate-x-2 transition-transform duration-500 group-hover:text-slate-400" />
              </CardHeader>
              <CardContent className="p-8">
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900 mb-3">{category.title}</CardTitle>
                <CardDescription className="text-slate-500 font-semibold text-base leading-relaxed">{category.description}</CardDescription>
              </CardContent>
            </Card>
          );

          return (
            <motion.div key={index} variants={item}>
              {category.link ? <Link href={category.link}>{cardContent}</Link> : cardContent}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
