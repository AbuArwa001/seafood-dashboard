import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, RefreshCw } from "lucide-react";

interface NotificationsHeaderProps {
  paramsLoading: boolean;
  refetchParams: () => void;
}

export function NotificationsHeader({ paramsLoading, refetchParams }: NotificationsHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 p-2 rounded-lg  ">
            <Bell className="h-6 w-6 text-amber-600" />
          </div>
          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-amber-600 border-amber-200 bg-amber-50">
            Automated Alerts
          </Badge>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
          Notification <span className="text-amber-500 italic">Settings</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-3 text-lg">
          Configure automated triggers and recipient protocols.
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => refetchParams()} className="rounded-lg   hover:bg-slate-100 text-slate-500">
        <RefreshCw className={`h-5 w-5 ${paramsLoading ? "animate-spin" : ""}`} />
      </Button>
    </header>
  );
}
