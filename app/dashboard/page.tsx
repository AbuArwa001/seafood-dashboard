"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  Ship,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Anchor,
  Activity,
  Plus,
  ArrowRightLeft,
  Layers,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShipmentForm } from "@/components/forms/ShipmentForm";
import { SaleForm } from "@/components/forms/SaleForm";
import { ProductForm } from "@/components/forms/ProductForm";
import { CategoryForm } from "@/components/forms/CategoryForm";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // Fetch Shipments
  const { data: shipments, isLoading: isLoadingShipments } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS, {
        params: { page_size: 1000 },
      });
      return response.data.results || response.data;
    },
  });

  // Fetch Products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, {
        params: { page_size: 1000 },
      });
      return response.data.results || response.data;
    },
  });

  // Fetch Sales
  const { data: sales, isLoading: isLoadingSales } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SALES, {
        params: { page_size: 1000 },
      });
      return response.data.results || response.data;
    },
  });

  // Fetch Exchange Rates
  const { data: exchangeRates } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.EXCHANGE_RATES, {
        params: { page_size: 1000 },
      });
      return response.data.results || response.data;
    },
  });

  // Fetch Payments
  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PAYMENTS, {
        params: { page_size: 1000 },
      });
      return response.data.results || response.data;
    },
  });

  // Calculate totals
  const totalRevenue = useMemo(
    () =>
      sales?.reduce(
        (acc: number, sale: any) =>
          acc + parseFloat(sale.total_sale_amount || 0),
        0,
      ) || 0,
    [sales],
  );

  const totalPaid = useMemo(
    () =>
      payments?.reduce(
        (acc: number, payment: any) =>
          acc + parseFloat(payment.amount_paid || 0),
        0,
      ) || 0,
    [payments],
  );

  const pendingPayments = totalRevenue - totalPaid;

  // Derive simple chart data from sales
  const salesChartData = useMemo(() => {
    if (!sales) return [0, 0, 0, 0, 0, 0, 0];
    const last7 = sales
      .slice(-7)
      .map((s: any) => parseFloat(s.total_sale_amount || 0));
    while (last7.length < 7) last7.unshift(0);
    return last7;
  }, [sales]);

  const shipmentChartData = useMemo(() => {
    if (!shipments) return [0, 0, 0, 0, 0, 0, 0];
    // Just a placeholder based on volume for now
    return shipments.slice(-7).map((s: any) => s.items?.length || 0);
  }, [shipments]);

  const stats = [
    {
      title: "Total Revenue",
      value: isLoadingSales
        ? "..."
        : `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
      data: salesChartData,
    },
    {
      title: "Active Shipments",
      value: isLoadingShipments
        ? "..."
        : (
            shipments?.filter((s: any) => s.status !== "COMPLETED").length || 0
          ).toString(),
      change: "+4",
      trend: "up",
      icon: Ship,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      data: shipmentChartData,
    },
    {
      title: "Pending Payments",
      value:
        isLoadingPayments || isLoadingSales
          ? "..."
          : `$${pendingPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: "-8%",
      trend: "down",
      icon: CreditCard,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      data: [45, 30, 55, 20, 40, 35, 30],
    },
    {
      title: "Total Products",
      value: isLoadingProducts ? "..." : products?.length?.toString() || "0",
      change: "+3",
      trend: "up",
      icon: Package,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      data: [10, 20, 15, 25, 30, 28, 35],
    },
  ];

  // Helper for Currency Watch
  const kshRates = useMemo(() => {
    if (!exchangeRates) return [];
    // We want rates where to_currency is KES (Kenya Shilling)
    return exchangeRates
      .filter((r: any) => r.to_currency.code === "KES")
      .map((r: any) => ({
        name: r.from_currency.name,
        code: r.from_currency.code,
        rate: parseFloat(r.rate).toFixed(4),
        symbol: r.from_currency.symbol,
      }));
  }, [exchangeRates]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 p-2"
    >
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading">
            Executive <span className="text-primary italic">Overview</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Welcome back. Your seafood registry is performing{" "}
            <span className="text-secondary font-bold">optimally</span>.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="rounded-2xl border-slate-200 font-bold hover:bg-slate-50"
          >
            Export Report
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl font-black shadow-lg shadow-primary/25">
                <Plus className="h-4 w-4 mr-2" /> CREATE NEW REGISTRY
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-primary p-6 text-white text-center">
                <DialogTitle className="text-2xl font-black">
                  Product Registry
                </DialogTitle>
                <p className="text-primary-foreground/80 text-[10px] font-bold mt-1 uppercase tracking-widest">
                  Create a new catalog entry
                </p>
              </div>
              <div className="p-8">
                <ProductForm onSuccess={() => setIsAddModalOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-0">
                <div className="p-6 pb-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-2xl`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div
                      className={`flex items-center text-xs font-black ${stat.trend === "up" ? "text-secondary" : "text-destructive"}`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {stat.title}
                    </p>
                    <div className="text-3xl font-black text-slate-900 tracking-tighter">
                      {stat.value}
                    </div>
                  </div>
                </div>
                <div className="h-16 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stat.data.map((v: any) => ({ v }))}>
                      <defs>
                        <linearGradient
                          id={`grad-${idx}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={
                              stat.trend === "up" ? "#10B981" : "#0F52BA"
                            }
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={
                              stat.trend === "up" ? "#10B981" : "#0F52BA"
                            }
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={stat.trend === "up" ? "#10B981" : "#0F52BA"}
                        fillOpacity={1}
                        fill={`url(#grad-${idx})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
        {/* Analytics Chart */}
        <motion.div variants={item} className="lg:col-span-4">
          <Card className="border-none shadow-premium bg-white group h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
              <div>
                <CardTitle className="text-xl font-black tracking-tight flex items-center">
                  <Activity className="h-5 w-5 mr-3 text-primary" />
                  Performance Analytics
                </CardTitle>
                <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                  Revenue vs Shipments
                </p>
              </div>
              <div className="bg-slate-50 p-1 rounded-xl flex">
                <button className="px-4 py-1.5 text-xs font-black bg-white shadow-sm rounded-lg text-primary">
                  Income
                </button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500">
                  Volume
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesChartData.map((v: number, i: number) => ({
                      name: `P${i + 1}`,
                      value: v,
                    }))}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0F52BA"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0F52BA"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "20px",
                        border: "none",
                        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                        padding: "15px",
                      }}
                      itemStyle={{ fontWeight: "black", color: "#0F52BA" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0F52BA"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Shipments */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-none shadow-premium bg-slate-900 text-white h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mt-10 -mr-10" />
            <CardHeader className="relative z-10 border-b border-white/5 pb-2">
              <CardTitle className="text-xl font-black flex items-center">
                <Anchor className="h-5 w-5 mr-3 text-secondary" />
                Live Feed
              </CardTitle>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Real-time shipments
              </p>
            </CardHeader>
            <CardContent className="relative z-10 pt-6">
              <div className="space-y-6">
                {isLoadingShipments ? (
                  [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-3xl"
                    >
                      <Skeleton className="h-10 w-10 rounded-2xl bg-white/10" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-20 bg-white/10" />
                        <Skeleton className="h-3 w-32 bg-white/10" />
                      </div>
                    </div>
                  ))
                ) : shipments?.length > 0 ? (
                  shipments.slice(0, 4).map((shipment: any) => (
                    <div
                      key={shipment.id}
                      className="group relative flex items-center justify-between p-4 bg-white/5 rounded-3xl hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/20 h-10 w-10 rounded-2xl flex items-center justify-center">
                          <Ship className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-black tracking-tight">
                            SHP#{shipment.id.substring(0, 4)}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {shipment.country_origin}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-secondary">
                          {shipment.status === "COMPLETED" ? "DONE" : "TRACK"}
                        </p>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                            shipment.status === "RECEIVED" ||
                            shipment.status === "COMPLETED"
                              ? "bg-secondary/20 text-secondary"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {shipment.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 font-bold text-center py-10 italic">
                    No active shipments found.
                  </p>
                )}
                <Button className="w-full bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 mt-2">
                  VIEW FULL LOG <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="grid gap-8 lg:grid-cols-6">
        {/* Regional Currency Watch */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-none shadow-premium bg-white h-full">
            <CardHeader className="border-b border-slate-50 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black tracking-tight flex items-center">
                    <ArrowRightLeft className="h-5 w-5 mr-3 text-secondary" />
                    Currency Watch
                  </CardTitle>
                  <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                    Regional Rates to KSH
                  </p>
                </div>
                <div className="bg-secondary/10 px-3 py-1 rounded-full">
                  <span className="text-[10px] font-black text-secondary tracking-widest">
                    REAL-TIME
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-1">
                {kshRates.length > 0 ? (
                  kshRates.map((curr: any) => (
                    <div
                      key={curr.code}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs bg-slate-100">
                          {curr.code}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {curr.name}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {curr.code} / KSH
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900 tracking-tighter">
                          {curr.rate}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          Current Unit Rate
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-slate-400 font-bold italic text-sm">
                      No KSH pairs configured in Vault
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Health / Logistics Summary */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-none shadow-premium bg-primary text-white h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-20 -mr-20" />
            <CardHeader>
              <CardTitle className="text-xl font-black flex items-center">
                <TrendingUp className="h-5 w-5 mr-3 text-secondary" />
                Operational Pulse
              </CardTitle>
              <p className="text-sm text-primary-foreground/60 font-bold uppercase tracking-widest mt-1">
                Supply Chain Efficiency
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/10 p-6 rounded-[2rem] border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/50 mb-2">
                    Avg. Transit
                  </p>
                  <p className="text-3xl font-black">
                    4.2{" "}
                    <span className="text-sm font-bold opacity-50">Days</span>
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-[2rem] border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/50 mb-2">
                    Compliance
                  </p>
                  <p className="text-3xl font-black">
                    98 <span className="text-sm font-bold opacity-50">%</span>
                  </p>
                </div>
              </div>
              <div className="mt-8 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-black">
                    Regional Logistics Status
                  </p>
                  <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[85%]" />
                  </div>
                  <p className="text-[10px] font-bold text-primary-foreground/60 uppercase text-center tracking-widest">
                    85% Capacity Utilization in East Africa
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions Integration */}
      <motion.div variants={item}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Log Shipment Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-white p-6 rounded-[2rem] shadow-premium flex items-center space-x-6 group cursor-pointer hover:bg-primary transition-all duration-500">
                <div className="bg-primary/10 p-4 rounded-3xl group-hover:bg-white/20 transition-colors">
                  <Ship className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-white">
                    Log Shipment
                  </p>
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70 text-nowrap">
                    New seafood cargo
                  </p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-primary p-6 text-white">
                <DialogTitle className="text-2xl font-black flex items-center">
                  <Ship className="mr-3 h-6 w-6" /> Register Shipment
                </DialogTitle>
                <p className="text-primary-foreground/80 text-sm font-bold mt-1 uppercase tracking-widest">
                  Create a new cargo entry
                </p>
              </div>
              <div className="p-8">
                <ShipmentForm />
              </div>
            </DialogContent>
          </Dialog>

          {/* Record Sale Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-white p-6 rounded-[2rem] shadow-premium flex items-center space-x-6 group cursor-pointer hover:bg-secondary transition-all duration-500">
                <div className="bg-secondary/10 p-4 rounded-3xl group-hover:bg-white/20 transition-colors">
                  <Activity className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-white">
                    Record Sale
                  </p>
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70 text-nowrap">
                    Transaction data
                  </p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-secondary p-6 text-white">
                <DialogTitle className="text-2xl font-black flex items-center">
                  <Activity className="mr-3 h-6 w-6" /> Record Sale
                </DialogTitle>
                <p className="text-white/80 text-sm font-bold mt-1 uppercase tracking-widest">
                  Post-shipment transaction
                </p>
              </div>
              <div className="p-8">
                <SaleForm />
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Product Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-white p-6 rounded-[2rem] shadow-premium flex items-center space-x-6 group cursor-pointer hover:bg-slate-900 transition-all duration-500">
                <div className="bg-slate-100 p-4 rounded-3xl group-hover:bg-white/20 transition-colors">
                  <Package className="h-8 w-8 text-slate-900 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-white">
                    Add Product
                  </p>
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70 text-nowrap">
                    Extend inventory
                  </p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <DialogTitle className="text-2xl font-black flex items-center">
                  <Package className="mr-3 h-6 w-6" /> Add Product
                </DialogTitle>
                <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">
                  Central catalog entry
                </p>
              </div>
              <div className="p-8">
                <ProductForm />
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Category Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-white p-6 rounded-[2rem] shadow-premium flex items-center space-x-6 group cursor-pointer hover:bg-emerald-600 transition-all duration-500">
                <div className="bg-emerald-50 p-4 rounded-3xl group-hover:bg-white/20 transition-colors">
                  <Layers className="h-8 w-8 text-emerald-600 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-white">
                    Add Category
                  </p>
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70 text-nowrap">
                    Manage taxonomy
                  </p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-emerald-600 p-6 text-white">
                <DialogTitle className="text-2xl font-black flex items-center">
                  <Layers className="mr-3 h-6 w-6" /> Add Category
                </DialogTitle>
                <p className="text-emerald-50 text-sm font-bold mt-1 uppercase tracking-widest">
                  Product classification
                </p>
              </div>
              <div className="p-8">
                <CategoryForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    </motion.div>
  );
}
