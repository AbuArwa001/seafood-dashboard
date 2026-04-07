import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getUsers = async (searchQuery: string, page: number) => {
  const response = await apiClient.get(API_ENDPOINTS.USERS, {
    params: { search: searchQuery, page },
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  await apiClient.delete(`${API_ENDPOINTS.USERS}${id}/`);
};
