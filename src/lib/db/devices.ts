import pool from '@/lib/db/mysql';
import type { SQLDevice, DeviceType, DevicePlan } from '@/lib/types/devices';

/** Obtiene todos los dispositivos registrados de un DNI */
export async function getDevicesByDni(dni: string): Promise<SQLDevice[]> {
  const [rows] = await pool.query(
    'SELECT * FROM user_devices WHERE dni = ? ORDER BY device_type, device_alias',
    [dni]
  );
  return rows as SQLDevice[];
}

/** Registra un nuevo dispositivo en SQL */
export async function createDevice(
  dni: string,
  device_type: DeviceType,
  device_alias: string,
  plan: DevicePlan = 'free'
): Promise<void> {
  const cleanAlias = device_alias.trim().toLowerCase();
  await pool.query(
    'INSERT INTO user_devices (dni, device_type, device_alias, plan) VALUES (?, ?, ?, ?)',
    [dni, device_type, cleanAlias, plan]
  );
}

/** Elimina un dispositivo de SQL */
export async function deleteDevice(
  dni: string,
  device_type: DeviceType,
  device_alias: string
): Promise<void> {
  await pool.query(
    'DELETE FROM user_devices WHERE dni = ? AND device_type = ? AND device_alias = ?',
    [dni, device_type, device_alias]
  );
}

/** Verifica si un dispositivo ya existe */
export async function deviceExists(
  dni: string,
  device_type: DeviceType,
  device_alias: string
): Promise<boolean> {
  const [rows]: any = await pool.query(
    'SELECT id FROM user_devices WHERE dni = ? AND device_type = ? AND device_alias = ?',
    [dni, device_type, device_alias]
  );
  return rows.length > 0;
}

import { appendDeviceLog, readDeviceLogs, type DeviceLogEntry } from '@/lib/utils/deviceLogger';

/** Agrega un evento al log del dispositivo (máximo 100 entradas en JSON) */
export async function addDeviceLog(
  dni: string,
  device_type: DeviceType,
  device_alias: string,
  event_type: string,
  data?: Record<string, any>
): Promise<void> {
  await appendDeviceLog(dni, device_type, device_alias, event_type, data);
}

/** Obtiene el historial de logs de un dispositivo desde archivo JSON */
export async function getDeviceLogs(
  dni: string,
  device_type: DeviceType,
  device_alias: string,
  limit = 50
): Promise<DeviceLogEntry[]> {
  return await readDeviceLogs(dni, device_type, device_alias, limit);
}
