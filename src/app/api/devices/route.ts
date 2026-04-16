import { NextRequest, NextResponse } from 'next/server';
import { getDevicesByDni, createDevice, deleteDevice, deviceExists } from '@/lib/db/devices';
import type { DeviceType } from '@/lib/types/devices';

// GET /api/devices?dni=27178661
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dni = searchParams.get('dni');

    if (!dni) {
      return NextResponse.json({ error: 'DNI requerido' }, { status: 400 });
    }

    const devices = await getDevicesByDni(dni);
    return NextResponse.json(devices);
  } catch (error: any) {
    console.error('GET /api/devices error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/devices → { dni, device_type, device_alias }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dni, device_type, device_alias } = body;

    if (!dni || !device_type || !device_alias) {
      return NextResponse.json({ error: 'Faltan campos requeridos: dni, device_type, device_alias' }, { status: 400 });
    }

    const validTypes: DeviceType[] = ['alarma', 'porton'];
    if (!validTypes.includes(device_type)) {
      return NextResponse.json({ error: 'device_type inválido. Debe ser alarma o porton' }, { status: 400 });
    }

    const alias = device_alias.trim().toLowerCase();
    if (!/^[a-z0-9_]+$/.test(alias)) {
      return NextResponse.json({ error: 'El alias solo puede contener letras minúsculas, números y guiones bajos' }, { status: 400 });
    }

    // Verificar duplicados
    const exists = await deviceExists(dni, device_type, alias);
    if (exists) {
      return NextResponse.json({ error: `Ya existe ${device_type === 'alarma' ? 'una alarma' : 'un portón'} con el alias "${alias}"` }, { status: 409 });
    }

    await createDevice(dni, device_type, alias);
    return NextResponse.json({ success: true, message: 'Dispositivo registrado correctamente' }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/devices error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/devices → { dni, device_type, device_alias }
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { dni, device_type, device_alias } = body;

    if (!dni || !device_type || !device_alias) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    await deleteDevice(dni, device_type, device_alias);
    return NextResponse.json({ success: true, message: 'Dispositivo eliminado' });
  } catch (error: any) {
    console.error('DELETE /api/devices error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
