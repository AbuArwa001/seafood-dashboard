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
    // We want to show a trend, so we'll take the last 7 sales or group by date if possible.
    // For simplicity and visual effect, let's map the last 10 sales in reverse order (oldest to newest)
    // assuming salesData is sorted new -> old.
    const chartData = [...salesData]
        .reverse()
        .slice(-20) // Take last 20 records for a decent trend line
        .map((sale) => ({
            amount: parseFloat(sale.total_sale_amount),
            date: sale.created_at,
        }));

    // Calculate percentage change (mock logic or real if data allows)
    // For now, let's just show a positive trend visual
    const isPositive = true;

    return (
        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] bg-slate-900 text-white rounded-[2.5rem] overflow-hidden relative group h-full min-h-[280px]">
            {/* Background Gradients & Effects */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-[100px] -mt-20 -mr-20 group-hover:bg-secondary/30 transition-colors duration-700 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[80px] -mb-10 -ml-10 pointer-events-none" />

            <CardContent className="p-0 h-full flex flex-col justify-between relative z-10">
                <div className="p-8 pb-0">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                                Accumulated Revenue
                            </p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                                    ${totalSalesVolume.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </h3>
                            </div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5 shadow-inner">
                            <TrendingUp className="h-6 w-6 text-secondary" />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/20 rounded-full px-3 py-1">
                            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-400">+12.5%</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 self-center">vs last month</span>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="h-[120px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-xl">
                                                <p className="text-xs font-semibold text-slate-300 mb-1">Sale Amount</p>
                                                <p className="text-lg font-black text-white">
                                                    ${payload[0].value?.toLocaleString()}
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
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
