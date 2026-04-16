import { NextResponse } from "next/server";
import { getUserByFirebaseUID, getUserByEmail, updateFirebaseUID } from "@/lib/db/users";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");
  const email = searchParams.get("email"); // Nuevo parámetro opcional

  if (!uid) {
    return NextResponse.json({ error: "UID no proporcionado" }, { status: 400 });
  }

  try {
    // 1. Intentar por UID (Lo ideal)
    let dbUser = await getUserByFirebaseUID(uid);

    // 2. Si no existe por UID pero tenemos email, intentar Auto-Sync
    if (!dbUser && email) {
      dbUser = await getUserByEmail(email);
      
      if (dbUser) {
        // Encontramos al usuario por email, vinculamos su UID de forma automática
        await updateFirebaseUID(dbUser.id, uid);
        // Actualizamos el objeto en memoria para la respuesta
        dbUser.firebase_uid = uid;
        console.log(`Auto-Sync exitoso para: ${email} (UID: ${uid})`);
      }
    }

    if (!dbUser) {
      return NextResponse.json({ error: "Usuario no encontrado en SQL" }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("API Auth Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
