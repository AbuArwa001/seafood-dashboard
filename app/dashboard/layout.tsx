import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import { AppKnockProvider } from "@/components/providers/KnockAppProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppKnockProvider>
          <Header />
          <main className="flex-1 overflow-y-auto bg-accent p-6">{children}</main>
        </AppKnockProvider>
      </div>
    </div>
  );
}
