"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface SubUser {
  id: number;
  email: string | null;
  nombre: string;
  apellido: string;
  dni: string;
  celular: string;
  role: string;
  created_at: string;
}

export default function AccesosPage() {
  const { dbUser, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<SubUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    celular: ""
  });

  const fetchUsers = useCallback(async () => {
    if (!dbUser?.dni) return;
    try {
      const res = await fetch(`/api/admin/sub-users?admin_dni=${dbUser.dni}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Error fetching sub-users:", e);
    } finally {
      setLoading(false);
    }
  }, [dbUser?.dni]);

  useEffect(() => {
    if (!authLoading && dbUser) {
      fetchUsers();
    }
  }, [authLoading, dbUser, fetchUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/sub-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          admin_dni: dbUser?.dni
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear el usuario");
      }

      setShowModal(false);
      setFormData({ nombre: "", apellido: "", dni: "", celular: "" });
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
          <p className="text-on-surface-variant font-medium animate-pulse">Cargando tus accesos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary">manage_accounts</span>
            Gestión de Accesos
          </h1>
          <p className="text-on-surface-variant mt-2">
            Administra los usuarios (familiares o empleados) que pueden acceder a tus dispositivos.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined">person_add</span>
          Agregar Usuario
        </button>
      </div>

      <div className="bg-surface-container rounded-3xl border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">
                <th className="px-6 py-5">Nombre y Apellido</th>
                <th className="px-6 py-5">DNI / Identificación</th>
                <th className="px-6 py-5">Estado de Registro</th>
                <th className="px-6 py-5">Fecha</th>
                <th className="px-6 py-5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant italic">
                    No has agregado ningún usuario todavía.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-high/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container/30 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                          {u.nombre[0]}{u.apellido[0]}
                        </div>
                        <span className="font-semibold text-on-surface truncate">{u.nombre} {u.apellido}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-on-surface/80">{u.dni}</td>
                    <td className="px-6 py-4">
                      {u.email ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase border border-green-500/20">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          Vinculado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase border border-amber-500/20">
                          <span className="material-symbols-outlined text-[12px]">pending</span>
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">
                      {new Date(u.created_at).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 rounded-xl text-on-surface-variant hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && users.length > 0 && (
        <div className="flex items-start gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
          <span className="material-symbols-outlined text-primary mt-0.5">info</span>
          <div className="text-sm text-on-surface-variant leading-relaxed">
            <p className="font-bold text-primary mb-1">¿Cómo vincular a tus usuarios?</p>
            Los usuarios marcados como <strong className="text-amber-600 font-bold uppercase text-[11px]">pendientes</strong> deben ingresar a la web y crear su propia cuenta usando el **DNI** que registraste arriba. El sistema los vinculará automáticamente a tu administración.
          </div>
        </div>
      )}

      {/* Modal Agregar Usuario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="bg-surface dark:bg-surface-container-high border border-outline-variant/10 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-on-surface">Agregar Nuevo Usuario</h2>
                  <p className="text-on-surface-variant text-xs mt-0.5">Ingresa los datos para la vinculación automática.</p>
                </div>
                <button type="button" onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {error && (
                <div className="p-4 bg-error/10 border border-error/20 text-error rounded-2xl text-sm font-medium flex items-center gap-3">
                  <span className="material-symbols-outlined">error</span>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-on-surface-variant uppercase tracking-wider">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary/50 transition-colors text-sm"
                    placeholder="Ej. María"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-on-surface-variant uppercase tracking-wider">Apellido</label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary/50 transition-colors text-sm"
                    placeholder="Ej. García"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-on-surface-variant uppercase tracking-wider">DNI / Identificación *</label>
                <input
                  type="text"
                  required
                  value={formData.dni}
                  onChange={(e) => setFormData({...formData, dni: e.target.value})}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary/50 transition-colors text-sm"
                  placeholder="Sin puntos ni espacios"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-on-surface-variant uppercase tracking-wider">Teléfono Celular</label>
                <input
                  type="text"
                  value={formData.celular}
                  onChange={(e) => setFormData({...formData, celular: e.target.value})}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary/50 transition-colors text-sm"
                  placeholder="+54 9 ..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 px-6 border border-outline-variant/30 rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-4 px-6 bg-primary text-on-primary rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">save</span>
                      Guardar Usuario
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
