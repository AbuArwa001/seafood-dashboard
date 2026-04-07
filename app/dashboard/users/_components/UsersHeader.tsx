import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserForm } from "@/components/forms/UserForm";

interface UsersHeaderProps {
  isFetching: boolean;
  refetch: () => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  selectedUser: any;
}

export function UsersHeader({
  isFetching, refetch, isAddModalOpen, setIsAddModalOpen,
  isEditModalOpen, setIsEditModalOpen, selectedUser
}: UsersHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
          Team <span className="text-rose-600 italic">Management</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-3 text-lg">
          Administrate operational staff and system{" "}
          <span className="text-rose-500 font-black underline decoration-rose-500/20 decoration-4 underline-offset-4">
            access privileges
          </span>.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}
          className="rounded-2xl border-slate-200 h-12 w-12 hover:bg-slate-50 shadow-sm transition-all flex-none"
        >
          <RefreshCw className={`h-5 w-5 text-slate-600 ${isFetching ? "animate-spin" : ""}`} />
        </Button>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl font-black bg-rose-600 hover:bg-rose-700 h-12 px-6 md:px-8 shadow-xl shadow-rose-600/20 transition-all active:scale-95 flex-1 md:flex-none justify-center whitespace-nowrap">
              <Plus className="h-5 w-5 mr-3" /> ADD USER
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] rounded-lg   border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
            <div className="bg-gradient-to-br from-rose-600 to-rose-700 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
              <DialogTitle className="text-3xl font-black tracking-tight">New Account</DialogTitle>
              <p className="text-rose-100/70 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">Register team member</p>
            </div>
            <div className="p-8">
              <UserForm onSuccess={() => setIsAddModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[650px] rounded-lg   border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
              <DialogTitle className="text-3xl font-black tracking-tight">Edit Account</DialogTitle>
              <p className="text-slate-300 text-[11px] font-black mt-2 uppercase tracking-[0.2em]">Modify team member profile</p>
            </div>
            <div className="p-8">
              {selectedUser && <UserForm user={selectedUser} onSuccess={() => setIsEditModalOpen(false)} />}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
