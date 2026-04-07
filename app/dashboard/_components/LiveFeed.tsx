import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Anchor, Ship, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface LiveFeedProps {
  shipments: any[];
  isLoadingShipments: boolean;
  router: any;
  itemVariants: any;
}

export function LiveFeed({ shipments, isLoadingShipments, router, itemVariants }: LiveFeedProps) {
  return (
    <motion.div variants={itemVariants} className="flex-1 min-w-full lg:min-w-[350px]">
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] bg-[#1a365d] text-white h-full relative overflow-hidden rounded-lgtransition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mt-20 -mr-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mb-10 -ml-10" />

        <CardHeader className="relative z-10 border-b border-white/10 p-8 pb-6">
          <CardTitle className="text-2xl font-black tracking-tight flex items-center text-white">
            <Anchor className="h-6 w-6 mr-3 text-secondary" />
            Live <span className="text-secondary ml-1.5 italic">Feed</span>
          </CardTitle>
          <p className="text-[10px] text-blue-200/60 font-black uppercase tracking-[0.25em] mt-2">Global Logistics Stream</p>
        </CardHeader>
        <CardContent className="relative z-10 p-8 pt-6">
          <div className="space-y-4">
            {isLoadingShipments ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-5 bg-white/5 rounded-[1.75rem] border border-white/5">
                  <Skeleton className="h-11 w-11 rounded-2xl bg-white/10" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24 bg-white/10" />
                    <Skeleton className="h-3 w-32 bg-white/5" />
                  </div>
                </div>
              ))
            ) : shipments?.length > 0 ? (
              shipments.slice(0, 5).map((shipment: any) => (
                <div key={shipment.id} className="group relative flex items-center justify-between p-5 bg-white/5 rounded-[1.75rem] hover:bg-white/[0.08] transition-all duration-300 border border-white/5 hover:border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-secondary/20 h-11 w-11 rounded-2xl flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                      <Ship className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tight text-white group-hover:text-secondary transition-colors">
                        SHP#{shipment.id.substring(0, 6)}
                      </p>
                      <p className="text-[10px] text-blue-200/50 font-black uppercase tracking-widest mt-0.5">
                        {shipment.country_origin} → {shipment.country_destination || "Global"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-2">
                      {new Date(shipment.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </p>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${shipment.status === "RECEIVED" || shipment.status === "COMPLETED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                        : "bg-secondary/20 text-secondary border border-secondary/20"
                      }`}>
                      {shipment.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <Ship className="h-12 w-12 text-white/10 mx-auto mb-4" />
                <p className="text-sm text-blue-200/30 font-bold italic">No active deployments tracked.</p>
              </div>
            )}
            <Button onClick={() => router.push("/dashboard/shipments")} className="w-full bg-white text-[#1a365d] font-black rounded-2xl hover:bg-white/90 h-14 mt-4 shadow-xl transition-all active:scale-95 group">
              EXPLORE REGISTRY <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
