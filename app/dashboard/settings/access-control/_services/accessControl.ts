import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getRoles = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ROLES);
  return response.data;
};
