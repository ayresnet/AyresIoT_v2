import pool from "./mysql";
import { RowDataPacket } from "mysql2";

export interface SQLUser {
  id: number;
  firebase_uid: string;
  email: string;
  nombre: string;
  apellido: string;
  dni: string;
  celular: string;
  role: 'superadmin' | 'admin' | 'user';
  admin_dni?: string;
  custom_user_limit?: number;
  force_password_change: boolean;
}

/**
 * Obtiene los detalles de un usuario desde la base de datos SQL
 * usando su UID de Firebase como identificador único.
 */
export async function getUserByFirebaseUID(uid: string): Promise<SQLUser | null> {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE firebase_uid = ? LIMIT 1',
      [uid]
    );

    if (rows.length === 0) return null;
    return rows[0] as SQLUser;
  } catch (error) {
    console.error("Error al obtener usuario de SQL:", error);
    throw error;
  }
}

/**
 * Crea o vincula un usuario de Firebase en nuestra base de datos SQL local.
 * Esto es útil para el primer registro.
 */
export async function syncUserToSQL(userData: Partial<SQLUser>) {
  try {
    // Primero verificamos si ya existe el DNI o el Email
    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? OR dni = ? LIMIT 1',
      [userData.email, userData.dni]
    );

    if (existing.length > 0) {
      // Actualizamos el Firebase UID si ya existía por DNI o Email (Vinculación)
      await pool.execute(
        'UPDATE users SET firebase_uid = ? WHERE id = ?',
        [userData.firebase_uid, existing[0].id]
      );
      return existing[0].id;
    }

    // Si no existe, lo insertamos nuevo (Caso de registro manual o primer admin)
    const [result] = await pool.execute(
      `INSERT INTO users (firebase_uid, email, nombre, apellido, dni, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userData.firebase_uid, 
        userData.email, 
        userData.nombre || '', 
        userData.apellido || '', 
        userData.dni || '', 
        userData.role || 'user'
      ]
    );

    return (result as any).insertId;
  } catch (error) {
    console.error("Error al sincronizar usuario con SQL:", error);
    throw error;
  }
}
