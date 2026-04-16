/**
 * Tipos de Dispositivos - AyresIoT v2
 * Los datos de estado en vivo vienen siempre de Firebase RTDB.
 * Los metadatos (plan, registro) se guardan en SQL.
 */

export type AlarmState = 'desarmada' | 'ausente' | 'presente' | 'panico';
export type DevicePlan = 'free' | 'plus';
export type DeviceType = 'alarma' | 'porton';

export interface AlarmConfig {
  plan: DevicePlan;
  plan_end?: number;
  plan_start?: number;
  firmware_version?: string;
  intervalo_envio?: number;
  modoPrueba?: boolean;
  notificarTodos?: boolean;
  ota_enable?: boolean;
  reset?: boolean;
  zona1?: string;
  zona2?: string;
  zona3?: string;
  zona4?: string;
  bypass_zona1?: boolean;
  bypass_zona2?: boolean;
  bypass_zona3?: boolean;
  bypass_zona4?: boolean;
  interior_zona1?: boolean;
  interior_zona2?: boolean;
  interior_zona3?: boolean;
  interior_zona4?: boolean;
  zona1_delay_enabled?: boolean;
  zona1_delay_time?: number;
  sirenaMode?: string;
  tiempoSirena?: number;
  tamperEnabled?: boolean;
  sirenaCustom?: { ausente: number; panico: number; presente: number };
  pgm1?: { enabled: boolean; mode: string; pulse_ms: number };
  pgm2?: { enabled: boolean; mode: string; pulse_ms: number };
}

export interface AlarmDevice {
  id: string;
  estado: AlarmState;
  disparada: boolean;
  fecha_estado: number;
  last_heartbeat: number;
  wifi_rssi: number;
  bateria_voltaje?: number;
  en_red_electrica?: boolean;
  tamper?: string;
  zonas?: string[];
  pgm1_on?: boolean;
  pgm2_on?: boolean;
  pgm_state?: { pgm1: boolean; pgm2: boolean };
  sirena_exterior_on?: boolean;
  sirena_interior_on?: boolean;
  config?: AlarmConfig;
  last_modified_by?: {
    dni: string;
    email: string;
    name: string;
    timestamp: number;
  };
}

export interface PortonDevice {
  id: string;
  last_heartbeat?: number;
  wifi_rssi?: number;
  ultimo_estado?: string;
  porton1?: { estado: string; pulso: number };
  porton2?: { estado: string; pulso: number };
  config?: {
    plan: DevicePlan;
    plan_end?: number;
    plan_start?: number;
    firmware_version?: string;
    intervalo_envio?: number;
    rssi_delta_dbm?: number;
  };
  last_modified_by?: {
    dni: string;
    email: string;
    name: string;
    portonIndex?: number;
    timestamp: number;
  };
}

/** Registro en SQL (tabla user_devices) */
export interface SQLDevice {
  id: number;
  dni: string;
  device_type: DeviceType;
  device_alias: string;
  plan: DevicePlan;
  created_at: string;
}
