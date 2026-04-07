import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getPayments = async (searchQuery: string) => {
  const response = await apiClient.get(API_ENDPOINTS.PAYMENTS, {
    params: { search: searchQuery },
  });
  return response.data.results || response.data;
};
