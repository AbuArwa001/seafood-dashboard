import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSales } from "../_services/sales";

export function useSalesLogic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: salesData, isLoading, refetch, isFetching,
  } = useQuery({
    queryKey: ["sales", searchQuery, page],
    queryFn: () => getSales(searchQuery, page),
  });

  const sales = salesData?.results || [];
  const totalCount = salesData?.count || 0;
  const hasNext = !!salesData?.next;
  const hasPrev = !!salesData?.previous;

  const totalSalesVolume = salesData?.results?.reduce(
    (acc: number, s: any) => acc + parseFloat(s.total_sale_amount || 0), 0
  ) || 0;

  return {
    searchQuery, setSearchQuery,
    isAddModalOpen, setIsAddModalOpen,
    page, setPage,
    sales, totalCount, hasNext, hasPrev, totalSalesVolume,
    isLoading, isFetching, refetch
  };
}
