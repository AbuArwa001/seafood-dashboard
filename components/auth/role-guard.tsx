"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="flex h-[70vh] flex-col items-center justify-center p-8 text-center">
            <div className="bg-red-50 p-6 rounded-[2.5rem] mb-6">
                <ShieldCheck className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Security Restriction</h1>
            <p className="text-slate-500 font-semibold mt-2 max-w-md">
                Your administrative profile does not currently have the necessary <span className="text-destructive">clearing protocols</span> for this executive module.
            </p>
            <Button
                onClick={() => router.push("/dashboard")}
                className="mt-8 rounded-2xl bg-slate-900 px-8 h-12 font-black shadow-xl"
            >
                RETURN TO BRIDGE
            </Button>
        </div>
    );
}
