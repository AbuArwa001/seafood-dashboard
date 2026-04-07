import { useMemo } from "react";
import { DollarSign, Ship, CreditCard, Package } from "lucide-react";

export function useDashboardStats({
  sales, payments, shipments, products, loading, perms, chartData
}: any) {
  const totalRevenue = useMemo(() =>
    sales?.reduce((acc: number, sale: any) =>
      acc + parseFloat(sale.total_sale_amount || 0), 0) || 0,
    [sales]
  );
  const totalPaid = useMemo(() =>
    payments?.reduce((acc: number, payment: any) =>
      acc + parseFloat(payment.amount_paid || 0), 0) || 0,
    [payments]
  );
  const pendingPayments = totalRevenue - totalPaid;

  const stats = useMemo(() => [
    {
      title: "Total Revenue",
      value: loading.sales ? "..." : `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: "+20.1%", trend: "up", icon: DollarSign, color: "text-primary", bgColor: "bg-primary/10",
      data: chartData.salesChartData, hidden: !perms.canViewFinancials,
    },
    {
      title: "Active Shipments",
      value: loading.shipments ? "..." : (shipments?.filter((s: any) => s.status !== "COMPLETED").length || 0).toString(),
      change: "+4", trend: "up", icon: Ship, color: "text-secondary", bgColor: "bg-secondary/10",
      data: chartData.shipmentChartData, hidden: !perms.canViewShipments,
    },
    {
      title: "Pending Payments",
      value: (loading.payments || loading.sales) ? "..." : `$${pendingPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: "-8%", trend: "down", icon: CreditCard, color: "text-amber-500", bgColor: "bg-amber-500/10",
      data: [45, 30, 55, 20, 40, 35, 30], hidden: !perms.canViewPayments,
    },
    {
      title: "Total Products",
      value: loading.products ? "..." : products?.length?.toString() || "0",
      change: "+3", trend: "up", icon: Package, color: "text-indigo-500", bgColor: "bg-indigo-500/10",
      data: [10, 20, 15, 25, 30, 28, 35], hidden: !perms.canViewProducts,
    },
  ].filter((stat) => !stat.hidden), [
    totalRevenue, totalPaid, pendingPayments, loading,
    chartData, perms, shipments, products
  ]);

  return { stats, totalRevenue, totalPaid, pendingPayments };
}
