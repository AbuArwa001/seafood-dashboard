"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  RefreshCw,
  TrendingUp,
  Calendar,
  ArrowRightLeft,
  ChevronRight,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

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

export default function ExchangeRatesPage() {
  const {
    data: rates,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.EXCHANGE_RATES);
      return response.data.results || response.data;
    },
  });

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
            Daily <span className="text-primary italic">Exchange Rates</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Monitoring currency fluctuations for global seafood trade
            operations.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-white p-4 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-95 group border border-slate-50"
        >
          <RefreshCw
            className={`h-5 w-5 text-primary ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
          />
        </button>
      </header>

      {/* Main Table Card */}
      <motion.div variants={item}>
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black tracking-tight flex items-center">
                <ArrowRightLeft className="h-5 w-5 mr-3 text-primary" />
                Currency Conversion Matrix
              </CardTitle>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                Active Treasury Rates
              </p>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 text-primary font-black px-4 py-1"
            >
              {rates?.length || 0} ACTIVE PAIRS
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="font-black text-slate-900 px-8 h-14">
                    CURRENCY PAIR
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    EXCHANGE RATE
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14">
                    EFFECTIVE DATE
                  </TableHead>
                  <TableHead className="font-black text-slate-900 h-14 text-right px-8">
                    STATUS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRow key={i} className="border-slate-50">
                      <TableCell className="px-8 py-6">
                        <Skeleton className="h-8 w-32 rounded-xl" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-24 rounded-xl" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-40 rounded-xl" />
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Skeleton className="h-8 w-20 ml-auto rounded-xl" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : rates?.length > 0 ? (
                  rates.map((rate: any) => (
                    <TableRow
                      key={rate.id}
                      className="hover:bg-slate-50/50 transition-colors border-slate-50"
                    >
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-xl">
                            <span className="font-black text-primary text-xs">
                              {rate.from_currency.code}
                            </span>
                          </div>
                          <ChevronRight className="h-3 w-3 text-slate-300" />
                          <div className="bg-secondary/10 p-2 rounded-xl">
                            <span className="font-black text-secondary text-xs">
                              {rate.to_currency.code}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-black text-slate-900 tracking-tighter">
                            {rate.rate}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {rate.to_currency.symbol}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-slate-500 font-medium">
                          <Calendar className="h-4 w-4 mr-2 opacity-50" />
                          {formatDate(rate.rate_date, "PPP")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end">
                          <div className="flex items-center bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Active
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <p className="text-slate-400 font-bold italic">
                        No exchange rates found.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insight Section */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mt-20 -mr-20" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-4">
              Market <span className="text-secondary italic">Sentiment</span>
            </h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
              Treasury operations recommend using daily average rates for all
              logistics costs recorded in KES while calculating revenue in USD
              for export markets.
            </p>
            <div className="flex space-x-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                  Base Currency
                </p>
                <p className="text-xl font-black">USD</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                  Reference
                </p>
                <p className="text-xl font-black text-secondary">KES</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl shadow-primary/20">
          <div>
            <div className="bg-white/20 h-12 w-12 rounded-2xl flex items-center justify-center mb-6">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black mb-2">Automated Conversion</h3>
            <p className="text-primary-foreground/70 font-medium text-sm">
              All sales recorded in foreign currencies are automatically
              converted using the prevailing daily rate at 12:00 AM UTC.
            </p>
          </div>
          <button className="bg-white text-primary font-black py-4 rounded-2xl w-full mt-8 hover:bg-slate-50 transition-colors">
            CONFIGURE MARGINS
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
