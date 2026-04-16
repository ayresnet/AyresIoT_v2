'use client';

import React from 'react';
import { ref, set } from 'firebase/database';
import { database } from '@/lib/firebase/client';
import { useAuth } from '@/context/AuthContext';
import { useAlarmaData } from '@/hooks/useAlarmaData';
import { isDeviceOnline, getAlarmStateLabel, formatTimeAgo } from '@/lib/utils/deviceUtils';
import type { AlarmDevice, AlarmState } from '@/lib/types/devices';

function AlarmCard({ alarm, dni }: { alarm: AlarmDevice; dni: string }) {
  const online = isDeviceOnline(alarm.last_heartbeat, alarm.config?.plan, 'alarma');
  const stateInfo = getAlarmStateLabel(alarm.estado);

  const sendCommand = async (newEstado: AlarmState) => {
    if (!online) return;
    try {
      const estadoRef = ref(database, `dispositivos/${dni}/alarmas/${alarm.id}/estado`);
      await set(estadoRef, newEstado);
      // También actualizar fecha_estado
      const fechaRef = ref(database, `dispositivos/${dni}/alarmas/${alarm.id}/fecha_estado`);
      await set(fechaRef, Date.now());
    } catch (e) {
      console.error('Error enviando comando:', e);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between border border-outline-variant/10 shadow-xl relative overflow-hidden h-[260px]">
      {/* Indicador de alarma disparada */}
      {alarm.disparada && (
        <div className="absolute inset-0 border-2 border-red-500 rounded-2xl animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            alarm.disparada ? 'bg-red-500/20' : 'bg-secondary/10'
          }`}>
            <span className={`material-symbols-outlined text-xl ${
              alarm.disparada ? 'text-red-400 animate-pulse' : 'text-secondary'
            }`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {alarm.disparada ? 'crisis_alert' : 'shield_with_heart'}
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-poppins font-semibold text-on-surface text-sm uppercase">
                Alarma {alarm.id}
              </h2>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                alarm.config?.plan === 'plus'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-white/5 text-neutral-400'
              }`}>
                {alarm.config?.plan ?? 'free'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${
                online ? 'bg-secondary animate-pulse' : 'bg-red-500'
              }`} />
              <span className={`text-[10px] font-montserrat font-bold uppercase tracking-tight ${stateInfo.color}`}>
                {online ? stateInfo.label : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>

        {/* Indicadores de energía */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {alarm.en_red_electrica !== undefined && (
            <span title={alarm.en_red_electrica ? 'Con energía eléctrica' : 'Batería (sin luz)'}>
              <span className={`material-symbols-outlined text-sm ${
                alarm.en_red_electrica ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {alarm.en_red_electrica ? 'bolt' : 'battery_alert'}
              </span>
            </span>
          )}
          <span className="text-[10px]" title={`WiFi: ${alarm.wifi_rssi} dBm`}>
            {alarm.wifi_rssi} dBm
          </span>
        </div>
      </div>

      {/* Última actualización */}
      <p className="text-[10px] text-neutral-600 -mt-2">
        Último contacto: {formatTimeAgo(alarm.last_heartbeat)}
      </p>

      {/* Botones de control */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => sendCommand('desarmada')}
          disabled={!online || alarm.estado === 'desarmada'}
          className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all group active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            alarm.estado === 'desarmada'
              ? 'border-primary/40 bg-primary/10'
              : 'border-white/5 hover:bg-white/5'
          }`}
          title="Desarmar"
        >
          <span className={`material-symbols-outlined text-lg ${
            alarm.estado === 'desarmada' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'
          } transition-colors`}>lock_open</span>
          <span className="text-[9px] font-montserrat font-semibold text-on-surface-variant group-hover:text-on-surface">DESARM</span>
        </button>

        <button
          onClick={() => sendCommand('presente')}
          disabled={!online || alarm.estado === 'presente'}
          className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all group active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            alarm.estado === 'presente'
              ? 'border-blue-500/40 bg-blue-500/10'
              : 'border-white/5 hover:bg-white/5'
          }`}
          title="Armar modo Presente"
        >
          <span className={`material-symbols-outlined text-lg ${
            alarm.estado === 'presente' ? 'text-blue-400' : 'text-on-surface-variant group-hover:text-primary'
          } transition-colors`}>home_pin</span>
          <span className="text-[9px] font-montserrat font-semibold text-on-surface-variant group-hover:text-on-surface">ESTAR</span>
        </button>

        <button
          onClick={() => sendCommand('ausente')}
          disabled={!online || alarm.estado === 'ausente'}
          className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all group active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            alarm.estado === 'ausente'
              ? 'border-secondary/40 bg-secondary/10 shadow-lg shadow-secondary/10'
              : 'border-white/5 hover:bg-white/5'
          }`}
          title="Armar modo Ausente"
        >
          <span className={`material-symbols-outlined text-lg ${
            alarm.estado === 'ausente' ? 'text-secondary' : 'text-on-surface-variant'
          } transition-colors`} style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          <span className={`text-[9px] font-montserrat font-bold ${
            alarm.estado === 'ausente' ? 'text-secondary' : 'text-on-surface-variant'
          }`}>AUSENTE</span>
        </button>

        <button
          onClick={() => sendCommand('panico')}
          disabled={!online}
          className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-error/20 bg-error/5 hover:bg-error/20 transition-all group active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="Activar alerta de pánico"
        >
          <span className="material-symbols-outlined text-error text-lg group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
          <span className="text-[9px] font-montserrat font-bold text-error">PÁNICO</span>
        </button>
      </div>

      {/* Zonas */}
      {alarm.zonas && alarm.zonas.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5">
          {alarm.zonas.slice(0, 4).map((zona, idx) => (
            <div key={idx} className={`text-center py-1 rounded-lg text-[9px] font-bold uppercase ${
              zona === 'abierta' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-neutral-500'
            }`}>
              Z{idx + 1} {zona === 'abierta' ? '🔴' : '●'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function WidgetAlarma() {
  const { dbUser } = useAuth();
  const { alarms, loading } = useAlarmaData(dbUser?.dni);

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
        <p className="text-neutral-500 text-sm text-center">
          Sin DNI configurado. Contacta al administrador.
        </p>
      </div>
    );
  }

  if (alarms.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center gap-3 h-32 border border-dashed border-white/10">
        <span className="material-symbols-outlined text-neutral-600 text-3xl">shield_question</span>
        <p className="text-neutral-500 text-sm text-center">Sin alarmas registradas</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {alarms.map((alarm) => (
        <AlarmCard key={alarm.id} alarm={alarm} dni={dbUser.dni!} />
      ))}
    </div>
  );
}
