"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/app/dashboard/_components/PageHeader";
import dynamic from "next/dynamic";

const UserDetailDrawer = dynamic(
  () => import("./_components/UserDetailDrawer"),
  { ssr: false }
);

interface SQLUser {
  id: number;
  firebase_uid: string;
  email: string;
  nombre: string;
  apellido: string;
  dni: string;
  celular: string;
  role: "superadmin" | "admin" | "user";
  admin_dni?: string;
  device_count: number;
  created_at: string;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  superadmin: { label: "Super Admin", color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300", icon: "shield_person" },
  admin: { label: "Administrador", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300", icon: "manage_accounts" },
  user: { label: "Usuario", color: "bg-surface-container-high text-on-surface-variant", icon: "person" },
};

export default function UsuariosPage() {
  const { dbUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<SQLUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<SQLUser | null>(null);

  // Guard de acceso
  useEffect(() => {
    if (!authLoading && dbUser?.role !== "superadmin") {
      router.replace("/dashboard");
    }
  }, [authLoading, dbUser, router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        search,
        role: roleFilter,
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    if (dbUser?.role === "superadmin") {
      fetchUsers();
    }
  }, [fetchUsers, dbUser]);

  // Resetear paginación al buscar o filtrar
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  if (authLoading || dbUser?.role !== "superadmin") {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Gestión de Usuarios"
        subtitle={`${total} usuarios registrados en el sistema`}
      />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "all", label: "Todos" },
            { value: "superadmin", label: "Super Admin" },
            { value: "admin", label: "Admins" },
            { value: "user", label: "Usuarios" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleRoleFilter(value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                roleFilter === value
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container border-outline-variant/10 text-on-surface-variant hover:border-primary/30 hover:text-on-surface"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-surface rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
            <span className="text-sm">Cargando usuarios...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl block mb-3 opacity-40">group_off</span>
            <p className="text-sm">No se encontraron usuarios</p>
          </div>
        ) : (
          <>
            {/* Header de la tabla — solo desktop */}
            <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-outline-variant/10 text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">
              <span>Usuario</span>
              <span className="text-center">Rol</span>
              <span className="text-center">DNI</span>
              <span className="text-center">Dispositivos</span>
              <span className="text-right">Acciones</span>
            </div>

            {/* Filas */}
            {users.map((user) => {
              const role = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.user;
              return (
                <div
                  key={user.id}
                  className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-3 md:gap-4 px-5 py-4 border-b border-outline-variant/5 last:border-0 hover:bg-surface-container/50 transition-colors"
                >
                  {/* Columna: Nombre y email */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary-container text-xs shrink-0">
                      {user.nombre?.[0]}{user.apellido?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        {user.nombre} {user.apellido}
                      </p>
                      <p className="text-xs text-on-surface-variant">{user.email}</p>
                    </div>
                  </div>

                  {/* Columna: Rol */}
                  <div className="flex items-center justify-start md:justify-center">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-tighter ${role.color}`}>
                      <span className="material-symbols-outlined text-xs">{role.icon}</span>
                      {role.label}
                    </span>
                  </div>

                  {/* Columna: DNI */}
                  <div className="hidden md:flex items-center justify-center">
                    <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-lg">
                      {user.dni}
                    </span>
                  </div>

                  {/* Columna: Dispositivos */}
                  <div className="hidden md:flex items-center justify-center">
                    <span className="flex items-center gap-1 text-sm font-bold text-on-surface">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">router</span>
                      {user.device_count}
                    </span>
                  </div>

                  {/* Columna: Acciones */}
                  <div className="flex items-center justify-start md:justify-end">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/5 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      Inspeccionar
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-outline-variant/10 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <span className="text-sm text-on-surface-variant">
            Página <b className="text-on-surface">{page}</b> de <b className="text-on-surface">{totalPages}</b>
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-outline-variant/10 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      )}

      {/* Drawer de detalle */}
      {selectedUser && (
        <UserDetailDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
