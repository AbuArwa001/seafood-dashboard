import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getProducts = async (searchQuery: string, page: number) => {
  const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, {
    params: { search: searchQuery, page },
  });
  return response.data;
};

export const deleteProduct = async (id: string) => {
  return await apiClient.delete(`${API_ENDPOINTS.PRODUCTS}${id}/`);
};
