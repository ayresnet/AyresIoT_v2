"use client";

import React, { useState } from "react";
import { DevicePlanBadge } from "@/app/dashboard/_components/DevicePlanBadge";
import { isDeviceOnline, formatTimeAgo } from "@/lib/utils/deviceUtils";
import { useAlarmaData } from "@/hooks/useAlarmaData";
import { usePortonData } from "@/hooks/usePortonData";
import { ref, update } from "firebase/database";
import { database } from "@/lib/firebase/client";
import type { AlarmDevice, PortonDevice } from "@/lib/types/devices";

interface SQLUser {
  id: number;
  firebase_uid: string;
  email: string;
  nombre: string;
  apellido: string;
  dni: string;
  celular: string;
  role: "superadmin" | "admin" | "user";
  admin_dni?: string;
  device_count: number;
  created_at: string;
}

interface UserDetailDrawerProps {
  user: SQLUser;
  onClose: () => void;
}

function UserDetailDrawer({ user, onClose }: UserDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"perfil" | "dispositivos">("perfil");
  const [changingPlan, setChangingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { alarms, loading: loadingAlarms } = useAlarmaData(activeTab === "dispositivos" ? user.dni : undefined);
  const { portones, loading: loadingPortones } = usePortonData(activeTab === "dispositivos" ? user.dni : undefined);
  const loadingDevices = loadingAlarms || loadingPortones;

  const changePlan = async (
    deviceType: "alarmas" | "portones",
    deviceId: string,
    currentPlan: string,
    deviceAlias: string
  ) => {
    const newPlan = currentPlan === "plus" ? "free" : "plus";
    const key = `${deviceType}_${deviceId}`;
    setChangingPlan(key);
    try {
      const plan_end = newPlan === "plus" ? Date.now() + 30 * 24 * 60 * 60 * 1000 : undefined;
      
      const configPath = `dispositivos/${user.dni}/${deviceType}/${deviceId}/config`;
      const updateData: Record<string, any> = { plan: newPlan };
      if (newPlan === "plus" && plan_end) {
        updateData.plan_end = plan_end;
        updateData.plan_start = Date.now();
      } else {
        updateData.plan_end = null;
        updateData.plan_start = null;
      }
      await update(ref(database, configPath), updateData);
      
      setSuccessMessage(`✓ ${deviceAlias} cambiado a ${newPlan.toUpperCase()}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e) {
      console.error("Error cambiando plan:", e);
    } finally {
      setChangingPlan(null);
    }
  };

  const roleLabel = {
    superadmin: { label: "Super Admin", color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300" },
    admin: { label: "Administrador", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" },
    user: { label: "Usuario", color: "bg-surface-container-high text-on-surface-variant" },
  }[user.role];

  return (
    <>
      <div
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface dark:bg-surface-container-high border-l border-outline-variant/10 dark:border-white/10 z-50 flex flex-col shadow-2xl transition-all animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary-container text-sm shrink-0">
              {user.nombre?.[0]}{user.apellido?.[0]}
            </div>
            <div>
              <h2 className="font-bold text-on-surface text-base">
                {user.nombre} {user.apellido}
              </h2>
              <p className="text-xs text-on-surface-variant">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex border-b border-outline-variant/10">
          {(["perfil", "dispositivos"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {successMessage && (
            <div className="bg-secondary/10 text-secondary border border-secondary/20 rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {successMessage}
            </div>
          )}

          {activeTab === "perfil" && (
            <div className="space-y-4">
              <div className="bg-surface-container rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase text-on-surface-variant/60 tracking-widest">Datos Personales</h3>
                {[
                  { icon: "badge", label: "DNI / ID", value: user.dni },
                  { icon: "phone", label: "Celular", value: user.celular || "—" },
                  { icon: "calendar_today", label: "Registrado", value: new Date(user.created_at).toLocaleDateString("es-AR") },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">{icon}</span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-semibold text-on-surface">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-surface-container rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase text-on-surface-variant/60 tracking-widest">Rol y Acceso</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">manage_accounts</span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider">Rol actual</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${roleLabel.color}`}>
                        {roleLabel.label}
                      </span>
                    </div>
                  </div>
                </div>
                {user.admin_dni && (
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">supervisor_account</span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider">Admin vinculado (DNI)</p>
                      <p className="text-sm font-semibold text-on-surface">{user.admin_dni}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-base">router</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider">Dispositivos registrados</p>
                    <p className="text-sm font-semibold text-on-surface">{user.device_count}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "dispositivos" && (
            <div className="space-y-3">
              {loadingDevices ? (
                <div className="flex items-center justify-center gap-3 py-8 text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  <span className="text-sm">Consultando Firebase...</span>
                </div>
              ) : alarms.length === 0 && portones.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl block mb-2">devices_off</span>
                  <p className="text-sm">Sin dispositivos registrados</p>
                </div>
              ) : (
                <>
                  {alarms.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase text-on-surface-variant/60 tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-secondary">shield_with_heart</span>
                        Alarmas ({alarms.length})
                      </h3>
                      {alarms.map((alarm) => {
                        const online = isDeviceOnline(alarm.last_heartbeat, alarm.config?.plan, "alarma");
                        const key = `alarmas_${alarm.id}`;
                        const isPlus = alarm.config?.plan === "plus";
                        return (
                          <div key={alarm.id} className="bg-surface-container rounded-2xl p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${online ? "bg-secondary/10" : "bg-surface-container-high"}`}>
                                <span className={`material-symbols-outlined text-base ${online ? "text-secondary" : "text-on-surface-variant/40"}`} style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-on-surface truncate">Alarma {alarm.id}</p>
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${online ? "bg-secondary animate-pulse" : "bg-red-500"}`} />
                                  <p className="text-[10px] text-on-surface-variant uppercase">{online ? "En línea" : "Offline"}</p>
                                </div>
                                <p className="text-[10px] text-on-surface-variant/60">{formatTimeAgo(alarm.last_heartbeat)}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <DevicePlanBadge plan={alarm.config?.plan} />
                              <button
                                onClick={() => changePlan("alarmas", alarm.id, alarm.config?.plan ?? "free", `Alarma ${alarm.id}`)}
                                disabled={changingPlan === key}
                                className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-lg border transition-all cursor-pointer disabled:opacity-50 ${
                                  isPlus
                                    ? "border-red-400/30 bg-red-400/5 text-red-500 hover:bg-red-400/20"
                                    : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/20"
                                }`}
                              >
                                {changingPlan === key ? (
                                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                ) : isPlus ? "Revocar Plus" : "Activar Plus"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {portones.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase text-on-surface-variant/60 tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-primary">garage</span>
                        Portones ({portones.length})
                      </h3>
                      {portones.map((porton) => {
                        const online = isDeviceOnline(porton.last_heartbeat, porton.config?.plan, "porton");
                        const key = `portones_${porton.id}`;
                        const isPlus = porton.config?.plan === "plus";
                        return (
                          <div key={porton.id} className="bg-surface-container rounded-2xl p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${online ? "bg-primary/10" : "bg-surface-container-high"}`}>
                                <span className={`material-symbols-outlined text-base ${online ? "text-primary" : "text-on-surface-variant/40"}`} style={{ fontVariationSettings: "'FILL' 1" }}>garage</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-on-surface truncate">Portón {porton.id}</p>
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${online ? "bg-secondary animate-pulse" : "bg-red-500"}`} />
                                  <p className="text-[10px] text-on-surface-variant uppercase">{online ? "En línea" : "Offline"}</p>
                                </div>
                                <p className="text-[10px] text-on-surface-variant/60">{formatTimeAgo(porton.last_heartbeat)}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <DevicePlanBadge plan={porton.config?.plan} />
                              <button
                                onClick={() => changePlan("portones", porton.id, porton.config?.plan ?? "free", `Portón ${porton.id}`)}
                                disabled={changingPlan === key}
                                className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-lg border transition-all cursor-pointer disabled:opacity-50 ${
                                  isPlus
                                    ? "border-red-400/30 bg-red-400/5 text-red-500 hover:bg-red-400/20"
                                    : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/20"
                                }`}
                              >
                                {changingPlan === key ? (
                                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                ) : isPlus ? "Revocar Plus" : "Activar Plus"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserDetailDrawer;
