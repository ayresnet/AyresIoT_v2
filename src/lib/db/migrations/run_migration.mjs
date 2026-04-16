/**
 * Script de migración para crear las tablas user_devices y device_logs
 * Ejecutar: node src/lib/db/migrations/run_migration.mjs
 */
import { createPool } from 'mysql2/promise';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer .env.local manualmente
const envPath = join(__dirname, '../../../../.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
}


const pool = createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ayresiot_db',
  multipleStatements: true,
});

const sql = `
CREATE TABLE IF NOT EXISTS user_devices (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  dni          VARCHAR(20) NOT NULL,
  device_type  ENUM('alarma', 'porton') NOT NULL,
  device_alias VARCHAR(50) NOT NULL,
  plan         ENUM('free', 'plus') NOT NULL DEFAULT 'free',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_device (dni, device_type, device_alias),
  INDEX idx_dni (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS device_logs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  dni          VARCHAR(20) NOT NULL,
  device_type  ENUM('alarma', 'porton') NOT NULL,
  device_alias VARCHAR(50) NOT NULL,
  event_type   VARCHAR(50) NOT NULL,
  data         JSON,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_device (dni, device_type, device_alias),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

try {
  const conn = await pool.getConnection();
  await conn.query(sql);
  conn.release();
  
  // Verificar
  const [rows] = await pool.query("SHOW TABLES LIKE 'user_devices'");
  const [rows2] = await pool.query("SHOW TABLES LIKE 'device_logs'");
  console.log('✅ Tabla user_devices:', rows.length > 0 ? 'CREADA' : 'ERROR');
  console.log('✅ Tabla device_logs:', rows2.length > 0 ? 'CREADA' : 'ERROR');
  
  await pool.end();
  console.log('\n🎉 Migración completada correctamente');
} catch (err) {
  console.error('❌ Error en migración:', err.message);
  process.exit(1);
}
