import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface DashboardStatsProps {
  stats: any[];
  itemVariants: any;
}

export function DashboardStats({ stats, itemVariants }: DashboardStatsProps) {
  return (
    <div className="flex flex-wrap gap-8">
      {stats.map((stat, idx) => (
        <motion.div key={stat.title} variants={itemVariants} className="flex-1 min-w-full sm:min-w-[280px] lg:min-w-[22%]">
          <Card className="border-none shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] bg-white rounded-[1.5rem] overflow-hidden group hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-500">
            <CardContent className="p-0">
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div className={`${stat.bgColor} p-4 rounded-[1.5rem] shadow-sm transform group-hover:rotate-6 transition-transform duration-500`}>
                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center text-[10px] font-black px-2.5 py-1 rounded-full ${stat.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {stat.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1.5" /> : <TrendingDown className="h-3 w-3 mr-1.5" />}
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400/80 uppercase tracking-[0.2em]">{stat.title}</p>
                  <div className="text-2xl xl:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tighter group-hover:text-[#1a365d] transition-colors duration-500 truncate">
                    {stat.value}
                  </div>
                </div>
              </div>
              <div className="h-20 w-full opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.data.map((v: any) => ({ v }))}>
                    <defs>
                      <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={stat.trend === "up" ? "#10B981" : "#1a365d"} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={stat.trend === "up" ? "#10B981" : "#1a365d"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={stat.trend === "up" ? "#10B981" : "#1a365d"} fillOpacity={1} fill={`url(#grad-${idx})`} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
