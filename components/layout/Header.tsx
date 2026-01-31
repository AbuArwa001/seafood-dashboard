"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, User, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";

export function Header() {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ME);
      return response.data;
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="flex h-20 items-center justify-between glass border-b border-primary/5 px-4 md:px-10 sticky top-0 z-10 mx-6 mt-4 rounded-3xl shadow-premium">
      <div className="flex items-center flex-1 gap-4">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-2xl h-11 w-11"
            >
              <Menu className="h-6 w-6 text-slate-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-none">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="relative w-full max-w-md group group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-all duration-300 group-hover:left-5" />
          <Input
            placeholder="Search shipmens, orders, or products..."
            className="pl-12 bg-slate-100/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 h-11 rounded-2xl transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-100 rounded-2xl h-11 w-11 transition-all duration-300 group"
        >
          <Bell className="h-5 w-5 text-slate-600 group-hover:rotate-12" />
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-primary border-2 border-white animate-pulse" />
        </Button>

        <div className="h-8 w-[1px] bg-slate-200/50 mx-2" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-4 px-3 py-6 hover:bg-slate-100 rounded-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-black text-slate-800 tracking-tight">
                  {user?.full_name || "Loading..."}
                </span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  {user?.role_name || "..."}
                </span>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-2 ring-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-xs font-black">
                  {user?.full_name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72 p-3 rounded-[2rem] shadow-2xl border-primary/5 glass mt-2"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-2">
                <p className="text-base font-black text-slate-900 tracking-tight">
                  {user?.full_name || "Loading..."}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-xs font-bold text-slate-500">
                    {user?.email || "..."}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100/50 mx-2" />
            <DropdownMenuItem className="rounded-2xl p-4 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors group">
              <User className="mr-4 h-5 w-5 text-slate-400 group-focus:text-primary transition-colors" />
              <span className="font-bold text-sm">Personal Registry</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100/50 mx-2" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-2xl p-4 cursor-pointer focus:bg-red-50 focus:text-red-600 text-red-500 transition-colors group"
            >
              <LogOut className="mr-4 h-5 w-5 text-red-400 group-focus:text-red-600 transition-colors" />
              <span className="font-bold text-sm">Secure Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
