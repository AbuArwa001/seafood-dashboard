"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Shield,
    Loader2,
    CheckCircle2,
    X,
    Search,
    ShieldCheck,
    Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";
import { Role, Permission } from "@/types/models";
import { Badge } from "@/components/ui/badge";

interface RolePermissionsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    role: Role | null;
}

const MODULE_DISPLAY: Record<string, string> = {
    shipment: "Shipments",
    product: "Products",
    sale: "Sales",
    payment: "Payments",
    supplierpurchase: "Purchases",
    costledger: "Costs",
    logisticsreceipt: "Logistics",
    user: "Users",
    exchangerate: "Exchange Rates",
    currency: "Currencies",
    role: "Roles",
};

export function RolePermissionsDialog({
    isOpen,
    onClose,
    role,
}: RolePermissionsDialogProps) {
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const queryClient = useQueryClient();

    // Initialize selected IDs when role changes
    useMemo(() => {
        if (role) {
            setSelectedIds(role.permissions.map(p => p.id));
        }
    }, [role]);

    // Fetch all permissions
    const { data: allPermissions, isLoading: isLoadingPerms } = useQuery<Permission[]>({
        queryKey: ["all-permissions"],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS);
            return response.data;
        },
        enabled: isOpen,
    });

    // Mutation to update role
    const { mutate: updateRolePermissions, isPending } = useMutation({
        mutationFn: async (permissionIds: number[]) => {
            if (!role) return;
            await apiClient.patch(`${API_ENDPOINTS.ROLES}${role.id}/`, {
                permission_ids: permissionIds,
            });
        },
        onSuccess: () => {
            toast.success("Role permissions updated successfully");
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Failed to update role permissions");
        },
    });

    const togglePermission = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const filteredPermissions = allPermissions?.filter(perm =>
        perm.name.toLowerCase().includes(search.toLowerCase()) ||
        perm.codename.toLowerCase().includes(search.toLowerCase())
    );

    const handleSave = () => {
        updateRolePermissions(selectedIds);
    };

    // Group permissions by module
    const groupedPermissions = useMemo(() => {
        if (!filteredPermissions) return {};
        const groups: Record<string, Permission[]> = {};
        filteredPermissions.forEach(perm => {
            const parts = perm.codename.split("_");
            const model = parts.slice(1).join("_");
            const groupName = MODULE_DISPLAY[model] || model;
            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push(perm);
        });
        return groups;
    }, [filteredPermissions]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-premium rounded-[2rem] bg-white">
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -mt-20 -mr-20" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/10 p-3 rounded-2xl">
                                <ShieldCheck className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                                    Manage <span className="text-indigo-400">Permissions</span>
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 font-medium">
                                    Updating access baseline for <span className="text-white font-bold">{role?.role_name}</span>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Filter system permissions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-11 h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white font-medium text-sm transition-all"
                        />
                    </div>

                    {isLoadingPerms ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Loading Security Protocols...</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {Object.entries(groupedPermissions).map(([group, perms]) => (
                                <div key={group} className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 ml-1">
                                        {group}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {perms.map((perm) => (
                                            <button
                                                key={perm.id}
                                                onClick={() => togglePermission(perm.id)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${selectedIds.includes(perm.id)
                                                        ? "bg-indigo-50 border-indigo-200 shadow-sm"
                                                        : "bg-white border-slate-100 hover:border-slate-200"
                                                    }`}
                                            >
                                                <div className="space-y-0.5">
                                                    <p className={`text-xs font-black uppercase tracking-tight ${selectedIds.includes(perm.id) ? "text-indigo-700" : "text-slate-700"
                                                        }`}>
                                                        {perm.name.split("|").pop()?.trim()}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider opacity-60">
                                                        {perm.codename}
                                                    </p>
                                                </div>
                                                <div className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition-all ${selectedIds.includes(perm.id)
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-slate-100 text-transparent border border-slate-200"
                                                    }`}>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="p-8 border-t border-slate-50 bg-slate-50/30 flex-row gap-3 shrink-0">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-white border border-transparent hover:border-slate-100"
                    >
                        Discard Changes
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="flex-[1.5] h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating Security Policy...
                            </>
                        ) : (
                            "Synchronize Policy"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
