import fs from 'fs';
import path from 'path';

/**
 * Utilidad para gestionar logs de dispositivos en archivos JSON.
 * Estructura: logs/[DNI]/[tipo]s/[alias]/historial.json
 */

const MAX_LOGS = 100;

export interface DeviceLogEntry {
  timestamp: number;
  event_type: string;
  data?: any;
}

/**
 * Agrega una entrada al log de un dispositivo.
 * Si el archivo supera los MAX_LOGS, elimina los más viejos.
 */
export async function appendDeviceLog(
  dni: string,
  device_type: string,
  device_alias: string,
  event: string,
  data?: any
): Promise<void> {
  try {
    const typePlural = device_type.endsWith('s') ? device_type : `${device_type}s`;
    const logDir = path.join(process.cwd(), 'logs', dni, typePlural, device_alias);
    const logFile = path.join(logDir, 'historial.json');

    // Asegurar que el directorio existe
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    let logs: DeviceLogEntry[] = [];

    // Leer logs existentes
    if (fs.existsSync(logFile)) {
      try {
        const content = fs.readFileSync(logFile, 'utf8');
        logs = JSON.parse(content);
        if (!Array.isArray(logs)) logs = [];
      } catch (e) {
        console.error('Error parsing log file, resetting:', e);
        logs = [];
      }
    }

    // Agregar nueva entrada al inicio (más reciente primero) o al final?
    // El usuario pidió "eliminar los más viejos dejando los más nuevos".
    // Generalmente para un JSON es más fácil manejarlo como array cronológico.
    const newEntry: DeviceLogEntry = {
      timestamp: Date.now(),
      event_type: event,
      data: data || null,
    };

    logs.push(newEntry);

    // Rotación: dejar solo los últimos 100
    if (logs.length > MAX_LOGS) {
      logs = logs.slice(logs.length - MAX_LOGS);
    }

    // Guardar archivo
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing device log file:', error);
  }
}

/**
 * Obtiene los logs de un dispositivo desde su archivo JSON.
 */
export async function readDeviceLogs(
  dni: string,
  device_type: string,
  device_alias: string,
  limit = 100
): Promise<DeviceLogEntry[]> {
  try {
    const typePlural = device_type.endsWith('s') ? device_type : `${device_type}s`;
    const logFile = path.join(process.cwd(), 'logs', dni, typePlural, device_alias, 'historial.json');

    if (!fs.existsSync(logFile)) return [];

    const content = fs.readFileSync(logFile, 'utf8');
    let logs = JSON.parse(content) as DeviceLogEntry[];
    
    if (!Array.isArray(logs)) return [];

    // Retornar los últimos 'limit' elementos, invertidos (más reciente primero)
    return logs.slice(-limit).reverse();
  } catch (error) {
    console.error('Error reading device log file:', error);
    return [];
  }
}
