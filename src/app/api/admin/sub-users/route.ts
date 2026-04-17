import { NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { RowDataPacket, ResultSetHeader } from "mysql2";

/**
 * GET /api/admin/sub-users
 * Obtiene los usuarios vinculados al administrador logueado.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminDni = searchParams.get("admin_dni");

    if (!adminDni) {
      return NextResponse.json({ error: "Se requiere el DNI del administrador" }, { status: 400 });
    }

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, email, nombre, apellido, dni, celular, role, created_at 
       FROM users 
       WHERE admin_dni = ? AND role = 'user'
       ORDER BY created_at DESC`,
      [adminDni]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("API Get Sub-users Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/sub-users
 * Crea un pre-registro de usuario en SQL para que luego se vincule al registrarse en la web.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, apellido, dni, celular, admin_dni } = body;

    if (!nombre || !dni || !admin_dni) {
      return NextResponse.json({ error: "Faltan datos obligatorios (Nombre, DNI o Admin DNI)" }, { status: 400 });
    }

    // Verificar si el DNI ya existe
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE dni = ?",
      [dni]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "Este DNI ya está registrado en el sistema" }, { status: 400 });
    }

    // Insertar el pre-registro
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO users (nombre, apellido, dni, celular, role, admin_dni) 
       VALUES (?, ?, ?, ?, 'user', ?)`,
      [nombre, apellido || '', dni, celular || '', admin_dni]
    );

    return NextResponse.json({ success: true, userId: result.insertId });
  } catch (error) {
    console.error("API Create Sub-user Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
