import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getExchangeRates = async (page: number) => {
  const response = await apiClient.get(API_ENDPOINTS.EXCHANGE_RATES, {
    params: { page },
  });
  return response.data;
};

export const getCurrencies = async () => {
  const response = await apiClient.get(API_ENDPOINTS.CURRENCIES, {
    params: { page_size: 500 },
  });
  return response.data;
};

export const getSpecificRate = async (fromCode: string, toCode: string) => {
  if (!fromCode || !toCode) return null;
  const response = await apiClient.get(API_ENDPOINTS.EXCHANGE_RATES, {
    params: {
      from_currency__code: fromCode,
      to_currency__code: toCode,
    },
  });
  return response.data;
};
