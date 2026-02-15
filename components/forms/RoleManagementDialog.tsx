import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";

interface RoleManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function RoleManagementDialog({
  isOpen,
  onClose,
  user,
}: RoleManagementDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    user?.role?.id || "",
  );
  const queryClient = useQueryClient();

  // Fetch available roles
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ROLES);
      return response.data;
    },
    enabled: isOpen,
  });

  const roles = rolesData?.results || [];

  // Update role mutation
  const { mutate: updateRole, isPending } = useMutation({
    mutationFn: async (roleId: string) => {
      await apiClient.patch(`${API_ENDPOINTS.USERS}${user.id}/`, {
        role_id: roleId,
      });
    },
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update user role");
    },
  });

  const handleSave = () => {
    if (selectedRoleId) {
      updateRole(selectedRoleId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl border-none shadow-premium p-0 bg-white">
        <div className="bg-slate-900 p-6 text-white text-center relative overflow-hidden rounded-t-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -mt-10 -mr-10" />
          <DialogHeader>
            <div className="mx-auto bg-white/10 p-4 rounded-2xl mb-4 w-fit">
              <Shield className="h-8 w-8 text-indigo-400" />
            </div>
            <DialogTitle className="text-2xl font-black text-center">
              Manage Access
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center font-medium">
              Update role for{" "}
              <span className="text-white font-bold">{user?.full_name}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
                Select Role
              </label>
              <Select
                onValueChange={setSelectedRoleId}
                defaultValue={user?.role?.id}
                value={selectedRoleId}
              >
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white text-base font-bold">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {isLoadingRoles ? (
                    <div className="p-4 flex justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    </div>
                  ) : (
                    roles.map((role: any) => (
                      <SelectItem
                        key={role.id}
                        value={role.id}
                        className="font-medium focus:bg-indigo-50 text-slate-700 py-3 rounded-lg"
                      >
                        {role.role_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex-col sm:justify-center gap-3 w-full">
            <Button
              onClick={handleSave}
              disabled={
                isPending ||
                !selectedRoleId ||
                selectedRoleId === user?.role?.id
              }
              className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-600/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
              className="w-full rounded-xl text-slate-500 font-bold hover:bg-slate-50"
            >
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
