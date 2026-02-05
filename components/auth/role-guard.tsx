"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[]; // e.g. ["Admin", "Sales Agent"]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, isLoading, roleName, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login");
            } else if (!isAdmin && roleName && !allowedRoles.includes(roleName)) {
                // Redirect to dashboard if not authorized
                router.push("/dashboard");
            }
        }
    }, [user, isLoading, roleName, isAdmin, allowedRoles, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    // Admin bypass
    if (isAdmin) {
        return <>{children}</>;
    }

    if (roleName && allowedRoles.includes(roleName)) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="text-slate-500">You do not have permission to view this page.</p>
        </div>
    );
}
