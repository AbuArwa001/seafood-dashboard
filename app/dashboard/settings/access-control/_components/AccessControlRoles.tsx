import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { formatPermission } from "./AccessControlConfig";

interface AccessControlRolesProps {
  filteredRoles: any[] | undefined;
  isLoading: boolean;
  error: Error | null;
  setSelectedRole: (role: any) => void;
  setIsDialogOpen: (val: boolean) => void;
  itemVariants: any;
}

export function AccessControlRoles({
  filteredRoles, isLoading, error, setSelectedRole, setIsDialogOpen, itemVariants
}: AccessControlRolesProps) {
  if (isLoading) {
    return (
      <>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8"><Skeleton className="h-8 w-1/2 rounded-lg" /><Skeleton className="h-4 w-3/4 mt-2 rounded-lg" /></CardHeader>
            <CardContent className="px-8 pb-8 space-y-4"><Skeleton className="h-24 w-full rounded-2xl" /></CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (error) {
    return (
      <div className="col-span-full py-20 text-center space-y-6">
        <div className="bg-amber-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-10 w-10 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Failed to load roles</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          There was an error communicating with the authentication server. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      {filteredRoles?.map((role) => (
        <motion.div key={role.id} variants={itemVariants} onClick={() => { setSelectedRole(role); setIsDialogOpen(true); }} className="cursor-pointer">
          <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] bg-white rounded-[1.5rem] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 border border-transparent hover:border-indigo-100 flex flex-col h-full group">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-start justify-between">
                <div className="bg-indigo-50 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="h-8 w-8 text-indigo-600" />
                </div>
                <Badge className="bg-slate-100 text-slate-500 border-none font-bold px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">
                  {role.permissions.length} Policies
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900 mt-6">{role.role_name}</CardTitle>
              <p className="text-slate-500 font-semibold text-sm mt-2">Standard permissions and data access protocols.</p>
            </CardHeader>
            <CardContent className="p-8 pt-4 flex-1">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Granted Permissions</p>
                <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                  {role.permissions.map((perm: any) => {
                    const { action, module, color } = formatPermission(perm.codename);
                    return (
                      <div key={perm.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${color}`}>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{action} {module}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Modified: {role.updated_at ? format(new Date(role.updated_at), "MMM dd, yyyy") : "Recently"}
                </span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  );
}
