import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { changePassword } from "../_services/security";
import { parseCodename } from "../_components/SecurityConfig";

export function useSecurityLogic() {
  const { user, roleName } = useAuth();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordMutation = useMutation({
    mutationFn: async () => {
      return await changePassword({
        current_password: currentPw,
        new_password: newPw,
        confirm_password: confirmPw,
      });
    },
    onSuccess: () => {
      toast.success("Password updated successfully.");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || "Failed to update password. Please try again.");
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) return toast.error("Please fill in all password fields.");
    if (newPw !== confirmPw) return toast.error("New passwords do not match.");
    if (newPw.length < 8) return toast.error("New password must be at least 8 characters.");
    passwordMutation.mutate();
  };

  const permissions = user?.role?.permissions ?? [];
  const isAdmin = roleName?.toLowerCase() === "admin";

  const groupedPermissions = permissions.reduce<Record<string, typeof permissions>>((acc, perm) => {
    const { module } = parseCodename(perm.codename);
    if (!acc[module]) acc[module] = [];
    acc[module].push(perm);
    return acc;
  }, {});

  const initials = user?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase() ?? "?";

  return {
    user, roleName, permissions, isAdmin, groupedPermissions, initials,
    currentPw, setCurrentPw, newPw, setNewPw, confirmPw, setConfirmPw,
    showCurrent, setShowCurrent, showNew, setShowNew, showConfirm, setShowConfirm,
    passwordMutation, handlePasswordSubmit
  };
}
