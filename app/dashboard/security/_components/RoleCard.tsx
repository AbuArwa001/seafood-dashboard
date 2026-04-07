import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface RoleCardProps {
  isAdmin: boolean;
  roleName: string | null | undefined;
  itemVariants: any;
}

export function RoleCard({ isAdmin, roleName, itemVariants }: RoleCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] bg-white rounded-[2rem] overflow-hidden">
        <CardContent className="p-7">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl ${isAdmin ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-500"}`}>
              {isAdmin ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">System Role</p>
              <p className="text-lg font-black text-slate-900 leading-none">{roleName ?? "—"}</p>
              <p className="text-xs text-slate-400 font-semibold mt-2 leading-relaxed">
                {isAdmin ? "Full administrative access to all modules and settings." : "Scoped access to specific modules based on role."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
