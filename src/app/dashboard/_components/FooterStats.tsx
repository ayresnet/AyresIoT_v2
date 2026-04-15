"use client";

import React from "react";

export function FooterStats() {
  return (
    <footer className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
        <span className="material-symbols-outlined text-primary text-2xl">router</span>
        <div>
          <p className="text-[9px] font-montserrat text-on-surface-variant uppercase font-bold">Nodos Activos</p>
          <p className="text-lg font-poppins font-bold text-on-surface">14 / 15</p>
        </div>
      </div>
      <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
        <span className="material-symbols-outlined text-secondary text-2xl">bolt</span>
        <div>
          <p className="text-[9px] font-montserrat text-on-surface-variant uppercase font-bold">Consumo Hoy</p>
          <p className="text-lg font-poppins font-bold text-on-surface">4.2 kWh</p>
        </div>
      </div>
      <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
        <span className="material-symbols-outlined text-tertiary text-2xl">signal_cellular_alt</span>
        <div>
          <p className="text-[9px] font-montserrat text-on-surface-variant uppercase font-bold">Latencia</p>
          <p className="text-lg font-poppins font-bold text-on-surface">12ms</p>
        </div>
      </div>
      <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
        <span className="material-symbols-outlined text-primary-fixed text-2xl">memory</span>
        <div>
          <p className="text-[9px] font-montserrat text-on-surface-variant uppercase font-bold">Uptime</p>
          <p className="text-lg font-poppins font-bold text-on-surface">99.9%</p>
        </div>
      </div>
    </footer>
  );
}
