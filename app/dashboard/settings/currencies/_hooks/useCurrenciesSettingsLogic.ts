import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCurrencies, getRates, getMargins, deleteCurrency, deleteMargin
} from "../_services/currenciesSettings";

export function useCurrenciesSettingsLogic() {
  const [activeTab, setActiveTab] = useState("currencies");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: currencies, isLoading: loadingCurrencies } = useQuery({
    queryKey: ["currencies"], queryFn: getCurrencies,
  });

  const { data: rates, isLoading: loadingRates } = useQuery({
    queryKey: ["exchange-rates"], queryFn: getRates,
  });

  const { data: margins, isLoading: loadingMargins } = useQuery({
    queryKey: ["currency-margins"], queryFn: getMargins,
  });

  const deleteCurrencyMutation = useMutation({
    mutationFn: deleteCurrency,
    onSuccess: () => {
      toast.success("Currency removed from registry");
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
  });

  const deleteMarginMutation = useMutation({
    mutationFn: deleteMargin,
    onSuccess: () => {
      toast.success("Margin rule deleted");
      queryClient.invalidateQueries({ queryKey: ["currency-margins"] });
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsAddModalOpen(open);
    if (!open) setEditingItem(null);
  };

  const handleEdit = (data: any) => {
    setEditingItem(data);
    setIsAddModalOpen(true);
  };

  return {
    activeTab, setActiveTab,
    isAddModalOpen, handleOpenChange,
    editingItem, handleEdit,
    currencies, loadingCurrencies, deleteCurrencyMutation,
    rates, loadingRates,
    margins, loadingMargins, deleteMarginMutation
  };
}
