"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

interface NavItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  fillIcon?: boolean;
}

function NavItem({ icon, label, isActive, onClick, fillIcon }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left group
        ${isActive 
          ? "bg-primary/10 text-primary border-r-2 border-primary" 
          : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/40"
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
  const { dbUser } = useAuth();
  
  const roleName = dbUser?.role === 'superadmin' ? 'Super Administrador' 
                 : dbUser?.role === 'admin' ? 'Administrador' 
                 : 'Usuario';

  const isAdmin = dbUser?.role === 'admin' || dbUser?.role === 'superadmin';

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside className={`fixed left-0 top-0 h-full w-64 bg-[#131313] bg-neutral-900 flex flex-col py-8 gap-2 font-body text-sm font-medium border-r border-outline-variant/10 overflow-y-auto z-50 transition-transform duration-300 lg:top-16 lg:h-[calc(100vh-64px)] lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Close button for mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="px-6 mb-6">
          <h3 className="text-primary font-headline text-lg font-bold">Gestión IoT</h3>
          <p className="text-on-surface-variant/60 text-xs uppercase tracking-widest">{roleName}</p>
        </div>
        
        <nav className="flex flex-col gap-1 px-3">
          <NavItem icon="dashboard" label="Dashboard" isActive />
          <NavItem icon="router" label="Mis Dispositivos" />
          
          {isAdmin && (
            <NavItem icon="group" label="Usuarios" />
          )}
          
          <NavItem icon="notifications" label="Notificaciones" />
          <NavItem icon="settings" label="Configuración" />
        </nav>
      </aside>
    </>
  );
}

