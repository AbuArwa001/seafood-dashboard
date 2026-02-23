"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Box, Package, Info, MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ShipmentDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: any;
}

export function ShipmentDetailsDialog({
  isOpen,
  onClose,
  shipment,
}: ShipmentDetailsDialogProps) {
  if (!shipment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl border-none shadow-2xl p-0 overflow-hidden bg-white">
        <div className="bg-[#1a365d] p-8 pb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <Badge className="bg-white/10 text-white hover:bg-white/20 border-none mb-4">
                {shipment.status.replace("_", " ")}
              </Badge>
              <DialogTitle className="text-3xl font-black text-white tracking-tight">
                #{shipment.id.substring(0, 8)}
              </DialogTitle>
              <p className="text-blue-200 mt-1 font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Origin: {shipment.country_origin}
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
              <Box className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="-mt-6 px-8 relative z-20">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl">
                <Calendar className="h-5 w-5 text-[#1a365d]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                  Created Date
                </p>
                <p className="font-bold text-slate-900">
                  {formatDate(shipment.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-2 rounded-xl">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                  Currency
                </p>
                <p className="font-bold text-slate-900">
                  {shipment.currency_code || "USD"}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          {(shipment.estimated_transit_days || shipment.actual_arrival_date) && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {shipment.estimated_transit_days && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/60 mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Est. Arrival
                  </p>
                  <p className="font-bold text-sm">
                    {new Date(new Date(shipment.created_at).getTime() + (shipment.estimated_transit_days * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] text-primary-foreground/40 mt-1">({shipment.estimated_transit_days} days transit)</p>
                </div>
              )}
              {shipment.actual_arrival_date && (
                <div className="bg-emerald-500/20 p-4 rounded-xl border border-emerald-500/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Arrived On
                  </p>
                  <p className="font-bold text-sm text-emerald-50">
                    {new Date(shipment.actual_arrival_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-8 pt-6">
          <h4 className="font-black text-slate-900 flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-[#1a365d]" />
            Cargo Manifest
          </h4>

          <ScrollArea className="h-[300px] pr-4">
            {shipment.items && shipment.items.length > 0 ? (
              <div className="space-y-3">
                {shipment.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {item.product_details?.name || "Unknown Product"}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {item.quantity} units
                        </p>
                      </div>
                    </div>
                    {item.price_at_shipping !== undefined && (
                      <div className="text-right">
                        <p className="font-black text-slate-900">
                          {shipment.currency_symbol || "$"}{item.price_at_shipping}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">
                          Value
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2 border-2 border-dashed border-slate-100 rounded-xl">
                <Info className="h-8 w-8 opacity-50" />
                <p className="font-medium text-sm">
                  No items listed in manifest
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
