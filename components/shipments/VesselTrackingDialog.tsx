"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Ship, Anchor, Radio, Map, Navigation } from "lucide-react";

interface VesselTrackingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: any;
}

export function VesselTrackingDialog({
  isOpen,
  onClose,
  shipment,
}: VesselTrackingDialogProps) {
  if (!shipment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] rounded-xl border-none shadow-2xl p-0 overflow-hidden bg-white">
        <div className="bg-[#1a365d] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
              <Radio className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-black tracking-tight flex items-center gap-2">
                LIVE TRACKING{" "}
                <span className="text-emerald-400 text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                  ONLINE
                </span>
              </h3>
              <p className="text-blue-200 text-xs font-medium uppercase tracking-widest">
                Vessel ID:{" "}
                {shipment.vessel_id || `VS-${shipment.id.substring(0, 6)}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
              Est. Arrival
            </p>
            <p className="text-white font-black text-lg">2 Days 4 Hours</p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-[400px] bg-slate-100 relative group overflow-hidden">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Land Masses (Stylized) */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-slate-200 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-60" />

          {/* Route Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 100 300 Q 250 100 700 200"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="10 5"
              className="animate-[dash_20s_linear_infinite]"
            />
          </svg>

          {/* Current Position */}
          <div className="absolute top-[45%] left-[60%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping" />
              <div className="absolute -inset-8 bg-blue-500/10 rounded-full animate-pulse" />
              <div className="bg-white p-2 rounded-full shadow-lg border-2 border-primary relative z-10">
                <Ship className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">
              Current Location
            </div>
          </div>

          {/* Origin */}
          <div className="absolute bottom-20 left-20">
            <div className="flex flex-col items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-slate-400" />
              <span className="text-[10px] font-black uppercase text-slate-500 bg-white/80 px-2 rounded-md">
                {shipment.country_origin}
              </span>
            </div>
          </div>

          {/* Destination */}
          <div className="absolute top-[180px] right-[80px]">
            <div className="flex flex-col items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <span className="text-[10px] font-black uppercase text-emerald-600 bg-white/80 px-2 rounded-md">
                Destination Port
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-slate-100 max-w-xs">
            <div className="flex items-start gap-3">
              <Navigation className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">
                  Current Coordinates
                </p>
                <p className="font-mono text-sm font-bold text-slate-900">
                  04° 32.5' N, 055° 12.8' E
                </p>
                <p className="text-xs text-slate-400 mt-1">Speed: 14.5 Knots</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
