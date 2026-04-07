import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSystemParameters, updateSystemParameter } from "../_services/systemParameters";
import { useAuth } from "@/components/providers/auth-provider";
import { SystemParameter, ParameterCategory } from "@/types/models";

export function useSystemParametersLogic() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ParameterCategory | "all">("all");
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

  const { data: parameters, isLoading, error, refetch } = useQuery<SystemParameter[]>({
    queryKey: ["system-parameters"],
    queryFn: getSystemParameters,
    enabled: isAdmin,
  });

  const updateMutation = useMutation({
    mutationFn: updateSystemParameter,
    onSuccess: (_, variables) => {
      toast.success(`Updated ${variables.key.replace(/_/g, " ")}`);
      setPendingChanges((prev) => {
        const next = { ...prev };
        delete next[variables.key];
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["system-parameters"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update parameter");
    },
  });

  const filteredParameters = parameters?.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.key.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleValueChange = (key: string, value: string) => {
    setPendingChanges((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: string) => {
    const value = pendingChanges[key];
    if (value !== undefined) {
      updateMutation.mutate({ key, value });
    }
  };

  return {
    isAdmin, search, setSearch, selectedCategory, setSelectedCategory,
    pendingChanges, handleValueChange, handleSave,
    parameters, filteredParameters, isLoading, error, refetch, updateMutation
  };
}
