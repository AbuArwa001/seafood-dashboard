"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { MarginForm } from "./MarginForm";
import { Loader2, Plus, Pencil, Trash2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function MarginConfigDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<"list" | "form">("list");
    const [editingMargin, setEditingMargin] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: margins, isLoading } = useQuery({
        queryKey: ["currency-margins"],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.MARGINS);
            return response.data.results || response.data;
        },
        enabled: isOpen,
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`${API_ENDPOINTS.MARGINS}${id}/`);
        },
        onSuccess: () => {
            toast.success("Margin deleted");
            queryClient.invalidateQueries({ queryKey: ["currency-margins"] });
        },
    });

    const handleEdit = (margin: any) => {
        setEditingMargin(margin);
        setView("form");
    };

    const handleClose = () => {
        setIsOpen(false);
        setView("list");
        setEditingMargin(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="bg-white text-primary font-black py-4 rounded-2xl w-full mt-8 hover:bg-slate-50 transition-colors">
                    CONFIGURE MARGINS
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <DialogHeader className="bg-primary p-8 text-white">
                    <DialogTitle className="text-2xl font-black flex items-center justify-between">
                        <div className="flex items-center">
                            <ShieldAlert className="mr-3 h-6 w-6" />
                            Treasury Margin Rules
                        </div>
                        {view === "list" && (
                            <Button
                                onClick={() => setView("form")}
                                variant="outline"
                                className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary rounded-xl font-bold"
                            >
                                <Plus className="h-4 w-4 mr-2" /> ADD RULE
                            </Button>
                        )}
                        {view === "form" && (
                            <Button
                                onClick={() => {
                                    setView("list");
                                    setEditingMargin(null);
                                }}
                                variant="link"
                                className="text-white hover:no-underline font-bold"
                            >
                                Back to Registry
                            </Button>
                        )}
                    </DialogTitle>
                    <p className="text-primary-foreground/60 text-sm font-bold mt-1 uppercase tracking-widest">
                        Configure risk markups for currency conversions
                    </p>
                </DialogHeader>

                <div className="p-8 max-h-[600px] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {view === "list" ? (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                {isLoading ? (
                                    <div className="py-20 flex justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : margins?.length > 0 ? (
                                    margins.map((margin: any) => (
                                        <div
                                            key={margin.id}
                                            className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-primary/20 transition-all"
                                        >
                                            <div className="flex items-center space-x-6">
                                                <div className="flex items-center -space-x-2">
                                                    <div className="h-10 w-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center font-black text-xs text-primary z-10">
                                                        {margin.from_currency_detail.code}
                                                    </div>
                                                    <div className="h-10 w-10 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center font-black text-xs text-slate-500">
                                                        {margin.to_currency_detail.code}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-slate-900">
                                                        {margin.margin_percentage}% <span className="text-xs text-slate-400 font-bold uppercase ml-2">Markup</span>
                                                    </p>
                                                    <div className="flex items-center mt-1">
                                                        <div className={`h-1.5 w-1.5 rounded-full mr-2 ${margin.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                            {margin.is_active ? 'Active & Enforced' : 'Paused / Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(margin)}
                                                    className="h-10 w-10 rounded-xl hover:bg-white hover:text-primary hover:shadow-sm"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (confirm("Delete this margin rule?")) {
                                                            deleteMutation.mutate(margin.id);
                                                        }
                                                    }}
                                                    className="h-10 w-10 rounded-xl hover:bg-white hover:text-red-500 hover:shadow-sm"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <ShieldAlert className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold italic">No active margin rules configured.</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <MarginForm
                                    initialData={editingMargin}
                                    onSuccess={() => {
                                        setView("list");
                                        setEditingMargin(null);
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
