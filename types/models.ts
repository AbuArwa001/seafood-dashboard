// User & Auth Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  location: string;
  role: Role;
  role_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  role_name: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  codename: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: UnitOfMeasure;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
}

export interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation: string;
}

// Currency Types
export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

export interface ExchangeRate {
  id: string;
  from_currency: Currency;
  to_currency: Currency;
  rate: string;
  rate_date: string;
}

// Shipment Types
export type ShipmentStatus = "CREATED" | "IN_TRANSIT" | "RECEIVED" | "COMPLETED";

export interface Shipment {
  id: string;
  currency: Currency;
  country_origin: string;
  status: ShipmentStatus;
  created_at: string;
  items: ShipmentItem[];
}

export interface ShipmentItem {
  id: string;
  shipment: string;
  product: Product;
  quantity: number;
  price_at_shipping: string;
}

// Sale Types
export interface Sale {
  id: string;
  shipment: Shipment;
  entered_by: User;
  currency: Currency;
  kg_sold: string;
  quantity_sold: string;
  selling_price: string;
  exchange_rate_used: string | null;
  converted_amount: string;
  total_sale_amount: string;
  created_at: string;
}

// Payment Types
export interface Payment {
  id: string;
  sale: Sale;
  entered_by: User;
  currency: Currency;
  buyer_name: string;
  amount_paid: string;
  expected_payment_date: string;
  actual_payment_date: string | null;
  created_at: string;
}

// Supplier Purchase Types
export interface SupplierPurchase {
  id: string;
  shipment: Shipment;
  currency: Currency;
  entered_by: User;
  kg_purchased: string;
  image_url: string | null;
  created_at: string;
}

// Cost Ledger Types
export type CostCategory =
  | "Transport"
  | "Freezing"
  | "Cold Storage"
  | "Packing Materials"
  | "Labor"
  | "Commissions"
  | "Export Fees"
  | "Fuel"
  | "Accommodation"
  | "Meals"
  | "Miscellaneous";

export interface CostLedger {
  id: string;
  shipment: Shipment;
  entered_by: User;
  cost_category: CostCategory;
  amount: string;
  other_category: string | null;
  currency: Currency;
  exchange_rate_used: string | null;
  converted_amount: string;
  created_at: string;
}

// Logistics Receipt Types
export interface LogisticsReceipt {
  id: string;
  shipment: Shipment;
  entered_by: User;
  net_received_kg: string;
  transport_loss_kg: string;
  freezing_loss_kg: string;
  facility_location: string;
  notes: string;
  created_at: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}
