import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { getNotificationParameters, getRoles, updateSystemParameter } from "../_services/notificationsSettings";
import { SystemParameter, Role } from "@/types/models";

export function useNotificationsSettingsLogic() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

  const { data: parameters, isLoading: paramsLoading, refetch: refetchParams } = useQuery<SystemParameter[]>({
    queryKey: ["system-parameters", "notifications"],
    queryFn: getNotificationParameters,
    enabled: isAdmin,
  });

  const { data: roles, isLoading: rolesLoading } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: getRoles,
    enabled: isAdmin,
  });

  const updateMutation = useMutation({
    mutationFn: updateSystemParameter,
    onSuccess: (_, variables) => {
      toast.success(`Setting finalized`);
      setPendingChanges((prev) => {
        const next = { ...prev };
        delete next[variables.key];
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["system-parameters"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update configuration");
    },
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

  const toggleRole = (currentValue: string, roleName: string) => {
    let selectedRoles: string[] = [];
    try { selectedRoles = JSON.parse(currentValue); } catch (e) { selectedRoles = []; }
    if (selectedRoles.includes(roleName)) {
      selectedRoles = selectedRoles.filter((r) => r !== roleName);
    } else {
      selectedRoles.push(roleName);
    }
    return JSON.stringify(selectedRoles);
  };

  return {
    isAdmin, pendingChanges, parameters, paramsLoading, refetchParams,
    roles, rolesLoading, updateMutation, handleValueChange, handleSave, toggleRole
  };
}
