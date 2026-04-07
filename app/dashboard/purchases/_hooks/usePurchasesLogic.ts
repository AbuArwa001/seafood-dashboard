import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "../_services/purchases";

export function usePurchasesLogic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleRowClick = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsDetailModalOpen(true);
  };

  const {
    data: purchasesData, isLoading, refetch, isFetching,
  } = useQuery({
    queryKey: ["purchases", searchQuery, page],
    queryFn: () => getPurchases(searchQuery, page),
  });

  const purchases = purchasesData?.results || [];
  const totalCount = purchasesData?.count || 0;
  const hasNext = !!purchasesData?.next;
  const hasPrev = !!purchasesData?.previous;

  const totalKg = purchases?.reduce(
    (acc: number, p: any) => acc + parseFloat(p.kg_purchased || 0), 0
  ) || 0;

  return {
    searchQuery, setSearchQuery,
    isAddModalOpen, setIsAddModalOpen,
    page, setPage,
    selectedPurchase, setSelectedPurchase,
    isDetailModalOpen, setIsDetailModalOpen,
    handleRowClick,
    purchases, totalCount, hasNext, hasPrev, totalKg,
    isLoading, isFetching, refetch
  };
}
