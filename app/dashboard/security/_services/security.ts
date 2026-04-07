import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const changePassword = async (data: any) => {
  const res = await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, data);
  return res.data;
};
