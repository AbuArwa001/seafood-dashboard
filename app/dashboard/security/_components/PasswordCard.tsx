import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Lock, Eye, EyeOff, CheckCircle2, XCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface PasswordCardProps {
  currentPw: string; setCurrentPw: (v: string) => void;
  newPw: string; setNewPw: (v: string) => void;
  confirmPw: string; setConfirmPw: (v: string) => void;
  showCurrent: boolean; setShowCurrent: (a: any) => void;
  showNew: boolean; setShowNew: (a: any) => void;
  showConfirm: boolean; setShowConfirm: (a: any) => void;
  passwordMutation: any;
  handlePasswordSubmit: (e: React.FormEvent) => void;
  itemVariants: any;
}

export function PasswordCard({
  currentPw, setCurrentPw, newPw, setNewPw, confirmPw, setConfirmPw,
  showCurrent, setShowCurrent, showNew, setShowNew, showConfirm, setShowConfirm,
  passwordMutation, handlePasswordSubmit, itemVariants
}: PasswordCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="px-8 pt-8 pb-0">
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 p-3 rounded-2xl"><Key className="h-5 w-5 text-rose-500" /></div>
            <div>
              <CardTitle className="text-xl font-black text-slate-900">Change Password</CardTitle>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Keep your account secure</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input
                  type={showCurrent ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Enter current password"
                  className="pl-11 pr-11 h-14 rounded-2xl border-slate-100 bg-slate-50/70 focus:ring-2 focus:ring-indigo-500/10 font-semibold"
                />
                <button type="button" onClick={() => setShowCurrent((v: boolean) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500">New Password</Label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input
                  type={showNew ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="pl-11 pr-11 h-14 rounded-2xl border-slate-100 bg-slate-50/70 focus:ring-2 focus:ring-indigo-500/10 font-semibold"
                />
                <button type="button" onClick={() => setShowNew((v: boolean) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newPw.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < Math.min(Math.floor(newPw.length / 3), 4) ? newPw.length < 8 ? "bg-rose-400" : newPw.length < 12 ? "bg-amber-400" : "bg-emerald-400" : "bg-slate-100"}`} />
                  ))}
                  <span className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    {newPw.length < 8 ? "Weak" : newPw.length < 12 ? "Fair" : "Strong"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Confirm New Password</Label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input
                  type={showConfirm ? "text" : "password"} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repeat new password"
                  className={`pl-11 pr-11 h-14 rounded-2xl border-slate-100 bg-slate-50/70 focus:ring-2 font-semibold transition-all ${confirmPw.length > 0 && newPw !== confirmPw ? "border-rose-200 focus:ring-rose-500/10" : confirmPw.length > 0 && newPw === confirmPw ? "border-emerald-200 focus:ring-emerald-500/10" : "focus:ring-indigo-500/10"}`}
                />
                <button type="button" onClick={() => setShowConfirm((v: boolean) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {confirmPw.length > 0 && (
                  <div className="absolute right-11 top-1/2 -translate-y-1/2">
                    {newPw === confirmPw ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-rose-400" />}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={passwordMutation.isPending} className="w-full h-14 rounded-2xl font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 transition-all active:scale-95 text-sm uppercase tracking-wider">
                {passwordMutation.isPending ? (
                  <span className="flex items-center gap-3"><span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Updating…</span>
                ) : (
                  <span className="flex items-center gap-3"><Shield className="h-4 w-4" /> Update Password</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
