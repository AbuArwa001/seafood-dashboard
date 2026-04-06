"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Scale, 
  User, 
  Anchor, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PurchaseDetailDialogProps {
  purchase: any;
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseDetailDialog({ purchase, isOpen, onClose }: PurchaseDetailDialogProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!purchase) return null;

  const images = purchase.image_urls || [];
  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-slate-50">
          <div className="bg-slate-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mt-20 -mr-20" />
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-400/5 mb-3 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                  Procurement Detail
                </Badge>
                <DialogTitle className="text-3xl font-black tracking-tighter">
                  PUR-{purchase.id.substring(0, 8).toUpperCase()}
                </DialogTitle>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center space-x-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="font-bold text-sm text-emerald-500">Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {/* Image Gallery */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                DOCUMENTATION GALLERY
                <span className="ml-2 px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-[9px]">{images.length} IMAGES</span>
              </h3>
              
              {images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
                    <img 
                      src={images[activeImageIndex]} 
                      alt="Primary Receipt" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="text-white h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {images.slice(0, 4).map((url: string, i: number) => (
                      <button 
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImageIndex === i ? 'border-blue-600' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        <img src={url} alt={`Receipt ${i+1}`} className="w-full h-full object-cover" />
                        {i === 3 && images.length > 4 && (
                          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white font-black text-lg">
                            +{images.length - 4}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold italic">No documentation images found for this procurement.</p>
                </div>
              )}
            </section>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Scale className="h-5 w-5 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Volume</p>
                      <p className="text-xl font-black text-slate-900">{purchase.kg_purchased} KG</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Date</p>
                      <p className="text-sm font-bold text-slate-700">{formatDate(purchase.created_at, "MMMM do, yyyy")}</p>
                    </div>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Anchor className="h-5 w-5 text-indigo-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment Origin</p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        SHP-{purchase.shipment?.substring(0, 8).toUpperCase() || "N/A"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{purchase.shipment_details?.country_origin || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recorded By</p>
                      <p className="text-sm font-bold text-slate-700">{purchase.entered_by_details?.full_name || purchase.entered_by_details?.email || "Unknown Agent"}</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
               <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 flex items-center transition-colors">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View Shipment Details
               </button>
               <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                  CLOSE DETAIL
               </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-20"
          >
             <button 
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-10 right-10 text-white p-4 hover:bg-white/10 rounded-full transition-all"
              >
                <Maximize2 className="h-8 w-8 rotate-45" />
              </button>

              <div className="relative w-full max-w-5xl aspect-video">
                <img 
                  src={images[activeImageIndex]} 
                  alt="Receipt Preview" 
                  className="w-full h-full object-contain"
                />

                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-[-60px] top-1/2 -translate-y-1/2 p-6 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all">
                      <ChevronLeft className="h-10 w-10" />
                    </button>
                    <button onClick={nextImage} className="absolute right-[-60px] top-1/2 -translate-y-1/2 p-6 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all">
                      <ChevronRight className="h-10 w-10" />
                    </button>
                  </>
                )}
              </div>
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-3">
                 {images.map((_: any, idx: number) => (
                   <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === activeImageIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`} />
                 ))}
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
