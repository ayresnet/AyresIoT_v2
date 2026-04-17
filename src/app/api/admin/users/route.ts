import { NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { RowDataPacket } from "mysql2";

/**
 * GET /api/admin/users
 * Solo accesible por superadmin (validación de rol en el cliente via AuthContext).
 * Devuelve la lista paginada de usuarios con sus estadísticas.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  try {
    let whereClause = "WHERE 1=1";
    const params: (string | number)[] = [];

    if (search) {
      whereClause += " AND (nombre LIKE ? OR apellido LIKE ? OR email LIKE ? OR dni LIKE ?)";
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch, likeSearch, likeSearch);
    }

    if (role !== "all") {
      whereClause += " AND role = ?";
      params.push(role);
    }

    // Query principal con conteo de dispositivos
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        u.id, u.firebase_uid, u.email, u.nombre, u.apellido, 
        u.dni, u.celular, u.role, u.admin_dni, u.custom_user_limit,
        u.created_at,
        COUNT(ud.id) as device_count
       FROM users u
       LEFT JOIN user_devices ud ON u.id = ud.user_id
       ${whereClause}
       GROUP BY u.id
       ORDER BY u.role ASC, u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Query de conteo total para paginación
    const [countRows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    const total = (countRows[0] as any).total;

    return NextResponse.json({
      users: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("API Admin Users GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/users
 * Actualiza el rol de un usuario.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    if (!["superadmin", "admin", "user"].includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    await pool.execute(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Admin Users PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
