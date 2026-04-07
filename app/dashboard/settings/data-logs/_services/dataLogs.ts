import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getAuditLogs = async (searchQuery: string, actionFilter: string, page: number) => {
  const params: any = { search: searchQuery, page };
  if (actionFilter !== "ALL") params.action = actionFilter;
  const response = await apiClient.get(API_ENDPOINTS.AUDIT.LOGS, { params });
  return response.data;
};
