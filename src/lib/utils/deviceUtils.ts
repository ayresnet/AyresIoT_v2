/**
 * Utilidades para determinar el estado online/offline de dispositivos
 * basado en el último heartbeat y el plan del dispositivo.
 */

import type { DevicePlan, DeviceType } from '@/lib/types/devices';

/**
 * Determina si un dispositivo está online según su último heartbeat y plan.
 * - Alarma PLUS: intervalo 15 min → offline si > 20 min sin contacto
 * - Alarma FREE: intervalo 60 min → offline si > 70 min sin contacto
 * - Portón: intervalo 60-360 min → offline si > 7 horas sin contacto
 */
export function isDeviceOnline(
  lastHeartbeat: number | undefined,
  plan: DevicePlan | undefined,
  type: DeviceType = 'alarma'
): boolean {
  if (!lastHeartbeat) return false;
  const elapsed = Date.now() - lastHeartbeat;

  if (type === 'alarma') {
    const threshold = plan === 'plus'
      ? 20 * 60 * 1000  // 20 minutos para Plan Plus
      : 70 * 60 * 1000; // 70 minutos para Plan Free
    return elapsed < threshold;
  } else {
    // Portones: 7 horas de tolerancia
    return elapsed < 7 * 60 * 60 * 1000;
  }
}

/**
 * Retorna un texto legible de cuánto tiempo pasó desde el último heartbeat.
 */
export function formatTimeAgo(timestamp: number | undefined): string {
  if (!timestamp) return 'Nunca';
  const elapsed = Date.now() - timestamp;
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(elapsed / 3600000);

  if (minutes < 1) return 'hace un momento';
  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours}h ${minutes % 60}min`;
  return `hace ${Math.floor(hours / 24)} días`;
}

/**
 * Retorna etiqueta y color para la calidad de señal WiFi (RSSI)
 */
export function getWifiQuality(rssi: number): { label: string; color: string } {
  if (rssi >= -50) return { label: 'Excelente', color: 'text-green-400' };
  if (rssi >= -65) return { label: 'Buena', color: 'text-green-400' };
  if (rssi >= -75) return { label: 'Regular', color: 'text-yellow-400' };
  if (rssi >= -85) return { label: 'Débil', color: 'text-orange-400' };
  return { label: 'Muy Débil', color: 'text-red-400' };
}

/**
 * Retorna el label legible de un estado de alarma
 */
export function getAlarmStateLabel(estado: string): { label: string; color: string } {
  switch (estado) {
    case 'desarmada': return { label: 'DESARMADA', color: 'text-neutral-400' };
    case 'ausente':   return { label: 'ARMADO · AUSENTE', color: 'text-green-400' };
    case 'presente':  return { label: 'ARMADO · PRESENTE', color: 'text-blue-400' };
    case 'panico':    return { label: '⚠ PÁNICO', color: 'text-red-400' };
    default:          return { label: estado.toUpperCase(), color: 'text-neutral-400' };
  }
}

/**
 * Fecha legible a partir de timestamp Unix (ms)
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
