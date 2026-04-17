import { NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { RowDataPacket } from "mysql2";

/**
 * PATCH /api/admin/devices
 * Actualiza el plan de un dispositivo usando la REST API de Firebase.
 * Body: { dni, deviceType, deviceId, plan, plan_end? }
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { dni, deviceType, deviceId, plan, plan_end } = body;

    if (!dni || !deviceType || !deviceId || !plan) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    if (!["free", "plus"].includes(plan)) {
      return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
    }
    if (!["alarmas", "portones"].includes(deviceType)) {
      return NextResponse.json({ error: "Tipo de dispositivo inválido" }, { status: 400 });
    }

    const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!databaseURL || !apiKey) {
      return NextResponse.json({ error: "Firebase no configurado" }, { status: 500 });
    }

    const path = `dispositivos/${dni}/${deviceType}/${deviceId}/config.json?auth=${apiKey}`;
    const url = `${databaseURL}/${path}`;

    const updateData: Record<string, any> = { plan };
    if (plan === "plus" && plan_end) {
      updateData.plan_end = plan_end;
      updateData.plan_start = Date.now();
    } else if (plan === "free") {
      updateData.plan_end = null;
      updateData.plan_start = null;
    }

    const firebaseRes = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (!firebaseRes.ok) {
      const errText = await firebaseRes.text();
      console.error("Firebase PATCH Error:", errText);
      return NextResponse.json({ error: "Error al actualizar Firebase" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Admin Devices PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
