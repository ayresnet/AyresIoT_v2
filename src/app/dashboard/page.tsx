"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Componentes modulares
import { TopNavBar } from "./_components/TopNavBar";
import { SideNavBar } from "./_components/SideNavBar";
import { WidgetAlarma } from "./_components/WidgetAlarma";
import { WidgetPortones } from "./_components/WidgetPortones";
import { ActivityRail } from "./_components/ActivityRail";
import { FooterStats } from "./_components/FooterStats";

export default function DashboardLayout() {
  const { dbUser, loading, user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Redirección si no está logueado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    return null; // Esperando la redirección del useEffect
  }

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary overflow-x-hidden">
      <TopNavBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex pt-16 min-h-screen relative">
        <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-8 bg-surface-dim transition-all duration-300 lg:ml-64`}>
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-on-surface">Panel de Control IoT</h1>
              <p className="text-on-surface-variant mt-2 font-body text-sm md:text-base">Orquestación de ecosistemas inteligentes en tiempo real.</p>
            </div>
            
            <button className="flex items-center gap-2 bg-primary-container text-primary-fixed px-5 py-2.5 rounded-lg hover:bg-on-primary-fixed-variant transition-colors group cursor-pointer">
              <span className="material-symbols-outlined text-lg">widgets</span>
              <span className="font-label text-sm font-semibold">Gestionar Widgets</span>
            </button>
          </header>

          <div className="grid grid-cols-12 gap-8">
            {/* Widgets Grid */}
            <div className="col-span-12 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <WidgetAlarma />
              <WidgetPortones />
              
              {/* Add Widget placeholder */}
              <button className="border border-dashed border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group hover:border-primary/50 transition-all duration-300 min-h-[160px] cursor-pointer">
                <div className="h-10 w-10 rounded-full border border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-on-primary text-sm">add</span>
                </div>
                <span className="text-on-surface-variant group-hover:text-primary transition-colors font-montserrat font-medium text-xs">Nuevo Widget</span>
              </button>
            </div>

            {/* Right Rail: Activity/Alerts */}
            <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
              <ActivityRail />
            </div>
          </div>

          <FooterStats />
        </main>
      </div>
    </div>
  );
}

