const MODULE_MAP: Record<string, string> = {
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

const ACTION_LABEL: Record<string, string> = {
  view: "View",
  add: "Create",
  change: "Edit",
  delete: "Delete",
};

const ACTION_COLOR: Record<string, string> = {
  view: "bg-blue-50 text-blue-600 border-blue-100",
  add: "bg-emerald-50 text-emerald-600 border-emerald-100",
  change: "bg-amber-50 text-amber-600 border-amber-100",
  delete: "bg-rose-50 text-rose-600 border-rose-100",
};

export function parseCodename(codename: string) {
  const parts = codename.split("_");
  const action = parts[0];
  const model = parts.slice(1).join("_");
  return {
    action,
    actionLabel: ACTION_LABEL[action] ?? action,
    module: MODULE_MAP[model] ?? model,
    colorClass: ACTION_COLOR[action] ?? "bg-slate-50 text-slate-600 border-slate-100",
  };
}
