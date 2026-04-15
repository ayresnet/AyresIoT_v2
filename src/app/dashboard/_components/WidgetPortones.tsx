"use client";

import React from "react";

export function WidgetPortones() {
  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col gap-5 border border-white/5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">garage</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-poppins font-semibold text-on-surface text-sm">Portones</h2>
            <span className="text-[10px] font-montserrat font-medium text-on-surface-variant uppercase tracking-widest">Acceso Vehicular</span>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-primary/30"></div>
          <div className="w-1 h-1 rounded-full bg-primary/30"></div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl">
          <div className="flex flex-col">
            <span className="text-xs font-poppins font-medium text-on-surface">Principal</span>
            <span className="text-[9px] font-montserrat font-bold text-error uppercase">Cerrado</span>
          </div>
          <button className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95 cursor-pointer">
            ACCIONAR
          </button>
        </div>
        <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl">
          <div className="flex flex-col">
            <span className="text-xs font-poppins font-medium text-on-surface">Secundario</span>
            <span className="text-[9px] font-montserrat font-bold text-secondary uppercase">Abierto</span>
          </div>
          <button className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95 cursor-pointer">
            ACCIONAR
          </button>
        </div>
      </div>
    </div>
  );
}
