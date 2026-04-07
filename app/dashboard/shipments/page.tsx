"use client";

import { motion } from "framer-motion";
import { useShipmentsLogic } from "./_hooks/useShipmentsLogic";
import { ShipmentsHeader } from "./_components/ShipmentsHeader";
import { ShipmentsAnalytics } from "./_components/ShipmentsAnalytics";
import { ShipmentsTracker } from "./_components/ShipmentsTracker";
import { ShipmentDetailsDialog } from "@/components/shipments/ShipmentDetailsDialog";
import { VesselTrackingDialog } from "@/components/shipments/VesselTrackingDialog";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ShipmentsPage() {
  const logic = useShipmentsLogic();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8">
      <ShipmentsHeader
        isAddModalOpen={logic.isAddModalOpen} setIsAddModalOpen={logic.setIsAddModalOpen}
        isFetching={logic.isFetching} refetch={logic.refetch}
      />

      <ShipmentsAnalytics totalCount={logic.totalCount} shipments={logic.shipments} itemVariants={item} />

      <ShipmentsTracker
        searchQuery={logic.searchQuery} setSearchQuery={logic.setSearchQuery}
        totalCount={logic.totalCount} isLoading={logic.isLoading}
        shipments={logic.shipments} page={logic.page} setPage={logic.setPage}
        hasPrev={logic.hasPrev} hasNext={logic.hasNext}
        setSelectedShipment={logic.setSelectedShipment}
        setIsViewCargoOpen={logic.setIsViewCargoOpen}
        setIsTrackVesselOpen={logic.setIsTrackVesselOpen}
        handleMarkArrived={logic.handleMarkArrived}
        itemVariants={item}
      />

      <ShipmentDetailsDialog
        isOpen={logic.isViewCargoOpen} onClose={() => logic.setIsViewCargoOpen(false)}
        shipment={logic.selectedShipment}
      />

      <VesselTrackingDialog
        isOpen={logic.isTrackVesselOpen} onClose={() => logic.setIsTrackVesselOpen(false)}
        shipment={logic.selectedShipment}
      />
    </motion.div>
  );
}
