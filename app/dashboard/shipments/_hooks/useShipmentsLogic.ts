import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getShipments, markShipmentArrived } from "../_services/shipments";

export function useShipmentsLogic() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isViewCargoOpen, setIsViewCargoOpen] = useState(false);
  const [isTrackVesselOpen, setIsTrackVesselOpen] = useState(false);

  const {
    data: shipmentsData, isLoading, refetch, isFetching,
  } = useQuery({
    queryKey: ["shipments", searchQuery, page],
    queryFn: () => getShipments(searchQuery, page),
  });

  const shipments = shipmentsData?.results || [];
  const totalCount = shipmentsData?.count || 0;
  const hasNext = !!shipmentsData?.next;
  const hasPrev = !!shipmentsData?.previous;

  const arriveMutation = useMutation({
    mutationFn: markShipmentArrived,
    onSuccess: () => {
      toast.success("Shipment marked as arrived");
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update shipment");
    },
  });

  const handleMarkArrived = (id: string) => {
    if (confirm("Mark this shipment as arrived?")) {
      arriveMutation.mutate(id);
    }
  };

  return {
    searchQuery, setSearchQuery,
    isAddModalOpen, setIsAddModalOpen,
    page, setPage,
    selectedShipment, setSelectedShipment,
    isViewCargoOpen, setIsViewCargoOpen,
    isTrackVesselOpen, setIsTrackVesselOpen,
    shipments, totalCount, hasNext, hasPrev,
    isLoading, isFetching, refetch, handleMarkArrived
  };
}
