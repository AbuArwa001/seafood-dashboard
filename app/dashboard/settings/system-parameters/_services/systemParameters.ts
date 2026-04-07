import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getSystemParameters = async () => {
  const response = await apiClient.get(API_ENDPOINTS.SYSTEM_PARAMETERS, {
    params: { page_size: 100 },
  });
  return Array.isArray(response.data) ? response.data : (response.data.results ?? []);
};

export const updateSystemParameter = async ({ key, value }: { key: string; value: string }) => {
  await apiClient.patch(API_ENDPOINTS.SYSTEM_PARAMETER(key), { value });
};
