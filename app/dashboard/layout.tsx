import { ReactNode } from "react";
import SideNav from "@/components/dashboard/SideNav"; 

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <main className="flex-1 p-6 bg-background">
        {children}
      </main>
    </div>
  );
}
