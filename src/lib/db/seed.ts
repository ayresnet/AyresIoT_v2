import pool from "./mysql";

/**
 * Script para autoinyectar al Superadmin (Tú) en la base de datos local
 * para que puedas probar el login de inmediato.
 */
async function seedSuperAdmin() {
  try {
    const superAdmin = {
      firebase_uid: 'cqtoh5iyNHgleyChu4oXNWlq4c23',
      email: 'dcsalg@outlook.com',
      nombre: 'Daniel',
      apellido: 'Salgado',
      dni: '27178661',
      celular: '1162816596',
      role: 'superadmin'
    };

    console.log("Sembrando Superadmin en la BD local...");

    await pool.execute(
      `INSERT INTO users (firebase_uid, email, nombre, apellido, dni, celular, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE firebase_uid = VALUES(firebase_uid), role = VALUES(role)`,
      [
        superAdmin.firebase_uid,
        superAdmin.email,
        superAdmin.nombre,
        superAdmin.apellido,
        superAdmin.dni,
        superAdmin.celular,
        superAdmin.role
      ]
    );

    console.log("¡Superadmin Daniel Salgado inyectado con éxito!");
    process.exit(0);
  } catch (error) {
    console.error("Error al sembrar admin:", error);
    process.exit(1);
  }
}

seedSuperAdmin();
