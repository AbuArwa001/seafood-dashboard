import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Info, Save, Loader2 } from "lucide-react";
import { CATEGORY_CONFIG } from "./SystemParametersConfig";
import { SystemParameter } from "@/types/models";

interface SystemParametersListProps {
  filteredParameters: SystemParameter[] | undefined;
  isLoading: boolean;
  pendingChanges: Record<string, string>;
  handleValueChange: (key: string, value: string) => void;
  handleSave: (key: string) => void;
  updateMutation: any;
  itemVariants: any;
}

export function SystemParametersList({
  filteredParameters, isLoading, pendingChanges, handleValueChange, handleSave, updateMutation, itemVariants
}: SystemParametersListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardContent className="p-8"><Skeleton className="h-6 w-1/3 mb-4" /><Skeleton className="h-12 w-full rounded-xl" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <AnimatePresence mode="popLayout">
        {filteredParameters?.map((param) => (
          <motion.div key={param.id} layout variants={itemVariants} initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.95 }}>
            <Card className="border-none shadow-premium bg-white rounded-[2rem] overflow-hidden hover:shadow-premium-hover transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg   ${CATEGORY_CONFIG[param.category].color}`}>
                        {(() => { const Icon = CATEGORY_CONFIG[param.category].icon; return <Icon className="h-4 w-4" />; })()}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">{param.name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {param.key}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                      <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{param.description}</p>
                    </div>
                  </div>

                  <div className="w-full md:w-[400px] space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 ml-1">Setting Value</label>
                      <div className="relative group">
                        {param.data_type === "boolean" ? (
                          <div className="h-14 flex items-center justify-between px-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">{(pendingChanges[param.key] ?? param.value) === "True" ? "Enabled" : "Disabled"}</span>
                            <Switch checked={(pendingChanges[param.key] ?? param.value) === "True"} onCheckedChange={(checked) => handleValueChange(param.key, checked ? "True" : "False")} />
                          </div>
                        ) : (
                          <Input
                            type={param.data_type === "number" ? "number" : "text"}
                            value={pendingChanges[param.key] ?? param.value}
                            onChange={(e) => handleValueChange(param.key, e.target.value)}
                            className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-200 font-bold text-slate-900 transition-all text-lg shadow-sm"
                          />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {pendingChanges[param.key] !== undefined && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                          <Button
                            className="w-full h-12 rounded-lg   bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200"
                            onClick={() => handleSave(param.key)} disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending && updateMutation.variables?.key === param.key ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <><Save className="h-4 w-4 mr-2" /> Commit Change</>
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
              <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <Badge variant="outline" className="bg-white text-[9px] font-black uppercase tracking-widest border-slate-200 px-2 py-0.5 rounded-md">Type: {param.data_type}</Badge>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Synchronized: {new Date(param.updated_at).toLocaleDateString()}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
