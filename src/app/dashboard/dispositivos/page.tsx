'use client';

import React, { useState } from 'react';
import { ref, set, remove } from 'firebase/database';
import { database } from '@/lib/firebase/client';
import { useAuth } from '@/context/AuthContext';
import { useAlarmaData } from '@/hooks/useAlarmaData';
import { usePortonData } from '@/hooks/usePortonData';
import { isDeviceOnline, formatTimeAgo, getAlarmStateLabel, getWifiQuality } from '@/lib/utils/deviceUtils';
import { ConfirmActionModal } from '@/app/dashboard/_components/ConfirmActionModal';
import { PageHeader } from '@/app/dashboard/_components/PageHeader';
import { DevicePlanBadge } from '@/app/dashboard/_components/DevicePlanBadge';
import type { AlarmDevice, PortonDevice, DeviceType } from '@/lib/types/devices';

// ─── Payload inicial para nuevos dispositivos (mismo que versión v1) ──────────

const INITIAL_ALARM_DATA = (timestamp: number) => ({
  config: {
    firmware_version: '1.2.0',
    firmware_version_ts: timestamp,
    intervalo_envio: 3600000,
    modoPrueba: false,
    notificarTodos: true,
    ota_enable: false,
    plan: 'free',
    reset: false,
    sirenaCustom: { ausente: 3, panico: 2, presente: 2 },
    sirenaMode: 'split',
    tiempoSirena: 15,
    zona1: 'NC', zona2: 'NA', zona3: 'NA', zona4: 'NA',
    bypass_zona1: false, bypass_zona2: false, bypass_zona3: false, bypass_zona4: false,
    zona1_delay_enabled: false, zona1_delay_time: 30,
    interior_zona1: false, interior_zona2: true, interior_zona3: true, interior_zona4: false,
    pgm1: { enabled: false, mode: 'manual', pulse_ms: 1000 },
    pgm2: { enabled: false, mode: 'sirena', pulse_ms: 1000 },
  },
  disparada: false,
  estado: 'desarmada',
  fecha_estado: timestamp,
  last_heartbeat: timestamp,
  sirena_exterior_on: false,
  sirena_interior_on: false,
  wifi_rssi: -65,
  zonas: ['cerrada', 'cerrada', 'cerrada', 'cerrada'],
  tamper: 'cerrada',
});

const INITIAL_PORTON_DATA = (timestamp: number) => ({
  config: {
    firmware_version: '1.3.0',
    firmware_version_ts: timestamp,
    intervalo_envio: 21600000,
    plan: 'free',
    reset: false,
    rssi_delta_dbm: 6,
  },
  last_heartbeat: timestamp,
  porton1: { estado: 'cerrado', pulso: 0 },
  porton2: { estado: 'cerrado', pulso: 0 },
  ultimo_estado: 'offline',
  wifi_rssi: -60,
});

// ─── Componente Tarjeta de Alarma ─────────────────────────────────────────────

