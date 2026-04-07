import { useQuery } from "@tanstack/react-query";
import { useDashboardPermissions } from "./useDashboardPermissions";
import * as dashboardService from "../_services/dashboard";

export function useDashboardQueries() {
  const perms = useDashboardPermissions();

  const shipmentsQuery = useQuery({
    queryKey: ["shipments"],
    queryFn: dashboardService.getShipments,
    enabled: perms.canViewShipments,
  });

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: dashboardService.getProducts,
    enabled: perms.canViewProducts,
  });

  const salesQuery = useQuery({
    queryKey: ["sales"],
    queryFn: dashboardService.getSales,
    enabled: perms.canViewSales,
  });

  const exchangeRatesQuery = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: dashboardService.getExchangeRates,
    enabled: perms.canViewExchangeRates,
  });

  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: dashboardService.getPayments,
    enabled: perms.canViewPayments,
  });

  const currenciesQuery = useQuery({
    queryKey: ["all-currencies"],
    queryFn: dashboardService.getCurrencies,
  });

  return {
    shipmentsQuery,
    productsQuery,
    salesQuery,
    exchangeRatesQuery,
    paymentsQuery,
    currenciesQuery,
  };
}
