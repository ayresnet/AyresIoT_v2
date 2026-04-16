/**
 * Script de reparación para la tabla user_devices
 * Elimina la tabla vieja (si existe con estructura incorrecta) y la crea de cero
 * alineada con la v2.0 usando DNI como vínculo.
 */
import { createPool } from 'mysql2/promise';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../../../../.env.local');

// Cargar variables de entorno
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
}

async function run() {
  const pool = createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ayresiot_db',
    multipleStatements: true,
  });

  console.log('🚀 Iniciando reparación de tablas...');

  const sql = `
    DROP TABLE IF EXISTS user_devices;
    
    CREATE TABLE user_devices (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      dni          VARCHAR(20) NOT NULL,
      device_type  ENUM('alarma', 'porton') NOT NULL,
      device_alias VARCHAR(100) NOT NULL,
      plan         ENUM('free', 'plus') NOT NULL DEFAULT 'free',
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_device_per_user (dni, device_type, device_alias),
      INDEX idx_dni (dni)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    
    -- Asegurar que device_logs también exista correctamente
    CREATE TABLE IF NOT EXISTS device_logs (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      dni          VARCHAR(20) NOT NULL,
      device_type  ENUM('alarma', 'porton') NOT NULL,
      device_alias VARCHAR(100) NOT NULL,
      event_type   VARCHAR(50) NOT NULL,
      data         JSON,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_device (dni, device_type, device_alias),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  try {
    await pool.query(sql);
    console.log('✅ Tablas reconstruidas con éxito.');
    await pool.end();
  } catch (error) {
    console.error('❌ Error reparando tablas:', error.message);
    process.exit(1);
  }
}

run();
