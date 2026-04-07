import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCosts } from "../_services/costs";

export function useCostsLogic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: costsData, isLoading, refetch, isFetching,
  } = useQuery({
    queryKey: ["costs", searchQuery, page],
    queryFn: () => getCosts(searchQuery, page),
  });

  const costs = costsData?.results || [];
  const totalCount = costsData?.count || 0;
  const hasNext = !!costsData?.next;
  const hasPrev = !!costsData?.previous;

  const totalCosts = costs?.reduce(
    (acc: number, c: any) => acc + parseFloat(c.converted_amount || 0), 0
  ) || 0;

  return {
    searchQuery, setSearchQuery,
    isAddModalOpen, setIsAddModalOpen,
    page, setPage,
    costs, totalCount, hasNext, hasPrev, totalCosts,
    isLoading, isFetching, refetch
  };
}
