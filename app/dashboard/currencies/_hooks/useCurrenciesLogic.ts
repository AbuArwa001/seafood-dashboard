import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCurrencies, deleteCurrency } from "../_services/currencies";

export function useCurrenciesLogic() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    field: string | null;
    direction: "asc" | "desc" | null;
  }>({ field: "code", direction: "asc" });

  const toggleSort = (field: string) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        if (prev.direction === "asc") return { field, direction: "desc" };
        if (prev.direction === "desc") return { field: null, direction: null };
      }
      return { field, direction: "asc" };
    });
    setPage(1);
  };

  const ordering = sortConfig.field
    ? sortConfig.direction === "desc" ? `-${sortConfig.field}` : sortConfig.field
    : undefined;

  const {
    data: currencyData, isLoading, refetch, isFetching,
  } = useQuery({
    queryKey: ["currencies", page, ordering],
    queryFn: () => getCurrencies(page, ordering),
  });

  const isArray = Array.isArray(currencyData);
  const currencies = isArray ? currencyData : (currencyData?.results || []);
  const totalCount = isArray ? currencyData.length : (currencyData?.count || 0);
  const hasNext = !isArray && !!currencyData?.next;
  const hasPrev = !isArray && !!currencyData?.previous;

  const deleteMutation = useMutation({
    mutationFn: deleteCurrency,
    onSuccess: () => {
      toast.success("Currency deleted");
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Delete failed. This currency might be in use.");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Delete this currency?")) {
      deleteMutation.mutate(id);
    }
  };

  return {
    isAddModalOpen, setIsAddModalOpen,
    editingCurrency, setEditingCurrency,
    page, setPage,
    sortConfig, toggleSort,
    currencies, totalCount, hasNext, hasPrev,
    isLoading, isFetching, refetch, handleDelete
  };
}
