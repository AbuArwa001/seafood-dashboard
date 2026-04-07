import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ship, Activity, Package, Layers } from "lucide-react";
import { ShipmentForm } from "@/components/forms/ShipmentForm";
import { SaleForm } from "@/components/forms/SaleForm";
import { ProductForm } from "@/components/forms/ProductForm";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { motion } from "framer-motion";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";

interface QuickActionsProps {
  user: any;
  isAdmin: boolean;
  canManageCatalog: boolean;
  itemVariants: any;
}

export function QuickActions({ user, isAdmin, canManageCatalog, itemVariants }: QuickActionsProps) {
  return (
    <motion.div variants={itemVariants}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(hasPermission(user, PERMISSIONS.ADD_SHIPMENT) || isAdmin) && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-white p-6 rounded-lg   shadow-premium flex items-center space-x-4 group cursor-pointer hover:bg-primary transition-all duration-500">
                <div className="bg-primary/10 p-4 rounded-lg   group-hover:bg-white/20 transition-colors shrink-0">
                  <Ship className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-white truncate">Log Shipment</p>
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70 line-clamp-1">New seafood cargo</p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-primary p-6 text-white">
                <DialogTitle className="text-2xl font-black flex items-center">
                  <Ship className="mr-3 h-6 w-6" /> Register Shipment
                </DialogTitle>
                <p className="text-primary-foreground/80 text-sm font-bold mt-1 uppercase tracking-widest">Create a new cargo entry</p>
              </div>
              <div className="p-8"><ShipmentForm /></div>
            </DialogContent>
          </Dialog>
        )}

        {(hasPermission(user, PERMISSIONS.ADD_SALE) || isAdmin) && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-white p-6 rounded-lg   shadow-premium flex items-center space-x-4 group cursor-pointer hover:bg-secondary transition-all duration-500">
                <div className="bg-secondary/10 p-4 rounded-lg   group-hover:bg-white/20 transition-colors shrink-0">
                  <Activity className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-white truncate">Record Sale</p>
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70 line-clamp-1">Transaction data</p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-secondary p-6 text-white">
                <DialogTitle className="text-2xl font-black flex items-center">
                  <Activity className="mr-3 h-6 w-6" /> Record Sale
                </DialogTitle>
                <p className="text-white/80 text-sm font-bold mt-1 uppercase tracking-widest">Post-shipment transaction</p>
              </div>
              <div className="p-8"><SaleForm /></div>
            </DialogContent>
          </Dialog>
        )}

        {canManageCatalog && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-white p-6 rounded-lg   shadow-premium flex items-center space-x-4 group cursor-pointer hover:bg-slate-900 transition-all duration-500">
                <div className="bg-slate-100 p-4 rounded-lg   group-hover:bg-white/20 transition-colors shrink-0">
                  <Package className="h-8 w-8 text-slate-900 group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-white truncate">Add Product</p>
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70 line-clamp-1">Extend inventory</p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <DialogTitle className="text-2xl font-black flex items-center">
                  <Package className="mr-3 h-6 w-6" /> Add Product
                </DialogTitle>
                <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">Central catalog entry</p>
              </div>
              <div className="p-8"><ProductForm /></div>
            </DialogContent>
          </Dialog>
        )}

        {canManageCatalog && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-white p-6 rounded-lg   shadow-premium flex items-center space-x-4 group cursor-pointer hover:bg-emerald-600 transition-all duration-500">
                <div className="bg-emerald-50 p-4 rounded-lg   group-hover:bg-white/20 transition-colors shrink-0">
                  <Layers className="h-8 w-8 text-emerald-600 group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-white truncate">Add Category</p>
                  <p className="text-sm text-slate-500 font-bold group-hover:text-white/70 line-clamp-1">Manage taxonomy</p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-emerald-600 p-6 text-white">
                <DialogTitle className="text-2xl font-black flex items-center">
                  <Layers className="mr-3 h-6 w-6" /> Add Category
                </DialogTitle>
                <p className="text-emerald-50 text-sm font-bold mt-1 uppercase tracking-widest">Product classification</p>
              </div>
              <div className="p-8"><CategoryForm /></div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </motion.div>
  );
}
