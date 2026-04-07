import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, Users, Shield, Save, Loader2, Check } from "lucide-react";
import { SystemParameter, Role } from "@/types/models";
import { cn } from "@/lib/utils";

interface NotificationsListProps {
  parameters: SystemParameter[] | undefined;
  roles: Role[] | undefined;
  paramsLoading: boolean;
  pendingChanges: Record<string, string>;
  handleValueChange: (key: string, value: string) => void;
  handleSave: (key: string) => void;
  toggleRole: (currentValue: string, roleName: string) => string;
  updateMutation: any;
  itemVariants: any;
}

export function NotificationsList({
  parameters, roles, paramsLoading, pendingChanges, handleValueChange, handleSave, toggleRole, updateMutation, itemVariants
}: NotificationsListProps) {
  if (paramsLoading) {
    return (
      <div className="grid grid-cols-1 gap-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-none shadow-premium rounded-lg  bg-white">
            <CardContent className="p-10"><Skeleton className="h-8 w-1/3 mb-6" /><Skeleton className="h-20 w-full rounded-2xl" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {parameters?.map((param) => (
        <motion.div key={param.id} variants={itemVariants}>
          <Card className="border-none shadow-premium bg-white rounded-lg  overflow-hidden group hover:shadow-premium-hover transition-all duration-500">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">{param.name}</h3>
                      {param.data_type === "boolean" && <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] uppercase tracking-widest px-2 py-0">Global</Badge>}
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-xl">{param.description}</p>
                  </div>
                  <div className="flex items-center gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="bg-white p-2 rounded-lg   shadow-sm">
                      {param.key.includes("days") ? <Clock className="h-4 w-4 text-amber-500" /> : param.key.includes("email") ? <Mail className="h-4 w-4 text-blue-500" /> : param.key.includes("roles") ? <Users className="h-4 w-4 text-indigo-500" /> : <Shield className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">PROPRIETARY PARAMETER: <span className="text-slate-600">{param.key}</span></span>
                  </div>
                </div>

                <div className="w-full lg:w-[360px] flex flex-col justify-center gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Configuration Value</label>
                    {param.data_type === "boolean" ? (
                      <div className="h-16 flex items-center justify-between px-8 bg-slate-50 rounded-[1.25rem] border border-slate-100 shadow-sm">
                        <span className={cn("text-xs font-black uppercase tracking-widest", (pendingChanges[param.key] ?? param.value).toLowerCase() === "true" ? "text-emerald-600" : "text-slate-400")}>
                          {(pendingChanges[param.key] ?? param.value).toLowerCase() === "true" ? "Enabled" : "Disabled"}
                        </span>
                        <Switch checked={(pendingChanges[param.key] ?? param.value).toLowerCase() === "true"} onCheckedChange={(checked) => handleValueChange(param.key, checked ? "true" : "false")} />
                      </div>
                    ) : param.data_type === "json" && param.key === "notify_roles" ? (
                      <div className="space-y-2 max-h-[200px] overflow-y-auto p-2 bg-slate-50 rounded-[1.25rem] border border-slate-100 no-scrollbar">
                        {roles?.map((role) => {
                          const currentVal = pendingChanges[param.key] ?? param.value;
                          let isSelected = false;
                          try { isSelected = JSON.parse(currentVal).includes(role.role_name); } catch (e) { }
                          return (
                            <button
                              key={role.id}
                              onClick={() => handleValueChange(param.key, toggleRole(currentVal, role.role_name))}
                              className={cn("w-full flex items-center justify-between px-4 py-3 rounded-lg   transition-all font-bold text-xs uppercase tracking-tight", isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-500 hover:bg-slate-100")}
                            >
                              {role.role_name}
                              {isSelected && <Check className="h-3 w-3" />}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          type={param.data_type === "number" ? "number" : "text"}
                          value={pendingChanges[param.key] ?? param.value}
                          onChange={(e) => handleValueChange(param.key, e.target.value)}
                          className="h-16 px-8 rounded-[1.25rem] border-slate-100 bg-slate-50 focus:bg-white focus:border-amber-200 font-bold text-slate-900 transition-all text-lg shadow-sm"
                        />
                        {param.data_type === "number" && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">Days</div>}
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {pendingChanges[param.key] !== undefined && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}>
                        <Button
                          className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-200"
                          onClick={() => handleSave(param.key)} disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending && updateMutation.variables?.key === param.key ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <><Save className="h-5 w-5 mr-3" /> Update Environment</>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
