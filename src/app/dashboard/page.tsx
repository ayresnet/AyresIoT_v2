"use client";

import React from "react";
import { WidgetAlarma } from "./_components/WidgetAlarma";
import { WidgetPortones } from "./_components/WidgetPortones";
import { ActivityRail } from "./_components/ActivityRail";
import { FooterStats } from "./_components/FooterStats";
import { PageHeader } from "./_components/PageHeader";

export default function DashboardPage() {
  return (
    <>
      <PageHeader 
        title="Panel de Control IoT"
        subtitle="Orquestación de ecosistemas inteligentes en tiempo real."
        action={
          <button className="flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity group cursor-pointer shadow-sm border border-outline-variant/10">
            <span className="material-symbols-outlined text-lg">widgets</span>
            <span className="font-label text-sm font-semibold">Gestionar Widgets</span>
          </button>
        }
      />

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
            <span className="text-on-surface-variant group-hover:text-primary transition-colors font-montserrat font-medium text-xs">
              Nuevo Widget
            </span>
          </button>
        </div>

        {/* Right Rail: Activity/Alerts */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          <ActivityRail />
        </div>
      </div>

      <FooterStats />
    </>
  );
}
