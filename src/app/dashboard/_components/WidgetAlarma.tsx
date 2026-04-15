"use client";

import React from "react";

export function WidgetAlarma() {
  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col gap-5 border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-xl">shield_with_heart</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-poppins font-semibold text-on-surface text-sm">Alarma Casa</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(136,217,130,0.8)]"></div>
              <span className="text-[10px] font-montserrat font-bold text-secondary uppercase tracking-tight">Armado · Ausente</span>
            </div>
          </div>
        </div>
        <button className="text-on-surface-variant/40 hover:text-on-surface transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-sm">settings</span>
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <button className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all group active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-lg">lock_open</span>
          <span className="text-[9px] font-montserrat font-semibold text-on-surface-variant group-hover:text-on-surface">DESARM</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all group active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-lg">home_pin</span>
          <span className="text-[9px] font-montserrat font-semibold text-on-surface-variant group-hover:text-on-surface">ESTAR</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-secondary/30 bg-secondary/10 shadow-lg shadow-secondary/5 transition-all group active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined text-secondary text-lg" style={{fontVariationSettings: "'FILL' 1"}}>shield</span>
          <span className="text-[9px] font-montserrat font-bold text-secondary">AUSENTE</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-error/20 bg-error/5 hover:bg-error/20 transition-all group active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined text-error text-lg group-hover:scale-110 transition-transform" style={{fontVariationSettings: "'FILL' 1"}}>emergency</span>
          <span className="text-[9px] font-montserrat font-bold text-error">PÁNICO</span>
        </button>
      </div>
    </div>
  );
}
