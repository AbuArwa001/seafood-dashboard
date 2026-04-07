import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getShipments = async () => {
  const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS, {
    params: { page_size: 100 },
  });
  return response.data.results || response.data;
};

export const getProducts = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, {
    params: { page_size: 100 },
  });
  return response.data.results || response.data;
};

export const getSales = async () => {
  const response = await apiClient.get(API_ENDPOINTS.SALES, {
    params: { page_size: 100 },
  });
  return response.data.results || response.data;
};

export const getExchangeRates = async () => {
  const response = await apiClient.get(API_ENDPOINTS.EXCHANGE_RATES, {
    params: {
      page_size: 100,
      to_currency__code: "KES",
      currencies: "USD,TZS,MZN,AED,CNY",
    },
  });
  return response.data.results || response.data;
};

export const getPayments = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PAYMENTS, {
    params: { page_size: 100 },
  });
  return response.data.results || response.data;
};

export const getCurrencies = async () => {
  const response = await apiClient.get(API_ENDPOINTS.CURRENCIES, {
    params: { page_size: 100 },
  });
  return response.data.results || response.data;
};
