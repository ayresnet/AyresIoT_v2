"use client";

import React from "react";

export function ActivityRail() {
  return (
    <section className="glass-panel rounded-2xl p-6 h-full border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-bold text-base text-on-surface">Actividad Reciente</h3>
        <span className="bg-error/20 text-error px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">3 Alertas</span>
      </div>
      
      <div className="space-y-6">
        {/* Event 1 */}
        <div className="flex gap-4 group">
          <div className="mt-1 relative">
            <div className="h-8 w-8 rounded-full bg-error/10 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-lg">notifications_active</span>
            </div>
            <div className="absolute top-8 left-4 w-[1px] h-10 bg-outline-variant/20"></div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold font-poppins text-on-surface">Alarma Disparada</p>
              <span className="text-[10px] font-montserrat text-on-surface-variant">14:23</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Zona 4 - Sensor de movimiento sala principal detectó actividad.</p>
          </div>
        </div>
        
        {/* Event 2 */}
        <div className="flex gap-4 group">
          <div className="mt-1 relative">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">garage</span>
            </div>
            {/* Si quisieras más eventos, podes agregar la línea visual: 
                <div className="absolute top-8 left-4 w-[1px] h-10 bg-outline-variant/20"></div>
            */}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold font-poppins text-on-surface">Portón 2 Abierto</p>
              <span className="text-[10px] font-montserrat text-on-surface-variant">13:45</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Acceso autorizado por usuario: Juan Pérez.</p>
          </div>
        </div>
      </div>
      
      <button className="w-full mt-10 py-2.5 text-[10px] font-bold font-montserrat text-primary hover:bg-primary/5 rounded-xl border border-primary/20 transition-all uppercase tracking-widest cursor-pointer">
        Historial Completo
      </button>
    </section>
  );
}
