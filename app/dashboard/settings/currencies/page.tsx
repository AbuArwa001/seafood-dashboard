"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Banknote,
    RefreshCw,
    ShieldAlert,
    Globe,
    Plus,
    TrendingUp,
    ArrowRightLeft,
    ChevronRight,
    MoreVertical,
    Edit2,
    Trash2,
    Package,
    Calendar,
    Loader2
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { CurrencyForm } from "@/components/forms/CurrencyForm";
import { ExchangeRateForm } from "@/components/forms/ExchangeRateForm";
import { MarginForm } from "@/components/forms/MarginForm";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function CurrencyRatesSettings() {
    const [activeTab, setActiveTab] = useState("currencies");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const queryClient = useQueryClient();

    // --- Queries ---
    const { data: currencies, isLoading: loadingCurrencies } = useQuery({
        queryKey: ["currencies"],
        queryFn: async () => {
            const resp = await apiClient.get(API_ENDPOINTS.CURRENCIES, { params: { page_size: 100 } });
            return resp.data.results || resp.data;
        },
    });

    const { data: rates, isLoading: loadingRates } = useQuery({
        queryKey: ["exchange-rates"],
        queryFn: async () => {
            const resp = await apiClient.get(API_ENDPOINTS.EXCHANGE_RATES, { params: { page_size: 50 } });
            return resp.data.results || resp.data;
        },
    });

    const { data: margins, isLoading: loadingMargins } = useQuery({
        queryKey: ["currency-margins"],
        queryFn: async () => {
            const resp = await apiClient.get(API_ENDPOINTS.MARGINS);
            return resp.data.results || resp.data;
        },
    });

    // --- Deletion Mutations ---
    const deleteCurrency = useMutation({
        mutationFn: (id: string) => apiClient.delete(`${API_ENDPOINTS.CURRENCIES}${id}/`),
        onSuccess: () => {
            toast.success("Currency removed from registry");
            queryClient.invalidateQueries({ queryKey: ["currencies"] });
        },
    });

    const deleteMargin = useMutation({
        mutationFn: (id: string) => apiClient.delete(`${API_ENDPOINTS.MARGINS}${id}/`),
        onSuccess: () => {
            toast.success("Margin rule deleted");
            queryClient.invalidateQueries({ queryKey: ["currency-margins"] });
        },
    });

    const handleOpenChange = (open: boolean) => {
        setIsAddModalOpen(open);
        if (!open) setEditingItem(null);
    };

    const handleEdit = (data: any) => {
        setEditingItem(data);
        setIsAddModalOpen(true);
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-12 p-4 lg:p-8"
        >
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-blue-600/10 p-2 rounded-lg">
                            <Globe className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/60">Financial Configuration</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
                        Treasury <span className="text-blue-600 italic">& Rates</span>
                    </h2>
                    <p className="text-slate-500 font-semibold mt-3 text-lg max-w-2xl">
                        Centralized management of global currencies, exchange pairs, and
                        <span className="text-blue-600 font-black"> risk-adjusted margins</span>.
                    </p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl shadow-slate-900/20 font-black flex items-center hover:bg-slate-800 transition-all active:scale-95 group shrink-0">
                            <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                            {activeTab === "currencies" ? "ADD CURRENCY" : activeTab === "rates" ? "RECORD RATE" : "NEW MARGIN RULE"}
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mt-10 -mr-10" />
                            <DialogTitle className="text-2xl font-black">
                                {editingItem ? 'Modify Registry' : 'New Financial Entry'}
                            </DialogTitle>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                                {activeTab.toUpperCase()} CONFIGURATION
                            </p>
                        </div>
                        <div className="p-10">
                            {activeTab === "currencies" && (
                                <CurrencyForm initialData={editingItem} onSuccess={() => handleOpenChange(false)} />
                            )}
                            {activeTab === "rates" && (
                                <ExchangeRateForm initialData={editingItem} onSuccess={() => handleOpenChange(false)} />
                            )}
                            {activeTab === "margins" && (
                                <MarginForm initialData={editingItem} onSuccess={() => handleOpenChange(false)} />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            <Tabs defaultValue="currencies" onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-slate-100/50 p-1.5 rounded-[1.5rem] h-16 border border-slate-200/60 w-full sm:w-auto">
                    <TabsTrigger value="currencies" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg active:scale-95 transition-all">
                        CURRENCIES
                    </TabsTrigger>
                    <TabsTrigger value="rates" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg active:scale-95 transition-all">
                        EXCHANGE RATES
                    </TabsTrigger>
                    <TabsTrigger value="margins" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg active:scale-95 transition-all">
                        MARGIN RULES
                    </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                    {/* CURRENCIES TAB */}
                    <TabsContent value="currencies">
                        <motion.div variants={item} initial="hidden" animate="show" className="grid grid-cols-1 gap-8">
                            <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/40">
                                <CardHeader className="p-8 border-b border-slate-100 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black text-slate-900">Active Registry</CardTitle>
                                        <CardDescription className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mt-1">Global Currency Standards</CardDescription>
                                    </div>
                                    <Badge className="bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 border-none px-4 py-1.5 rounded-full font-black">
                                        {currencies?.length || 0} ASSETS
                                    </Badge>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow className="hover:bg-transparent border-slate-100">
                                                <TableHead className="px-8 font-black text-slate-900 uppercase tracking-tighter text-xs">ISO Code</TableHead>
                                                <TableHead className="font-black text-slate-900 uppercase tracking-tighter text-xs">Currency Name</TableHead>
                                                <TableHead className="text-center font-black text-slate-900 uppercase tracking-tighter text-xs">Symbol</TableHead>
                                                <TableHead className="text-center font-black text-slate-900 uppercase tracking-tighter text-xs">Status</TableHead>
                                                <TableHead className="text-right px-8 font-black text-slate-900 uppercase tracking-tighter text-xs">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loadingCurrencies ? (
                                                <TableRow><TableCell colSpan={5} className="h-40 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                                            ) : currencies?.map((curr: any) => (
                                                <TableRow key={curr.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                                                    <TableCell className="px-8 py-6">
                                                        <div className="bg-slate-900 text-white font-black px-4 py-1.5 rounded-xl text-center inline-block text-xs">
                                                            {curr.code}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-bold text-slate-700">{curr.name}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="bg-slate-100 p-2.5 rounded-xl font-black text-slate-500 min-w-[40px] inline-block text-center text-sm">
                                                            {curr.symbol || "-"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center">
                                                            <div className={`h-2 w-2 rounded-full mr-2 ${curr.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${curr.is_active ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                                {curr.is_active ? 'Active' : 'Archived'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right px-8">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button onClick={() => handleEdit(curr)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 className="h-4 w-4" /></button>
                                                            <button onClick={() => confirm("Delete currency?") && deleteCurrency.mutate(curr.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="h-4 w-4" /></button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* EXCHANGE RATES TAB */}
                    <TabsContent value="rates">
                        <motion.div variants={item} initial="hidden" animate="show" className="grid grid-cols-1 gap-8">
                            <Card className="border-none shadow-[0_20px_50px_-15_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-8 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50">
                                    <div>
                                        <CardTitle className="text-2xl font-black text-slate-900">Rate Matrix</CardTitle>
                                        <CardDescription className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mt-1">Historical & Real-time Parity</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-slate-100/30">
                                            <TableRow className="hover:bg-transparent border-slate-100">
                                                <TableHead className="px-8 font-black text-slate-900 text-xs">PAIR</TableHead>
                                                <TableHead className="font-black text-slate-900 text-xs text-center">VALUE</TableHead>
                                                <TableHead className="font-black text-slate-900 text-xs">EFFECTIVE DATE</TableHead>
                                                <TableHead className="font-black text-slate-900 text-xs text-right px-8">STABILITY</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loadingRates ? (
                                                <TableRow><TableCell colSpan={4} className="h-40 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                                            ) : rates?.map((rate: any) => (
                                                <TableRow key={rate.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                                                    <TableCell className="px-8 py-6">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="bg-blue-600 text-white font-black px-3 py-1 rounded-lg text-[10px] shadow-sm">{rate.from_currency.code}</div>
                                                            <ChevronRight className="h-3 w-3 text-slate-300" />
                                                            <div className="bg-slate-200 text-slate-700 font-black px-3 py-1 rounded-lg text-[10px] shadow-sm">{rate.to_currency.code}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="inline-flex items-center space-x-2">
                                                            <span className="text-xl font-black text-slate-900 tracking-tighter">{rate.rate}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{rate.to_currency.code}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center text-slate-500 font-bold text-sm">
                                                            <Calendar className="h-4 w-4 mr-2 text-slate-300" />
                                                            {formatDate(rate.rate_date, "PPP")}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right px-8">
                                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[10px] px-3 py-1">
                                                            MARKET ACTIVE
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* MARGINS TAB */}
                    <TabsContent value="margins">
                        <motion.div variants={item} initial="hidden" animate="show" className="grid grid-cols-1 gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {loadingMargins ? (
                                    <div className="col-span-full h-40 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
                                ) : margins?.map((margin: any) => (
                                    <Card key={margin.id} className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 hover:shadow-xl transition-all duration-300 group ring-1 ring-slate-100/50">
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
                                                    <div className={`h-2.5 w-2.5 rounded-full mr-3 ${margin.is_active ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-300'}`} />
                                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{margin.is_active ? 'Operational' : 'Paused'}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => handleEdit(margin)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Edit2 className="h-4 w-4" /></button>
                                                    <button onClick={() => confirm("Remove margin rule?") && deleteMargin.mutate(margin.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    </TabsContent>
                </AnimatePresence>
            </Tabs>

            {/* Bottom Insight Card */}
            <motion.div variants={item} className="mt-20">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-12 rounded-[3.5rem] text-white overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mt-64 -mr-64 animate-pulse" />
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="bg-blue-600/20 w-fit p-4 rounded-3xl mb-8">
                                <ShieldAlert className="h-8 w-8 text-blue-400" />
                            </div>
                            <h3 className="text-3xl font-black mb-6 leading-tight">Treasury <span className="text-blue-400 italic">Protection</span> Protocol</h3>
                            <p className="text-slate-400 font-semibold text-lg max-w-lg mb-8">
                                All conversions in the SeaFood Registry apply a weighted margin to mitigate local currency volatility risk.
                                <span className="text-white"> Admin overrides are logged and audited automatically.</span>
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">System Default</p>
                                    <p className="font-black text-xl">2.00%</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Auto-Sync</p>
                                    <p className="font-black text-xl text-emerald-400 underline decoration-emerald-400/30 underline-offset-4">ENABLED</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-2 rounded-[3rem] shadow-inner group">
                            <img
                                src="https://images.unsplash.com/photo-1611974717482-99617dd04942?q=80&w=2070&auto=format&fit=crop"
                                alt="Market Monitoring"
                                className="rounded-[2.8rem] opacity-60 group-hover:opacity-80 transition-opacity duration-500 grayscale hover:grayscale-0"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
