'use client';

import React from 'react';
import { ref, set } from 'firebase/database';
import { database } from '@/lib/firebase/client';
import { useAuth } from '@/context/AuthContext';
import { usePortonData } from '@/hooks/usePortonData';
import { isDeviceOnline, formatTimeAgo } from '@/lib/utils/deviceUtils';
import type { PortonDevice } from '@/lib/types/devices';

function PortonCard({ porton, dni }: { porton: PortonDevice; dni: string }) {
  const online = isDeviceOnline(porton.last_heartbeat, porton.config?.plan, 'porton');

  const triggerPorton = async (portonIndex: 1 | 2) => {
    if (!online) return;
    try {
      // Envía un pulso: establece pulso=1, el hardware lo detecta y lo resetea a 0
      const pulsoRef = ref(database, `dispositivos/${dni}/portones/${porton.id}/porton${portonIndex}/pulso`);
      await set(pulsoRef, 1);
    } catch (e) {
      console.error('Error enviando pulso:', e);
    }
  };

  const getPortonEstadoColor = (estado: string | undefined) => {
    if (!estado) return 'text-neutral-500';
    return estado === 'abierto' ? 'text-red-400' : 'text-green-400';
  };

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between border border-outline-variant/10 shadow-xl overflow-hidden h-[260px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              garage
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-poppins font-semibold text-on-surface text-sm uppercase">
                Portón {porton.id}
              </h2>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                porton.config?.plan === 'plus'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-white/5 text-neutral-400'
              }`}>
                {porton.config?.plan ?? 'free'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-secondary animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-[10px] font-montserrat font-bold uppercase tracking-tight ${
                online ? 'text-secondary' : 'text-red-400'
              }`}>
                {online ? 'EN LÍNEA' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>
        <span className="text-[10px] text-neutral-600" title={`WiFi: ${porton.wifi_rssi} dBm`}>
          {porton.wifi_rssi ?? '--'} dBm
        </span>
      </div>

      {/* Último contacto */}
      <p className="text-[10px] text-neutral-600 -mt-2">
        Último contacto: {formatTimeAgo(porton.last_heartbeat)}
      </p>

      {/* Estado de portones y botones de acción */}
      <div className="flex flex-col gap-2">
        {/* Portón 1 */}
        {porton.porton1 && (
          <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/3 border border-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-neutral-400 text-base">garage_home</span>
              <div>
                <p className="text-[11px] text-neutral-400 font-medium">Principal</p>
                <p className={`text-xs font-bold uppercase ${getPortonEstadoColor(porton.porton1.estado)}`}>
                  {porton.porton1.estado ?? 'Desconocido'}
                </p>
              </div>
            </div>
            <button
              onClick={() => triggerPorton(1)}
              disabled={!online}
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-primary/30"
            >
              ACCIONAR
            </button>
          </div>
        )}

        {/* Portón 2 */}
        {porton.porton2 && (
          <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/3 border border-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-neutral-400 text-base">garage_home</span>
              <div>
                <p className="text-[11px] text-neutral-400 font-medium">Secundario</p>
                <p className={`text-xs font-bold uppercase ${getPortonEstadoColor(porton.porton2.estado)}`}>
                  {porton.porton2.estado ?? 'Desconocido'}
                </p>
              </div>
            </div>
            <button
              onClick={() => triggerPorton(2)}
              disabled={!online}
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-primary/30"
            >
              ACCIONAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function WidgetPortones() {
  const { dbUser } = useAuth();
  const { portones, loading } = usePortonData(dbUser?.dni);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-5 flex items-center justify-center h-32 border border-white/5">
        <div className="flex items-center gap-3 text-neutral-500">
          <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
          <span className="text-sm">Conectando...</span>
        </div>
      </div>
    );
  }

  if (!dbUser?.dni) {
    return (
      <div className="glass-panel rounded-2xl p-5 flex items-center justify-center h-32 border border-white/5">
        <p className="text-neutral-500 text-sm">Sin DNI configurado.</p>
      </div>
    );
  }

  if (portones.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center gap-3 h-32 border border-dashed border-white/10">
        <span className="material-symbols-outlined text-neutral-600 text-3xl">garage</span>
        <p className="text-neutral-500 text-sm text-center">Sin portones registrados</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {portones.map((porton) => (
        <PortonCard key={porton.id} porton={porton} dni={dbUser.dni!} />
      ))}
    </div>
  );
}
