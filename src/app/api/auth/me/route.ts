import { NextResponse } from "next/server";
import { getUserByFirebaseUID } from "@/lib/db/users";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "UID no proporcionado" }, { status: 400 });
  }

  try {
    const dbUser = await getUserByFirebaseUID(uid);

    if (!dbUser) {
      return NextResponse.json({ error: "Usuario no encontrado en SQL" }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("API Auth Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