function AlarmCard({ alarm, dni, onDelete, canDelete }: {
  alarm: AlarmDevice;
  dni: string;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const online = isDeviceOnline(alarm.last_heartbeat, alarm.config?.plan, 'alarma');
  const stateInfo = getAlarmStateLabel(alarm.estado);
  const wifiQuality = getWifiQuality(alarm.wifi_rssi ?? -90);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-outline-variant/10 flex flex-col justify-between hover:border-outline-variant/30 transition-all shadow-sm h-[260px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            alarm.disparada ? 'bg-red-500/20' : online ? 'bg-secondary/10' : 'bg-white/5'
          }`}>
            <span className={`material-symbols-outlined text-xl ${
              alarm.disparada ? 'text-red-400 animate-pulse' : online ? 'text-secondary' : 'text-neutral-600'
            }`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {alarm.disparada ? 'crisis_alert' : 'shield_with_heart'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-on-surface text-sm uppercase tracking-wide">
                Alarma {alarm.id}
              </h3>
              <DevicePlanBadge plan={alarm.config?.plan} />
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-secondary animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-[10px] font-bold uppercase ${stateInfo.color}`}>
                {online ? stateInfo.label : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant/40 hover:bg-red-500/10 hover:text-red-500 transition-all group"
            title="Eliminar dispositivo"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">delete</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-outline-variant/10">
        <div className="text-center">
          <p className="text-[9px] text-on-surface-variant/60 uppercase tracking-wider mb-0.5">WiFi</p>
          <p className={`text-xs font-bold ${wifiQuality.color}`}>{alarm.wifi_rssi ?? '--'} dBm</p>
          <p className={`text-[9px] ${wifiQuality.color}`}>{wifiQuality.label}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-on-surface-variant/60 uppercase tracking-wider mb-0.5">Firmware</p>
          <p className="text-xs font-bold text-on-surface">{alarm.config?.firmware_version ?? '--'}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-on-surface-variant/60 uppercase tracking-wider mb-0.5">Contacto</p>
          <p className="text-xs font-bold text-on-surface">{formatTimeAgo(alarm.last_heartbeat)}</p>
        </div>
      </div>

      {/* Zonas */}
      {alarm.zonas && (
        <div className="grid grid-cols-4 gap-1">
          {alarm.zonas.slice(0, 4).map((zona, idx) => (
            <div key={idx} className={`text-center py-1.5 rounded-lg text-[9px] font-bold uppercase transition-colors ${
              zona === 'abierta' 
                ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20' 
                : 'bg-surface-container-high text-on-surface-variant/40 border border-outline-variant/5'
            }`}>
              Z{idx + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Componente Tarjeta de Portón ─────────────────────────────────────────────

function PortonCard({ porton, dni, onDelete, canDelete }: {
  porton: PortonDevice;
  dni: string;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const online = isDeviceOnline(porton.last_heartbeat, porton.config?.plan, 'porton');
  const wifiQuality = getWifiQuality(porton.wifi_rssi ?? -90);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-outline-variant/10 flex flex-col justify-between hover:border-outline-variant/30 transition-all shadow-sm h-[260px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            online ? 'bg-primary/10' : 'bg-white/5'
          }`}>
            <span className={`material-symbols-outlined text-xl ${
              online ? 'text-primary' : 'text-neutral-600'
            }`} style={{ fontVariationSettings: "'FILL' 1" }}>garage</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-on-surface text-sm uppercase tracking-wide">
                Portón {porton.id}
              </h3>
              <DevicePlanBadge plan={porton.config?.plan} />
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-secondary animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-[10px] font-bold uppercase ${online ? 'text-secondary' : 'text-red-400'}`}>
                {online ? 'EN LÍNEA' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant/40 hover:bg-red-500/10 hover:text-red-500 transition-all group"
            title="Eliminar dispositivo"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">delete</span>
          </button>
        )}
      </div>

      {/* Portones */}
      <div className="flex gap-2">
        {porton.porton1 && (
          <div className={`flex-1 text-center py-2 rounded-xl border transition-colors ${
            porton.porton1.estado === 'abierto'
              ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
              : 'border-outline-variant/10 bg-surface-container text-on-surface-variant'
          }`}>
            <p className="text-[9px] text-neutral-500 uppercase">P1</p>
            <p className={`text-xs font-bold uppercase ${
              porton.porton1.estado === 'abierto' ? 'text-red-400' : 'text-green-400'
            }`}>{porton.porton1.estado}</p>
          </div>
        )}
        {porton.porton2 && (
          <div className={`flex-1 text-center py-2 rounded-xl border transition-colors ${
            porton.porton2.estado === 'abierto'
              ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
              : 'border-outline-variant/10 bg-surface-container text-on-surface-variant'
          }`}>
            <p className="text-[9px] text-neutral-500 uppercase">P2</p>
            <p className={`text-xs font-bold uppercase ${
              porton.porton2.estado === 'abierto' ? 'text-red-400' : 'text-green-400'
            }`}>{porton.porton2.estado}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5">
        <div className="text-center">
          <p className="text-[9px] text-neutral-600 uppercase tracking-wider mb-0.5">WiFi</p>
          <p className={`text-xs font-bold ${wifiQuality.color}`}>{porton.wifi_rssi ?? '--'} dBm</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-on-surface-variant/60 uppercase tracking-wider mb-0.5">Firmware</p>
          <p className="text-xs font-bold text-on-surface">{porton.config?.firmware_version ?? '--'}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-on-surface-variant/60 uppercase tracking-wider mb-0.5">Contacto</p>
          <p className="text-xs font-bold text-on-surface">{formatTimeAgo(porton.last_heartbeat)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Modal de Agregar Dispositivo ─────────────────────────────────────────────

function AddDeviceModal({ onClose, onAdd, dni }: {
  onClose: () => void;
  onAdd: (type: DeviceType, alias: string) => Promise<void>;
  dni: string;
}) {
  const [deviceType, setDeviceType] = useState<DeviceType>('alarma');
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const cleaned = alias.trim().toLowerCase().replace(/\s+/g, '_');
    if (!cleaned) { setError('Ingresá un alias para el dispositivo'); return; }
    if (!/^[a-z0-9_]+$/.test(cleaned)) { setError('Solo letras, números y guión bajo'); return; }
    setLoading(true);
    setError('');
    try {
      await onAdd(deviceType, cleaned);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-surface dark:bg-surface-container-high border border-outline-variant/10 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-on-surface">Nuevo Dispositivo</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tipo de dispositivo */}
        <div className="mb-5">
          <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-3">
            Tipo de Dispositivo
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDeviceType('alarma')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                deviceType === 'alarma'
                  ? 'border-secondary/50 bg-secondary/10'
                  : 'border-outline-variant/10 hover:border-outline-variant/30 bg-surface-container-high/30'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${
                deviceType === 'alarma' ? 'text-secondary' : 'text-on-surface-variant'
              }`} style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
              <span className={`text-sm font-semibold ${deviceType === 'alarma' ? 'text-secondary' : 'text-on-surface-variant'}`}>
                Alarma
              </span>
            </button>
            <button
              onClick={() => setDeviceType('porton')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                deviceType === 'porton'
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-outline-variant/10 hover:border-outline-variant/30 bg-surface-container-high/30'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${
                deviceType === 'porton' ? 'text-primary' : 'text-on-surface-variant'
              }`} style={{ fontVariationSettings: "'FILL' 1" }}>garage</span>
              <span className={`text-sm font-semibold ${deviceType === 'porton' ? 'text-primary' : 'text-on-surface-variant'}`}>
                Portón
              </span>
            </button>
          </div>
        </div>

        {/* Alias */}
        <div className="mb-5">
          <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2">
            Alias del Dispositivo
          </label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Ej: casa, costa, cochera"
            className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary/50 transition-colors text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <p className="text-[10px] text-on-surface-variant/70 mt-1.5">
            Este alias se usará para identificar el dispositivo en el sistema (solo letras/números).
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !alias.trim()}
          className="w-full py-3 bg-primary rounded-xl text-white font-semibold text-sm hover:bg-primary/80 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
              Creando...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">add_circle</span>
              Crear Dispositivo
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Sección de Vinculación Manual ───────────────────────────────────────────

function LinkDniSection() {
  const { user } = useAuth();
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLink = async () => {
    if (!dni.trim()) { setError('Ingresá tu DNI'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET', // Usaremos el mismo endpoint pero con DNI manual si queremos
        // O mejor crear uno específico de vinculación
      });
      // Para simplificar, le pediremos al usuario que refresque si el auto-sync por email falló
      // Pero si queremos ser proactivos, implementamos la búsqueda por DNI aquí.
      alert('Funcionalidad de vinculación manual en desarrollo. Por ahora el sistema se vincula automáticamente por Email.');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 border border-outline-variant/10 flex flex-col items-center text-center gap-6 max-w-lg mx-auto mt-10">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-3xl text-primary">person_search</span>
      </div>
      <div>
        <h2 className="text-xl font-bold text-on-surface mb-2">Perfil no vinculado</h2>
        <p className="text-on-surface-variant text-sm">
          No encontramos un perfil de SQL vinculado a tu cuenta de Firebase ({user?.email}). 
          Si ya sos cliente de AyresIoT, el sistema debería vincularte automáticamente al refrescar.
        </p>
      </div>

      <div className="w-full space-y-3">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">O vinculá manualmente con tu DNI</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Tu DNI sin puntos"
            className="flex-1 bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-2.5 text-on-surface outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={handleLink}
            disabled={loading || !dni.trim()}
            className="px-6 py-2.5 bg-primary rounded-xl text-on-primary font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            Vincular
          </button>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function DispositivosPage() {
  const { dbUser } = useAuth();
  const { alarms, loading: loadingAlarms } = useAlarmaData(dbUser?.dni);
  const { portones, loading: loadingPortones } = usePortonData(dbUser?.dni);
  const [showModal, setShowModal] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<{type: DeviceType, alias: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canManage = dbUser?.role === 'superadmin' || dbUser?.role === 'admin';
  const loading = loadingAlarms || loadingPortones;

  if (!dbUser) {
    return <LinkDniSection />;
  }

  const handleAddDevice = async (type: DeviceType, alias: string) => {
    if (!dbUser?.dni) throw new Error('Sin DNI configurado');
    const timestamp = Date.now();

    // 1. Escribir en RTDB (el hardware va a leer de aquí)
    const rtdbPath = `dispositivos/${dbUser.dni}/${type === 'alarma' ? 'alarmas' : 'portones'}/${alias}`;
    const initialData = type === 'alarma' ? INITIAL_ALARM_DATA(timestamp) : INITIAL_PORTON_DATA(timestamp);
    await set(ref(database, rtdbPath), initialData);

    // 2. Registrar en SQL
    const res = await fetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni: dbUser.dni, device_type: type, device_alias: alias }),
    });

    if (!res.ok) {
      // Si falla el SQL, revertir RTDB
      await remove(ref(database, rtdbPath));
      const err = await res.json();
      throw new Error(err.error ?? 'Error al registrar en base de datos');
    }
  };

  const confirmDelete = (type: DeviceType, alias: string) => {
    setDeviceToDelete({ type, alias });
  };

  const handleDeleteDevice = async () => {
    if (!dbUser?.dni || !deviceToDelete) return;
    setIsDeleting(true);

    try {
      const { type, alias } = deviceToDelete;
      // 1. Borrar de RTDB
      const rtdbPath = `dispositivos/${dbUser.dni}/${type === 'alarma' ? 'alarmas' : 'portones'}/${alias}`;
      await remove(ref(database, rtdbPath));

      // 2. Borrar de SQL
      await fetch('/api/devices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: dbUser.dni, device_type: type, device_alias: alias }),
      });
      
      setDeviceToDelete(null);
    } catch (e) {
      console.error('Error eliminando dispositivo:', e);
      alert('Error al eliminar el dispositivo');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!dbUser) {
    return <LinkDniSection />;
  }

  return (
    <div className="space-y-6">
      {/* Header Estándar */}
      <PageHeader
        title="Mis Dispositivos"
        subtitle={`${alarms.length + portones.length} dispositivo${alarms.length + portones.length !== 1 ? 's' : ''} registrado${alarms.length + portones.length !== 1 ? 's' : ''}`}
        action={
          canManage ? (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary rounded-xl text-on-primary text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Agregar
            </button>
          ) : undefined
        }
      />

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
          <span>Cargando dispositivos...</span>
        </div>
      )}

      {/* Sin dispositivos */}
      {!loading && alarms.length === 0 && portones.length === 0 && (
        <div className="glass-panel rounded-2xl p-12 flex flex-col items-center gap-4 border border-dashed border-outline-variant/20 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">devices_other</span>
          <div>
            <p className="text-on-surface-variant font-semibold">Sin dispositivos registrados</p>
            <p className="text-on-surface-variant/70 text-sm mt-1">
              {canManage ? 'Hacé click en "Agregar" para configurar tu primer dispositivo.' : 'Contactá a tu administrador para registrar dispositivos.'}
            </p>
          </div>
          {canManage && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              + Agregar primer dispositivo
            </button>
          )}
        </div>
      )}

      {/* Alarmas */}
      {alarms.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
            <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              Alarmas ({alarms.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {alarms.map((alarm) => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                dni={dbUser?.dni ?? ''}
                onDelete={() => confirmDelete('alarma', alarm.id)}
                canDelete={canManage}
              />
            ))}
          </div>
        </div>
      )}

      {/* Portones */}
      {portones.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>garage</span>
            <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              Portones ({portones.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {portones.map((porton) => (
              <PortonCard
                key={porton.id}
                porton={porton}
                dni={dbUser?.dni ?? ''}
                onDelete={() => confirmDelete('porton', porton.id)}
                canDelete={canManage}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && dbUser?.dni && (
        <AddDeviceModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddDevice}
          dni={dbUser.dni}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deviceToDelete && (
        <ConfirmActionModal
          title={`Eliminar ${deviceToDelete.type === 'alarma' ? 'Alarma' : 'Portón'}`}
          message={`¿Estás seguro de que querés eliminar el dispositivo "${deviceToDelete.alias.toUpperCase()}"? Esta acción borrará el historial y los datos temporalmente, no se puede deshacer.`}
          confirmText="Sí, Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteDevice}
          onCancel={() => !isDeleting && setDeviceToDelete(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
