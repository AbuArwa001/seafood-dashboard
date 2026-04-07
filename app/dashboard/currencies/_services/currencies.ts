import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getCurrencies = async (page: number, ordering?: string) => {
  const response = await apiClient.get(API_ENDPOINTS.CURRENCIES, {
    params: { page, ordering },
  });
  return response.data;
};

export const deleteCurrency = async (id: string) => {
  return await apiClient.delete(`${API_ENDPOINTS.CURRENCIES}${id}/`);
};
