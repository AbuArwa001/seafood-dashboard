import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const login = async (data: any) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};
