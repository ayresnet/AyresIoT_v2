import { NextResponse } from "next/server";
import { syncUserToSQL } from "@/lib/db/users";

/**
 * POST /api/auth/register
 * Sincroniza los metadatos de un usuario recién creado en Firebase con nuestra DB SQL.
 * 
 * Este endpoint es idempotente: si el usuario ya existe (por email o DNI), 
 * lo vincula al nuevo firebase_uid en lugar de crear un duplicado.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firebase_uid, email, nombre, apellido, dni, celular } = body;

    if (!firebase_uid || !email || !dni) {
      return NextResponse.json({ error: "Faltan datos obligatorios (UID, Email o DNI)" }, { status: 400 });
    }

    const userId = await syncUserToSQL({
      firebase_uid,
      email,
      nombre,
      apellido,
      dni,
      celular,
      role: 'admin' // Al registrarse por la web, el usuario es Administrador por defecto
    });

    return NextResponse.json({ success: true, userId });
  } catch (error: any) {
    console.error("API Register Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
