export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/api/token/",
    REFRESH: "/api/token/refresh/",
  },
  
  // Users
  USERS: "/api/v1/users/",
  ME: "/api/v1/users/me/",
  ROLES: "/api/v1/roles/",
  
  // Products
  PRODUCTS: "/api/v1/products/",
  CATEGORIES: "/api/v1/productcategories/",
  UNITS: "/api/v1/unitofmeasures/",
  
  // Shipments
  SHIPMENTS: "/api/v1/shipments/",
  
  // Sales
  SALES: "/api/v1/sales/",
  
  // Payments
  PAYMENTS: "/api/v1/payments/",
  
  // Purchases
  PURCHASES: "/api/v1/supplierpurchases/",
  
  // Costs
  COSTS: "/api/v1/costledgers/",
  
  // Logistics
  LOGISTICS: "/api/v1/logisticsreceipts/",
  
  // Currency
  CURRENCIES: "/api/v1/currencies/",
  EXCHANGE_RATES: "/api/v1/exchange-rates/",
} as const;
