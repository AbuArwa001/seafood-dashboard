import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../_services/accessControl";
import { useAuth } from "@/components/providers/auth-provider";
import { Role } from "@/types/models";

export function useAccessControlLogic() {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: roles, isLoading, error, refetch } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: getRoles,
    enabled: isAdmin,
  });

  const filteredRoles = roles?.filter((role) =>
    role.role_name.toLowerCase().includes(search.toLowerCase()),
  );

  return {
    isAdmin, search, setSearch, selectedRole, setSelectedRole,
    isDialogOpen, setIsDialogOpen,
    roles, filteredRoles, isLoading, error, refetch
  };
}
