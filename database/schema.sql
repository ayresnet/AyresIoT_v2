-- ==========================================================
-- AYRESIOT V2.0 - ESQUEMA DE BASE DE DATOS (MYSQL)
-- Diseñado para alta concurrencia y escalabilidad a millones de usuarios 
-- ==========================================================

CREATE DATABASE IF NOT EXISTS ayresiot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ayresiot_db;

-- -----------------------------------------------------
-- 1. Tabla: `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `firebase_uid` VARCHAR(128) UNIQUE DEFAULT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `nombre` VARCHAR(100),
  `apellido` VARCHAR(100),
  `dni` VARCHAR(20) UNIQUE NOT NULL,
  `celular` VARCHAR(20),
  
  -- Jerarquía y Roles
  `role` ENUM('superadmin', 'admin', 'user') DEFAULT 'user',
  `admin_dni` VARCHAR(20) DEFAULT NULL,
  `custom_user_limit` INT DEFAULT NULL,
  `force_password_change` BOOLEAN DEFAULT FALSE,
  
  -- FCM Tokens (Push Notifications)
  `fcm_token_web` VARCHAR(255) DEFAULT NULL,
  `fcm_token_mobile` VARCHAR(255) DEFAULT NULL,
  
  -- Índices para búsqueda rápida (Clave para escalar a millones)
  INDEX `idx_admin_dni` (`admin_dni`),
  INDEX `idx_role` (`role`),
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- 2. Tabla: `user_devices`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_devices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `device_id` VARCHAR(100) NOT NULL,
  `device_type` ENUM('alarma', 'porton') NOT NULL,
  
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Integridad Referencial
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  
  -- Protege duplicados y optimiza la búsqueda
  UNIQUE KEY `idx_user_device_unique` (`user_id`, `device_id`),
  INDEX `idx_device_id` (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
