-- Migración AyresIoT v2: Tablas de Dispositivos y Logs
-- Ejecutar en Laragon MySQL → ayresiot_db

-- ============================================
-- Tabla: user_devices
-- Registra cada dispositivo vinculado a un usuario DNI
-- ============================================
CREATE TABLE IF NOT EXISTS user_devices (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  dni          VARCHAR(20) NOT NULL COMMENT 'DNI del admin propietario del dispositivo',
  device_type  ENUM('alarma', 'porton') NOT NULL,
  device_alias VARCHAR(50) NOT NULL COMMENT 'Alias del dispositivo ej: casa, costa, cochera',
  plan         ENUM('free', 'plus') NOT NULL DEFAULT 'free',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- No puede haber duplicados: mismo DNI + tipo + alias
  UNIQUE KEY unique_device (dni, device_type, device_alias),
  INDEX idx_dni (dni),
  INDEX idx_type (device_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Registro de dispositivos IoT por usuario';


-- ============================================
-- Tabla: device_logs
-- Historial de eventos por dispositivo (máx 100 por dispositivo)
-- ============================================
CREATE TABLE IF NOT EXISTS device_logs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  dni          VARCHAR(20) NOT NULL,
  device_type  ENUM('alarma', 'porton') NOT NULL,
  device_alias VARCHAR(50) NOT NULL,
  event_type   VARCHAR(50) NOT NULL COMMENT 'ej: armado, disparada, porton_abierto, offline',
  data         JSON COMMENT 'Datos adicionales del evento',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_device (dni, device_type, device_alias),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Historial de eventos IoT (max 100 por dispositivo)';
