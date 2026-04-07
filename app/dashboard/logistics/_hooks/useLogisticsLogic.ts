import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLogistics } from "../_services/logistics";

export function useLogisticsLogic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: logisticsData, isLoading, refetch, isFetching,
  } = useQuery({
    queryKey: ["logistics", searchQuery, page],
    queryFn: () => getLogistics(searchQuery, page),
  });

  const receipts = logisticsData?.results || [];
  const totalCount = logisticsData?.count || 0;
  const hasNext = !!logisticsData?.next;
  const hasPrev = !!logisticsData?.previous;

  const totalNetWeight = receipts?.reduce(
    (acc: number, r: any) => acc + parseFloat(r.net_received_kg || 0), 0
  ) || 0;
  const totalLosses = receipts?.reduce(
    (acc: number, r: any) => acc + parseFloat(r.transport_loss_kg || 0) + parseFloat(r.freezing_loss_kg || 0), 0
  ) || 0;

  return {
    searchQuery, setSearchQuery,
    isAddModalOpen, setIsAddModalOpen,
    page, setPage,
    receipts, totalCount, hasNext, hasPrev,
    totalNetWeight, totalLosses,
    isLoading, isFetching, refetch
  };
}
