"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface NavItemProps {
  icon: string;
  label: string;
  path: string;
  currentPath: string;
  onClick?: () => void;
  fillIcon?: boolean;
}

function NavItem({ icon, label, path, currentPath, onClick, fillIcon }: NavItemProps) {
  const isActive = currentPath === path || (path !== '/dashboard' && currentPath.startsWith(path));

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left group
        ${isActive
          ? "bg-primary/10 text-primary dark:bg-primary/20 border-r-4 border-primary shadow-[4px_0_12px_-4px_rgba(92,144,255,0.3)]"
          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/60 dark:hover:bg-white/5"
        }`}
    >
      <span
        className="material-symbols-outlined transition-colors"
        style={{ fontVariationSettings: `'FILL' ${isActive || fillIcon ? 1 : 0}` }}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

interface SideNavBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideNavBar({ isOpen, onClose }: SideNavBarProps) {
  const { dbUser, loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const roleName = loading ? "Cargando..."
    : dbUser?.role === "superadmin" ? "Super Administrador"
    : dbUser?.role === "admin" ? "Administrador"
    : dbUser ? "Usuario"
    : "Perfil no vinculado";

  const isAdmin = dbUser?.role === "admin" || dbUser?.role === "superadmin";

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside className={`fixed left-0 top-0 h-full w-64 bg-surface dark:bg-surface flex flex-col py-8 gap-2 font-body text-sm font-medium border-r border-outline-variant/20 dark:border-white/5 overflow-y-auto z-50 transition-transform duration-300 lg:top-16 lg:h-[calc(100vh-64px)] lg:translate-x-0 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* User info */}
        <div className="px-6 mb-6">
          <h3 className="text-primary font-headline text-lg font-bold">
            {dbUser?.nombre ? `${dbUser.nombre} ${dbUser.apellido ?? ''}`.trim() : 'Gestión IoT'}
          </h3>
          <p className="text-on-surface-variant/60 text-xs uppercase tracking-widest">{roleName}</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3">
          <NavItem
            icon="dashboard"
            label="Dashboard"
            path="/dashboard"
            currentPath={pathname}
            onClick={() => navigate('/dashboard')}
          />
          <NavItem
            icon="router"
            label="Mis Dispositivos"
            path="/dashboard/dispositivos"
            currentPath={pathname}
            onClick={() => navigate('/dashboard/dispositivos')}
          />

          {dbUser?.role === 'superadmin' && (
            <NavItem
              icon="group"
              label="Usuarios"
              path="/dashboard/usuarios"
              currentPath={pathname}
              onClick={() => navigate('/dashboard/usuarios')}
            />
          )}

          {dbUser?.role === 'admin' && (
            <NavItem
              icon="manage_accounts"
              label="Gestión de accesos"
              path="/dashboard/accesos"
              currentPath={pathname}
              onClick={() => navigate('/dashboard/accesos')}
            />
          )}

          <NavItem
            icon="notifications"
            label="Notificaciones"
            path="/dashboard/notificaciones"
            currentPath={pathname}
            onClick={() => navigate('/dashboard/notificaciones')}
          />
          <NavItem
            icon="settings"
            label="Configuración"
            path="/dashboard/configuracion"
            currentPath={pathname}
            onClick={() => navigate('/dashboard/configuracion')}
          />
        </nav>

        {/* Logout (Visible en móvil para limpiar el TopBar) */}
        <div className="px-3 md:hidden">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left text-error hover:bg-error/10 transition-all duration-300"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto px-4 pt-4 border-t border-outline-variant/10">
          <p className="text-[10px] text-on-surface-variant/50 text-center uppercase tracking-widest">AyresIoT v2.0</p>
        </div>
      </aside>
    </>
  );
}
