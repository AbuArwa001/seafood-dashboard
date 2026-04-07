import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

interface PerformanceAnalyticsProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
  chartData: any[];
  toggleSeries: (entry: any) => void;
  visibleSeries: { shipments: boolean; sales: boolean };
  itemVariants: any;
}

export function PerformanceAnalytics({
  timeRange, setTimeRange, chartData, toggleSeries, visibleSeries, itemVariants,
}: PerformanceAnalyticsProps) {
  return (
    <motion.div variants={itemVariants} className="flex-[2] min-w-full lg:min-w-[700px]">
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white rounded-lgh-full overflow-hidden transition-all duration-500">
        <CardHeader className="border-b border-slate-50 p-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight flex items-center text-slate-900">
                <BarChart3 className="h-6 w-6 mr-3 text-secondary" />
                Performance <span className="text-[#1a365d] ml-1.5 italic">Analytics</span>
              </CardTitle>
              <p className="text-sm font-semibold text-slate-400 mt-2 uppercase tracking-widest">Year-over-year operational growth</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {["12M", "6M", "30D"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${t === timeRange ? "bg-white text-[#1a365d] shadow-sm" : "text-slate-400 hover:text-slate-600 cursor-pointer"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Legend onClick={toggleSeries} verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: "20px", fontSize: "10px", fontWeight: "black", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }} />
                <defs>
                  <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a365d" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1a365d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9A62" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FF9A62" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "black" }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "black" }} />
                <Tooltip contentStyle={{ borderRadius: "20px", border: "none", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", padding: "15px" }} cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="shipments" stroke="#1a365d" strokeWidth={4} fillOpacity={1} fill="url(#colorShipments)" name="Shipments" hide={!visibleSeries.shipments} activeDot={{ r: 8, strokeWidth: 0, fill: "#1a365d" }} />
                <Area type="monotone" dataKey="sales" stroke="#FF9A62" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" name="New Sales" hide={!visibleSeries.sales} activeDot={{ r: 8, strokeWidth: 0, fill: "#FF9A62" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
