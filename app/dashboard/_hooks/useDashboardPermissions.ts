import { useAuth } from "@/components/providers/auth-provider";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";

export function useDashboardPermissions() {
  const { user, isAdmin } = useAuth();

  return {
    user,
    isAdmin,
    canViewFinancials: hasPermission(user, PERMISSIONS.VIEW_SALE) || isAdmin,
    canViewSales: hasPermission(user, PERMISSIONS.VIEW_SALE) || isAdmin,
    canViewShipments: hasPermission(user, PERMISSIONS.VIEW_SHIPMENT) || isAdmin,
    canViewPayments: hasPermission(user, PERMISSIONS.VIEW_PAYMENT),
    canManageCatalog: hasPermission(user, PERMISSIONS.ADD_PRODUCT) || isAdmin,
    canViewExchangeRates: hasPermission(user, PERMISSIONS.VIEW_EXCHANGERATE),
    canViewProducts: hasPermission(user, PERMISSIONS.VIEW_PRODUCT) || isAdmin,
  };
}
