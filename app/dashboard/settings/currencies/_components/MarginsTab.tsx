import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface MarginsTabProps {
  margins: any[];
  loadingMargins: boolean;
  handleEdit: (data: any) => void;
  deleteMarginMutation: any;
  itemVariants: any;
}

export function MarginsTab({ margins, loadingMargins, handleEdit, deleteMarginMutation, itemVariants }: MarginsTabProps) {
  return (
    <motion.div variants={itemVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loadingMargins ? (
          <div className="col-span-full h-40 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          margins?.map((margin: any) => (
            <Card key={margin.id} className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-lgoverflow-hidden border border-slate-50 hover:shadow-xl transition-all duration-300 group ring-1 ring-slate-100/50">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center -space-x-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xl ring-4 ring-white relative z-10 transition-transform group-hover:scale-110">
                      {margin.from_currency_detail.code}
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shadow-inner">
                      {margin.to_currency_detail.code}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Buffer</p>
                    <div className="text-3xl font-black text-blue-600">+{margin.margin_percentage}%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full mr-3 ${margin.is_active ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" : "bg-slate-300"}`} />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{margin.is_active ? "Operational" : "Paused"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(margin)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => confirm("Remove margin rule?") && deleteMarginMutation.mutate(margin.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
}
