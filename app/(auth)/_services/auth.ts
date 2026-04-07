import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const resetPasswordConfirm = async (uid: string, token: string, new_password: string) => {
  return await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
    uid,
    token,
    new_password,
  });
};
