import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useResetPasswordLogic } from "../_hooks/useResetPasswordLogic";

export function ResetPasswordForm() {
  const logic = useResetPasswordLogic();

  if (logic.error && !logic.isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{logic.error}</h3>
        <Link href="/forgot-password">
          <Button className="mt-4 bg-[#1a365d] hover:bg-[#2c5282] text-white rounded-lg   h-12 w-full max-w-xs">
            Request new link
          </Button>
        </Link>
      </div>
    );
  }

  if (logic.isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Success!</h3>
        <p className="text-slate-500">
          Your password has been reset successfully. Redirecting you to login...
        </p>
        <Link href="/login">
          <Button className="mt-4 bg-[#1a365d] hover:bg-[#2c5282] text-white rounded-lg   h-12 w-full max-w-xs">
            Go to login now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={logic.handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password" title="New Password" />
        <div className="relative">
          <Input
            id="password" type={logic.showPassword ? "text" : "password"}
            placeholder="New password" value={logic.password}
            onChange={(e) => logic.setPassword(e.target.value)}
            required disabled={logic.isLoading}
            className="bg-slate-50 border-slate-200 focus:border-[#1a365d] focus:ring-[#1a365d] transition-all h-12 rounded-lg   pl-10 pr-12"
          />
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <button
            type="button" onClick={() => logic.setShowPassword(!logic.showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {logic.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" title="Confirm New Password" />
        <div className="relative">
          <Input
            id="confirmPassword" type={logic.showPassword ? "text" : "password"}
            placeholder="Confirm new password" value={logic.confirmPassword}
            onChange={(e) => logic.setConfirmPassword(e.target.value)}
            required disabled={logic.isLoading}
            className="bg-slate-50 border-slate-200 focus:border-[#1a365d] focus:ring-[#1a365d] transition-all h-12 rounded-lg   pl-10"
          />
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        </div>
      </div>

      <Button
        type="submit" disabled={logic.isLoading}
        className="w-full h-12 bg-[#1a365d] hover:bg-[#2c5282] text-white font-bold rounded-lg   shadow-lg transition-all active:scale-[0.98]"
      >
        {logic.isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Updating...
          </span>
        ) : ("Update Password")}
      </Button>
    </form>
  );
}
