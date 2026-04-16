"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { TopNavBar } from "./_components/TopNavBar";
import { SideNavBar } from "./_components/SideNavBar";

export default function DashboardShellLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">
      <TopNavBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex pt-16 min-h-screen relative">
        <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-8 bg-surface-dim transition-all duration-300 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
