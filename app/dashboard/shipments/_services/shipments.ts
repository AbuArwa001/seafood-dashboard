import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getShipments = async (searchQuery: string, page: number) => {
  const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS, {
    params: { search: searchQuery, page },
  });
  return response.data;
};

export const markShipmentArrived = async (id: string) => {
  return await apiClient.patch(`${API_ENDPOINTS.SHIPMENTS}${id}/`, {
    status: "RECEIVED",
    actual_arrival_date: new Date().toISOString().split("T")[0],
  });
};
