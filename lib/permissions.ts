import { User, Permission } from "@/types/models";

// Permission Codenames
// These callbacks must match the codenames stored in the backend (Django)
export const PERMISSIONS = {
  // Shipments
  VIEW_SHIPMENT: "view_shipment",
  ADD_SHIPMENT: "add_shipment",
  CHANGE_SHIPMENT: "change_shipment",
  DELETE_SHIPMENT: "delete_shipment",
  
  // Products
  VIEW_PRODUCT: "view_product",
  ADD_PRODUCT: "add_product",
  CHANGE_PRODUCT: "change_product",
  
  // Sales
  VIEW_SALE: "view_sale",
  ADD_SALE: "add_sale",
  
  // Payments
  VIEW_PAYMENT: "view_payment",
  ADD_PAYMENT: "add_payment",
  
  // Supplier Purchases (Mozambique Agent)
  VIEW_SUPPLIERPURCHASE: "view_supplierpurchase",
  ADD_SUPPLIERPURCHASE: "add_supplierpurchase",
  
  // Costs (Logistics Agent)
  VIEW_COSTLEDGER: "view_costledger",
  ADD_COSTLEDGER: "add_costledger",
  
  // Logistics Receipts (Logistics Agent)
  VIEW_LOGISTICSRECEIPT: "view_logisticsreceipt",
  ADD_LOGISTICSRECEIPT: "add_logisticsreceipt",
  
  // Users (Admin)
  VIEW_USER: "view_user",
  ADD_USER: "add_user",
  
  // Financials
  VIEW_EXCHANGERATE: "view_exchangerate",
  VIEW_CURRENCY: "view_currency",
} as const;

export type PermissionCodename = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Checks if a user has a specific permission.
 * 
 * @param user - The user object from the API
 * @param codename - The permission codename to check
 * @returns boolean
 */
export function hasPermission(user: User | null | undefined, codename: PermissionCodename | string): boolean {
  if (!user || !user.role) return false;
  
  // Admin usually has all permissions, but relying on explicit list is safer if backend handles it.
  // However, often Admins are superusers. Let's assume strict permission check from the loaded user object.
  // If the user object from API includes a flat list of permissions in the role:
  
  const permissions = user.role.permissions || [];
  return permissions.some((p: Permission) => p.codename === codename);
}

/**
 * Checks if a user has ANY of the provided permissions.
 */
export function hasAnyPermission(user: User | null | undefined, codenames: (PermissionCodename | string)[]): boolean {
  return codenames.some(codename => hasPermission(user, codename));
}

/**
 * Checks if a user has ALL of the provided permissions.
 */
export function hasAllPermissions(user: User | null | undefined, codenames: (PermissionCodename | string)[]): boolean {
  return codenames.every(codename => hasPermission(user, codename));
}
