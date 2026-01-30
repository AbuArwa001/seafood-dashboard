// User & Auth Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  location: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  role_name: string;
  permissions: Permission[];
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
  amount: string;
  payment_date: string;
  payment_method: string;
  reference_number: string;
  created_at: string;
}
