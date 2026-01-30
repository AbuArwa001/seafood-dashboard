"use client";

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
  // Fetch Shipments
  const { data: shipments, isLoading: isLoadingShipments } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS);
      return response.data.results || response.data;
    },
  });

  // Fetch Products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS);
      return response.data.results || response.data;
    },
  });

  // Fetch Sales
  const { data: sales, isLoading: isLoadingSales } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SALES);
      return response.data.results || response.data;
    },
  });

  // Fetch Payments
  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PAYMENTS);
      return response.data.results || response.data;
    },
  });

  // Calculate totals
  const totalRevenue =
    sales?.reduce(
      (acc: number, sale: any) => acc + parseFloat(sale.total_sale_amount || 0),
      0,
    ) || 0;
  const totalPaid =
    payments?.reduce(
      (acc: number, payment: any) => acc + parseFloat(payment.amount_paid || 0),
      0,
    ) || 0;
  const pendingPayments = totalRevenue - totalPaid;

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
      data: [2400, 1398, 9800, 3908, 4800, 3800, 4300],
    },
    {
      title: "Active Shipments",
      value: isLoadingShipments ? "..." : shipments?.length?.toString() || "0",
      change: "+4",
      trend: "up",
      icon: Ship,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      data: [12, 18, 15, 22, 30, 25, 28],
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
          <Button className="rounded-2xl font-black shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4 mr-2" /> CREATE NEW REGISTRY
          </Button>
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
                    <AreaChart data={stat.data.map((v, i) => ({ v }))}>
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
                    data={[2400, 1398, 9800, 3908, 4800, 3800, 4300].map(
                      (v, i) => ({ name: i, value: v }),
                    )}
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

      {/* Quick Actions Integration */}
      <motion.div variants={item}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70">
                    Register new seafood cargo
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
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70">
                    Insert transaction data
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
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70">
                    Extend your inventory
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
        </div>
      </motion.div>
    </motion.div>
  );
}
