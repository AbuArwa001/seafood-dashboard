import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { parseCodename } from "./SecurityConfig";

interface PermissionsCardProps {
  permissions: any[];
  groupedPermissions: any;
  itemVariants: any;
}

export function PermissionsCard({ permissions, groupedPermissions, itemVariants }: PermissionsCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="px-8 pt-8 pb-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-3 rounded-2xl">
              <Shield className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-slate-900">Access Permissions</CardTitle>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {permissions.length} permission{permissions.length !== 1 ? "s" : ""} granted to your role
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {permissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="bg-slate-50 p-6 rounded-2xl"><Lock className="h-10 w-10 text-slate-200" /></div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No explicit permissions assigned</p>
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(groupedPermissions).map(([module, perms]) => (
                <div key={module}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{module}</p>
                  <div className="flex flex-wrap gap-2">
                    {(perms as any[]).map((perm: any) => {
                      const { actionLabel, colorClass } = parseCodename(perm.codename);
                      return (
                        <span key={perm.codename} className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg   border ${colorClass}`}>
                          <CheckCircle2 className="h-3 w-3" />
                          {actionLabel}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
