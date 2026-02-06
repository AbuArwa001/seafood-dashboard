"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { User, Role } from "@/types/models";
import { toast } from "sonner";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => void;
    isAdmin: boolean;
    isAgent: boolean;
    roleName: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    logout: () => { },
    isAdmin: false,
    isAgent: false,
    roleName: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("access_token");

            // If we're on the login page, we can skip fetching user unless we want to redirect logged-in users
            if (!token) {
                setIsLoading(false);
                if (pathname !== "/login" && pathname !== "/") {
                    // Optional: Redirect to login if sensitive route
                    // router.push("/login");
                }
                return;
            }

            try {
                const response = await apiClient.get(API_ENDPOINTS.ME);
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                // If 401, endpoint might have handled it, but let's be safe
                // localStorage.removeItem("access_token"); // Handled by interceptor usually
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [pathname]);

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/login");
    };

    // Helper flags
    const roleName = user?.role?.role_name || user?.role_name || null;
    const isAdmin = roleName?.toLowerCase() === "admin";
    // Agent roles checking - kept for backward compat if needed, but prefer permissions
    const isAgent = [
        "Mozambique Agent",
        "Logistics Agent",
        "Sales Agent",
        "Finance Agent"
    ].some(role => role.toLowerCase() === roleName?.toLowerCase());

    const value = {
        user,
        isLoading,
        logout,
        isAdmin,
        isAgent,
        roleName,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
