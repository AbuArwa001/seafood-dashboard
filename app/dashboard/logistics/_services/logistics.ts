import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getLogistics = async (searchQuery: string, page: number) => {
  const response = await apiClient.get(API_ENDPOINTS.LOGISTICS, {
    params: { search: searchQuery, page },
  });
  return response.data;
};
