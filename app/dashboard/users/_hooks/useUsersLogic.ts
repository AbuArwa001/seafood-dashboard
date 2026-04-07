import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUsers, deleteUser } from "../_services/users";

export function useUsersLogic() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: userData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["users", searchQuery, page],
    queryFn: () => getUsers(searchQuery, page),
  });

  const isArray = Array.isArray(userData);
  const users = isArray ? userData : userData?.results || [];
  const totalCount = isArray ? userData.length : userData?.count || 0;
  const hasNext = !isArray && !!userData?.next;
  const hasPrev = !isArray && !!userData?.previous;

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete user");
    },
  });

  return {
    page, setPage, searchQuery, setSearchQuery, isAddModalOpen, setIsAddModalOpen,
    selectedUser, setSelectedUser, isEditModalOpen, setIsEditModalOpen,
    users, totalCount, hasNext, hasPrev, isLoading, isFetching, refetch, deleteMutation
  };
}
