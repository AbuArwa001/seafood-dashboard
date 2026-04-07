import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface LoginFormProps {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPassword: boolean; setShowPassword: (v: boolean) => void;
  isLoading: boolean;
  handleLogin: (e: React.FormEvent) => void;
}

export function LoginForm({
  email, setEmail, password, setPassword,
  showPassword, setShowPassword, isLoading, handleLogin
}: LoginFormProps) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-24 z-10">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="mb-12">
          <img src="/logo.png" alt="SeaFood" className="h-12 w-auto object-contain mb-8" />
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h1>
          <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-semibold ml-1">Email Address</Label>
            <Input
              id="email" type="email" placeholder="admin@seafood.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required disabled={isLoading}
              className="bg-slate-50 border-slate-200 focus:border-[#1a365d] focus:ring-[#1a365d] transition-all h-12 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
              <Link href="/forgot-password" className="text-sm font-semibold text-[#1a365d] hover:text-[#2c5282] transition-colors">Forgot password?</Link>
            </div>
            <div className="relative">
              <Input
                id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required disabled={isLoading}
                className="bg-slate-50 border-slate-200 focus:border-[#1a365d] focus:ring-[#1a365d] transition-all h-12 rounded-lg pr-12"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" disabled={isLoading}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-[#1a365d] hover:bg-[#2c5282] text-white font-bold rounded-lg shadow-lg transition-all active:scale-[0.98]" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Authenticating...</span>
            ) : "Sign In"}
          </Button>
        </form>

        <footer className="mt-24 text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SeaFood Logistics. All rights reserved.</p>
        </footer>
      </motion.div>
    </div>
  );
}
