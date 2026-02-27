"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";
import "@knocklabs/react/dist/index.css";

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
import { LogOut, User, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";

export function Header() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef<HTMLButtonElement>(null);

  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="flex h-20 items-center justify-between bg-white/60 backdrop-blur-2xl border-b border-slate-200/40 px-4 md:px-12 sticky top-6 z-10 mx-8 mt-6 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
      <div className="flex items-center flex-1 gap-6">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-2xl h-12 w-12 hover:bg-slate-100 transition-colors"
            >
              <Menu className="h-6 w-6 text-slate-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-none bg-white/80 backdrop-blur-3xl">
            <Sidebar isMobile />
          </SheetContent>
        </Sheet>

        <div className="relative w-full max-w-lg group hidden md:block">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#1a365d] transition-all duration-300 group-hover:left-6" />
          <Input
            placeholder="Search shipments, logistics, or registry..."
            className="pl-14 bg-slate-100/60 border-none focus-visible:ring-2 focus-visible:ring-[#1a365d]/10 h-12 rounded-[1.5rem] transition-all duration-300 placeholder:text-slate-400 placeholder:font-medium"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Notifications (Knock) */}
        {user && process.env.NEXT_PUBLIC_KNOCK_FEED_ID && (
          <div className="relative">
            <NotificationIconButton
              ref={notifButtonRef}
              onClick={() => setIsVisible(!isVisible)}
            />
            <NotificationFeedPopover
              buttonRef={notifButtonRef}
              isVisible={isVisible}
              onClose={() => setIsVisible(false)}
            />
          </div>
        )}

        <div className="h-10 w-[1px] bg-slate-200/60 mx-1 hidden sm:block" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-4 px-4 py-8 hover:bg-slate-100/80 rounded-[1.75rem] transition-all duration-300 group"
            >
              <div className="flex flex-col items-end hidden lg:flex">
                <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-[#1a365d] transition-colors">
                  {user?.full_name || "Account"}
                </span>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full mt-1">
                  {user?.role_name || "Ready"}
                </span>
              </div>
              <Avatar className="h-11 w-11 border-2 border-white shadow-xl ring-2 ring-blue-100/50 group-hover:ring-blue-200/50 transition-all duration-500">
                <AvatarFallback className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] text-white text-xs font-black">
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
            className="w-80 p-4 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border-slate-200/40 bg-white/95 backdrop-blur-2xl mt-4"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-14 w-14 border-2 border-slate-50 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] text-white text-base font-black">
                      {user?.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">
                      {user?.full_name || "Registry Agent"}
                    </p>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-0.5">
                      {user?.role_name || "Standard User"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <p className="text-xs font-bold text-slate-500">
                      {user?.email || "No email provided"}
                    </p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100/80 mx-2 my-2" />
            <div className="grid grid-cols-1 gap-1">
              <Link href="/dashboard/security" className="block w-full">
                <DropdownMenuItem className="rounded-2xl p-4 cursor-pointer focus:bg-slate-50 focus:text-[#1a365d] transition-all group">
                  <User className="mr-4 h-5 w-5 text-slate-400 group-focus:text-[#1a365d] transition-colors" />
                  <span className="font-bold text-sm">Security &amp; Access</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-2xl p-4 cursor-pointer focus:bg-red-50 focus:text-red-600 text-red-500 transition-all group"
              >
                <LogOut className="mr-4 h-5 w-5 text-red-400 group-focus:text-red-600 transition-colors" />
                <span className="font-bold text-sm text-red-600">Secure Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
