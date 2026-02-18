"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

interface SalesCardProps {
    totalSalesVolume: number;
    salesData: any[];
}

export function SalesCard({ totalSalesVolume, salesData }: SalesCardProps) {
    // Process data for the chart
    const chartData = [...salesData]
        .reverse()
        .slice(-20)
        .map((sale) => ({
            amount: parseFloat(sale.total_sale_amount),
            date: sale.created_at,
        }));

    return (
        <Card className="border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] bg-slate-900 text-white rounded-xl overflow-hidden relative group w-full">
            {/* Background Gradients & Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px] -mt-40 -mr-40 group-hover:bg-secondary/25 transition-all duration-1000 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -mb-20 -ml-20 pointer-events-none" />

            <CardContent className="p-8 md:p-10 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
                                <TrendingUp className="h-6 w-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                    Revenue Performance
                                </p>
                                <h4 className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Global Accumulated Stream</h4>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                                ${totalSalesVolume.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </h3>
                            <div className="flex items-center gap-4 pt-2">
                                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/20 rounded-full px-4 py-1.5 backdrop-blur-sm">
                                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-black text-emerald-400">+12.5%</span>
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Growth vs Prev Cycle</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Area - Flexible container */}
                    <div className="w-full lg:w-[45%] h-[180px] md:h-[220px] relative group/chart">
                        <div className="absolute inset-0 bg-white/[0.02] rounded-3xl border border-white/[0.05] -m-4 transition-all group-hover/chart:bg-white/[0.04]" />
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenueProfessional" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FB923C" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-3xl ring-1 ring-white/10">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registry Value</p>
                                                    <p className="text-xl font-black text-white">
                                                        ${payload[0].value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#FB923C"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenueProfessional)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
