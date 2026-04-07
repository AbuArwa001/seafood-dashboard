import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCardProps {
  user: any;
  roleName: string | null | undefined;
  initials: string;
  itemVariants: any;
}

export function ProfileCard({ user, roleName, initials, itemVariants }: ProfileCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] bg-white rounded-[2rem] overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
        </div>
        <CardContent className="px-7 pb-7 -mt-8 relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-600/30 text-white text-xl font-black mb-5 border-4 border-white">
            {initials}
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{user?.full_name ?? "—"}</p>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">{roleName ?? "Standard User"}</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="bg-slate-50 h-8 w-8 rounded-lg flex items-center justify-center flex-none"><Mail className="h-4 w-4 text-slate-400" /></div>
              <span className="font-semibold truncate">{user?.email ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="bg-slate-50 h-8 w-8 rounded-lg flex items-center justify-center flex-none"><MapPin className="h-4 w-4 text-slate-400" /></div>
              <span className="font-semibold">{user?.location ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="bg-slate-50 h-8 w-8 rounded-lg flex items-center justify-center flex-none"><Fingerprint className="h-4 w-4 text-slate-400" /></div>
              {user?.is_active ? (
                <Badge className="bg-emerald-500 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider hover:bg-emerald-600">Active Account</Badge>
              ) : (
                <Badge className="bg-slate-200 text-slate-500 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Inactive</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
