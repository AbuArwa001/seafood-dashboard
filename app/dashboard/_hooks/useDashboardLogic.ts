import { useState } from "react";
import { useDashboardPermissions } from "./useDashboardPermissions";
import { useDashboardQueries } from "./useDashboardQueries";
import { useDashboardStats } from "./useDashboardStats";
import { useDashboardCharts } from "./useDashboardCharts";
import { useDashboardLogistics } from "./useDashboardLogistics";
import { useDashboardReports } from "./useDashboardReports";

export function useDashboardLogic() {
  const [timeRange, setTimeRange] = useState("12M");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const perms = useDashboardPermissions();
  const queries = useDashboardQueries();

  const shipments = queries.shipmentsQuery.data;
  const products = queries.productsQuery.data;
  const sales = queries.salesQuery.data;
  const exchangeRates = queries.exchangeRatesQuery.data;
  const payments = queries.paymentsQuery.data;
  const allCurrencies = queries.currenciesQuery.data;

  const loading = {
    shipments: queries.shipmentsQuery.isLoading,
    products: queries.productsQuery.isLoading,
    sales: queries.salesQuery.isLoading,
    payments: queries.paymentsQuery.isLoading,
  };

  const chartLogic = useDashboardCharts({ sales, shipments, timeRange });
  
  const statsLogic = useDashboardStats({
    sales, payments, shipments, products, loading, perms, chartData: chartLogic
  });

  const logisticsLogic = useDashboardLogistics({ shipments, exchangeRates });

  const reportsLogic = useDashboardReports({
    user: perms.user,
    allCurrencies,
    shipments,
    sales,
    payments,
    products,
  });

  return {
    timeRange, setTimeRange,
    isAddModalOpen, setIsAddModalOpen,
    perms,
    shipments, products, sales, exchangeRates, payments, loading,
    ...chartLogic,
    ...statsLogic,
    ...logisticsLogic,
    ...reportsLogic,
  };
}
