import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getCurrencies = async () => {
  const resp = await apiClient.get(API_ENDPOINTS.CURRENCIES, {
    params: { page_size: 100 },
  });
  return resp.data.results || resp.data;
};

export const getRates = async () => {
  const resp = await apiClient.get(API_ENDPOINTS.EXCHANGE_RATES, {
    params: { page_size: 50 },
  });
  return resp.data.results || resp.data;
};

export const getMargins = async () => {
  const resp = await apiClient.get(API_ENDPOINTS.MARGINS);
  return resp.data.results || resp.data;
};

export const deleteCurrency = (id: string) => apiClient.delete(`${API_ENDPOINTS.CURRENCIES}${id}/`);
export const deleteMargin = (id: string) => apiClient.delete(`${API_ENDPOINTS.MARGINS}${id}/`);
